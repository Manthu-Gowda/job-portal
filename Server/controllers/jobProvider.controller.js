import asyncHandler from "../middlewares/asyncHAndler.middleware.js";
import JobProviderProfile from "../models/jobProviderProfile.model.js";
import Job from "../models/job.model.js";
import Application from "../models/application.model.js";
import AppError from "../utils/error.util.js";
import cloudinary from 'cloudinary';
import fs from 'fs/promises';

// Create or update job provider profile
export const createOrUpdateProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const profileData = req.body;

  try {
    let profile = await JobProviderProfile.findOne({ userId });

    if (profile) {
      // Update existing profile
      Object.keys(profileData).forEach(key => {
        if (profileData[key] !== undefined) {
          profile[key] = profileData[key];
        }
      });
    } else {
      // Create new profile
      profile = new JobProviderProfile({
        userId,
        ...profileData
      });
    }

    // Handle company logo upload
    if (req.file) {
      try {
        // Delete old logo if exists
        if (profile.companyLogo.public_id) {
          await cloudinary.v2.uploader.destroy(profile.companyLogo.public_id);
        }

        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: 'job-portal/company-logos',
          width: 300,
          height: 300,
          crop: 'fill'
        });

        profile.companyLogo = {
          public_id: result.public_id,
          secure_url: result.secure_url
        };

        // Remove file from local server
        await fs.rm(req.file.path);
      } catch (error) {
        return next(new AppError('Logo upload failed', 500));
      }
    }

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
});

// Get job provider profile
export const getProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const profile = await JobProviderProfile.findOne({ userId }).populate('userId', 'fullName email');

  if (!profile) {
    return next(new AppError('Profile not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Profile retrieved successfully',
    profile
  });
});

// Create a new job posting
export const createJob = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const jobData = req.body;

  try {
    // Get company profile
    const companyProfile = await JobProviderProfile.findOne({ userId });
    if (!companyProfile) {
      return next(new AppError('Please complete your company profile first', 400));
    }

    if (!companyProfile.verification.isVerified) {
      return next(new AppError('Company verification is required to post jobs', 400));
    }

    if (!companyProfile.canPostJob()) {
      return next(new AppError('Job posting limit reached. Please upgrade your plan', 400));
    }

    // Create job
    const job = new Job({
      jobProviderId: userId,
      companyId: companyProfile._id,
      ...jobData,
      status: 'Active',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    });

    await job.save();

    // Update company stats
    companyProfile.incrementJobPost();
    await companyProfile.save();

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      job
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
});

// Get all jobs posted by the provider
export const getMyJobs = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { status, page = 1, limit = 10 } = req.query;

  try {
    const query = { jobProviderId: userId };
    
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const jobs = await Job.find(query)
      .populate('companyId', 'companyInfo.companyName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Jobs retrieved successfully',
      jobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalJobs: total
      }
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
});

// Update job posting
export const updateJob = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;
  const userId = req.user.id;
  const updateData = req.body;

  try {
    const job = await Job.findOne({ _id: jobId, jobProviderId: userId });

    if (!job) {
      return next(new AppError('Job not found', 404));
    }

    // Update job fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        job[key] = updateData[key];
      }
    });

    job.lastModified = new Date();
    await job.save();

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      job
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
});

