import asyncHandler from "../middlewares/asyncHAndler.middleware.js";
import JobSeekerProfile from "../models/jobSeekerProfile.model.js";
import Job from "../models/job.model.js";
import Application from "../models/application.model.js";
import AppError from "../utils/error.util.js";
import cloudinary from 'cloudinary';
import fs from 'fs/promises';

// Create or update job seeker profile
export const createOrUpdateProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const profileData = req.body;

  try {
    let profile = await JobSeekerProfile.findOne({ userId });

    if (profile) {
      // Update existing profile
      Object.keys(profileData).forEach(key => {
        if (profileData[key] !== undefined) {
          profile[key] = profileData[key];
        }
      });
    } else {
      // Create new profile
      profile = new JobSeekerProfile({
        userId,
        ...profileData
      });
    }

    // Handle resume upload
    if (req.file) {
      try {
        // Delete old resume if exists
        if (profile.resume.public_id) {
          await cloudinary.v2.uploader.destroy(profile.resume.public_id);
        }

        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: 'job-portal/resumes',
          resource_type: 'auto'
        });

        profile.resume = {
          public_id: result.public_id,
          secure_url: result.secure_url,
          uploadedAt: new Date()
        };

        // Remove file from local server
        await fs.rm(req.file.path);
      } catch (error) {
        return next(new AppError('Resume upload failed', 500));
      }
    }

    // Calculate profile completeness
    profile.calculateCompleteness();
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

// Get job seeker profile
export const getProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const profile = await JobSeekerProfile.findOne({ userId }).populate('userId', 'fullName email avatar');

  if (!profile) {
    return next(new AppError('Profile not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Profile retrieved successfully',
    profile
  });
});

// Search jobs with filters
export const searchJobs = asyncHandler(async (req, res, next) => {
  const {
    keyword,
    location,
    jobType,
    workMode,
    experienceLevel,
    salaryMin,
    salaryMax,
    page = 1,
    limit = 10,
    sortBy = 'postedAt',
    sortOrder = 'desc'
  } = req.query;

  try {
    const query = {
      status: 'Active',
      'moderation.isApproved': true
    };

    // Text search
    if (keyword) {
      query.$text = { $search: keyword };
    }

    // Location filter
    if (location) {
      query.$or = [
        { 'location.city': new RegExp(location, 'i') },
        { 'location.state': new RegExp(location, 'i') },
        { 'location.country': new RegExp(location, 'i') }
      ];
    }

    // Job type filter
    if (jobType) {
      query['basicInfo.jobType'] = jobType;
    }

    // Work mode filter
    if (workMode) {
      query['basicInfo.workMode'] = workMode;
    }

    // Experience level filter
    if (experienceLevel) {
      query['basicInfo.experienceLevel'] = experienceLevel;
    }

    // Salary range filter
    if (salaryMin || salaryMax) {
      query['compensation.salaryRange.min'] = {};
      if (salaryMin) {
        query['compensation.salaryRange.min'].$gte = parseInt(salaryMin);
      }
      if (salaryMax) {
        query['compensation.salaryRange.max'] = { $lte: parseInt(salaryMax) };
      }
    }

    const skip = (page - 1) * limit;
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const jobs = await Job.find(query)
      .populate('companyId', 'companyInfo.companyName companyInfo.industry companyLogo')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-moderation -seo');

    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Jobs retrieved successfully',
      jobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalJobs: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
});

// Get job details
export const getJobDetails = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;
  const userId = req.user.id;

  try {
    const job = await Job.findById(jobId)
      .populate('companyId', 'companyInfo companyLogo socialMedia')
      .populate('jobProviderId', 'fullName email');

    if (!job) {
      return next(new AppError('Job not found', 404));
    }

    if (job.status !== 'Active' || !job.moderation.isApproved) {
      return next(new AppError('Job is not available', 400));
    }

    // Increment view count
    await job.incrementViews();

    // Check if user has already applied
    const existingApplication = await Application.findOne({
      jobId,
      jobSeekerId: userId
    });

    res.status(200).json({
      success: true,
      message: 'Job details retrieved successfully',
      job,
      hasApplied: !!existingApplication
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
});

// Apply for a job
export const applyForJob = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;
  const userId = req.user.id;
  const { coverLetter, screeningAnswers } = req.body;

  try {
    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job || job.status !== 'Active' || !job.moderation.isApproved) {
      return next(new AppError('Job is not available for application', 400));
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      jobId,
      jobSeekerId: userId
    });

    if (existingApplication) {
      return next(new AppError('You have already applied for this job', 400));
    }

    // Get job seeker profile for resume
    const profile = await JobSeekerProfile.findOne({ userId });
    if (!profile || !profile.resume.secure_url) {
      return next(new AppError('Please upload your resume before applying', 400));
    }

    // Create application
    const applicationData = {
      jobId,
      jobSeekerId: userId,
      jobProviderId: job.jobProviderId,
      applicationData: {
        resume: profile.resume,
        coverLetter,
        screeningAnswers: screeningAnswers || []
      },
      status: {
        current: 'Applied',
        history: [{
          status: 'Applied',
          changedAt: new Date(),
          changedBy: userId
        }]
      }
    };

    const application = await Application.create(applicationData);

    // Update job stats
    job.stats.applications += 1;
    await job.save();

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
});

// Get user's applications
export const getMyApplications = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { status, page = 1, limit = 10 } = req.query;

  try {
    const query = { jobSeekerId: userId };
    
    if (status) {
      query['status.current'] = status;
    }

    const skip = (page - 1) * limit;

    const applications = await Application.find(query)
      .populate('jobId', 'basicInfo location compensation status')
      .populate('jobProviderId', 'fullName')
      .populate({
        path: 'jobId',
        populate: {
          path: 'companyId',
          select: 'companyInfo.companyName companyLogo'
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

// Withdraw application
export const withdrawApplication = asyncHandler(async (req, res, next) => {
  const { applicationId } = req.params;
  const userId = req.user.id;

  try {
    const application = await Application.findOne({
      _id: applicationId,
      jobSeekerId: userId
    });

    if (!application) {
      return next(new AppError('Application not found', 404));
    }

    if (!application.isActive()) {
      return next(new AppError('Cannot withdraw this application', 400));
    }

    await application.updateStatus('Withdrawn', userId, 'Application withdrawn by candidate');

    res.status(200).json({
      success: true,
      message: 'Application withdrawn successfully'
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
});

// Get dashboard stats
export const getDashboardStats = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  try {
    const totalApplications = await Application.countDocuments({ jobSeekerId: userId });
    const activeApplications = await Application.countDocuments({
      jobSeekerId: userId,
      'status.current': { $nin: ['Hired', 'Rejected', 'Withdrawn'] }
    });
    const interviews = await Application.countDocuments({
      jobSeekerId: userId,
      'status.current': { $in: ['Interview Scheduled', 'Interviewed'] }
    });
    const offers = await Application.countDocuments({
      jobSeekerId: userId,
      'status.current': 'Offered'
    });

    // Get profile completeness
    const profile = await JobSeekerProfile.findOne({ userId });
    const profileCompleteness = profile ? profile.profileCompleteness : 0;

    // Recent applications
    const recentApplications = await Application.find({ jobSeekerId: userId })
      .populate('jobId', 'basicInfo')
      .populate({
        path: 'jobId',
        populate: {
          path: 'companyId',
          select: 'companyInfo.companyName'
        }
      })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      message: 'Dashboard stats retrieved successfully',
      stats: {
        totalApplications,
        activeApplications,
        interviews,
        offers,
        profileCompleteness
      },
      recentApplications
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
});