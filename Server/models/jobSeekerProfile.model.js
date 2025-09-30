import { Schema, model } from "mongoose";

const jobSeekerProfileSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  personalInfo: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true
    },
    location: {
      city: String,
      state: String,
      country: String,
      zipCode: String
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say']
    }
  },
  professionalInfo: {
    currentJobTitle: String,
    experience: {
      type: Number,
      default: 0 // in years
    },
    expectedSalary: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'USD'
      }
    },
    skills: [String],
    industries: [String],
    jobTypes: [{
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship']
    }],
    workPreference: {
      type: String,
      enum: ['Remote', 'On-site', 'Hybrid'],
      default: 'On-site'
    }
  },
  workExperience: [{
    company: {
      type: String,
      required: true
    },
    position: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: Date,
    isCurrentJob: {
      type: Boolean,
      default: false
    },
    description: String,
    location: String
  }],
  education: [{
    institution: {
      type: String,
      required: true
    },
    degree: {
      type: String,
      required: true
    },
    fieldOfStudy: String,
    startDate: Date,
    endDate: Date,
    grade: String
  }],
  resume: {
    public_id: String,
    secure_url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  portfolio: {
    website: String,
    linkedin: String,
    github: String,
    other: [String]
  },
  preferences: {
    jobAlerts: {
      type: Boolean,
      default: true
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    smsNotifications: {
      type: Boolean,
      default: false
    }
  },
  profileCompleteness: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Suspended'],
    default: 'Active'
  }
}, {
  timestamps: true
});

// Calculate profile completeness
jobSeekerProfileSchema.methods.calculateCompleteness = function() {
  let score = 0;
  const weights = {
    personalInfo: 20,
    professionalInfo: 25,
    workExperience: 20,
    education: 15,
    resume: 20
  };

  // Personal info completeness
  if (this.personalInfo.firstName && this.personalInfo.lastName && this.personalInfo.phone) {
    score += weights.personalInfo;
  }

  // Professional info completeness
  if (this.professionalInfo.skills.length > 0 && this.professionalInfo.expectedSalary.min) {
    score += weights.professionalInfo;
  }

  // Work experience
  if (this.workExperience.length > 0) {
    score += weights.workExperience;
  }

  // Education
  if (this.education.length > 0) {
    score += weights.education;
  }

  // Resume
  if (this.resume.secure_url) {
    score += weights.resume;
  }

  this.profileCompleteness = score;
  return score;
};

const JobSeekerProfile = model('JobSeekerProfile', jobSeekerProfileSchema);

export default JobSeekerProfile;