// Delete/Close job posting
export const deleteJob = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;
  const userId = req.user.id;

  try {
    const job = await Job.findOne({ _id: jobId, jobProviderId: userId });

    if (!job) {
      return next(new AppError('Job not found', 404));
    }

    job.status = 'Closed';
    await job.save();

    // Update company stats
    const companyProfile = await JobProviderProfile.findOne({ userId });
    if (companyProfile) {
      companyProfile.stats.activeJobs = Math.max(0, companyProfile.stats.activeJobs - 1);
      await companyProfile.save();
    }

    res.status(200).json({
      success: true,
      message: 'Job closed successfully'
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
});

// Get applications for a specific job
export const getJobApplications = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;
  const userId = req.user.id;
  const { status, page = 1, limit = 10 } = req.query;

  try {
    // Verify job ownership
    const job = await Job.findOne({ _id: jobId, jobProviderId: userId });
    if (!job) {
      return next(new AppError('Job not found', 404));
    }

    const query = { jobId };
    if (status) {
      query['status.current'] = status;
    }

    const skip = (page - 1) * limit;

    const applications = await Application.find(query)
      .populate('jobSeekerId', 'fullName email avatar')
      .populate({
        path: 'jobSeekerId',
        populate: {
          path: 'jobSeekerProfile',
          model: 'JobSeekerProfile',
          select: 'professionalInfo.experience professionalInfo.skills professionalInfo.currentJobTitle'
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Application.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Applications retrieved successfully',
      applications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalApplications: total
      }
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
});

// Update application status
export const updateApplicationStatus = asyncHandler(async (req, res, next) => {
  const { applicationId } = req.params;
  const userId = req.user.id;
  const { status, notes } = req.body;

  try {
    const application = await Application.findOne({
      _id: applicationId,
      jobProviderId: userId
    });

    if (!application) {
      return next(new AppError('Application not found', 404));
    }

    await application.updateStatus(status, userId, notes);

    // Update job stats based on status
    const job = await Job.findById(application.jobId);
    if (job) {
      switch (status) {
        case 'Shortlisted':
          job.stats.shortlisted += 1;
          break;
        case 'Interviewed':
          job.stats.interviewed += 1;
          break;
        case 'Hired':
          job.stats.hired += 1;
          // Update company stats
          const companyProfile = await JobProviderProfile.findOne({ userId });
          if (companyProfile) {
            companyProfile.stats.totalHires += 1;
            await companyProfile.save();
          }
          break;
      }
      await job.save();
    }

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      application
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
});

// Schedule interview
export const scheduleInterview = asyncHandler(async (req, res, next) => {
  const { applicationId } = req.params;
  const userId = req.user.id;
  const interviewData = req.body;

  try {
    const application = await Application.findOne({
      _id: applicationId,
      jobProviderId: userId
    });

    if (!application) {
      return next(new AppError('Application not found', 404));
    }

    application.interview = {
      ...interviewData,
      scheduledDate: new Date(interviewData.scheduledDate)
    };

    await application.updateStatus('Interview Scheduled', userId, 'Interview scheduled');

    res.status(200).json({
      success: true,
      message: 'Interview scheduled successfully',
      application
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
});

// Get dashboard stats
export const getDashboardStats = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  try {
    const totalJobs = await Job.countDocuments({ jobProviderId: userId });
    const activeJobs = await Job.countDocuments({ 
      jobProviderId: userId, 
      status: 'Active' 
    });
    const totalApplications = await Application.countDocuments({ jobProviderId: userId });
    const pendingApplications = await Application.countDocuments({
      jobProviderId: userId,
      'status.current': { $in: ['Applied', 'Under Review'] }
    });

    // Get recent applications
    const recentApplications = await Application.find({ jobProviderId: userId })
      .populate('jobSeekerId', 'fullName email')
      .populate('jobId', 'basicInfo.title')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get top performing jobs
    const topJobs = await Job.find({ jobProviderId: userId })
      .sort({ 'stats.applications': -1 })
      .limit(5)
      .select('basicInfo.title stats');

    res.status(200).json({
      success: true,
      message: 'Dashboard stats retrieved successfully',
      stats: {
        totalJobs,
        activeJobs,
        totalApplications,
        pendingApplications
      },
      recentApplications,
      topJobs
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
});

// Get analytics data
export const getAnalytics = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { period = '30' } = req.query; // days

  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Application trends
    const applicationTrends = await Application.aggregate([
      {
        $match: {
          jobProviderId: userId,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Status distribution
    const statusDistribution = await Application.aggregate([
      {
        $match: { jobProviderId: userId }
      },
      {
        $group: {
          _id: "$status.current",
          count: { $sum: 1 }
        }
      }
    ]);

    // Job performance
    const jobPerformance = await Job.aggregate([
      {
        $match: { jobProviderId: userId }
      },
      {
        $project: {
          title: "$basicInfo.title",
          views: "$stats.views",
          applications: "$stats.applications",
          conversionRate: {
            $cond: {
              if: { $gt: ["$stats.views", 0] },
              then: { $multiply: [{ $divide: ["$stats.applications", "$stats.views"] }, 100] },
              else: 0
            }
          }
        }
      },
      { $sort: { applications: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      message: 'Analytics data retrieved successfully',
      analytics: {
        applicationTrends,
        statusDistribution,
        jobPerformance
      }
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
});