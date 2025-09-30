import { Schema, model } from "mongoose";

const jobProviderProfileSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  companyInfo: {
    companyName: {
      type: String,
      required: true,
      trim: true
    },
    companySize: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
      required: true
    },
    industry: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true,
      maxLength: 2000
    },
    website: String,
    foundedYear: Number,
    headquarters: {
      address: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    }
  },
  contactInfo: {
    primaryContact: {
      name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      phone: String,
      designation: String
    },
    hrContact: {
      name: String,
      email: String,
      phone: String
    }
  },
  verification: {
    businessEmail: {
      type: String,
      required: true
    },
    gstin: String,
    businessLicense: String,
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedAt: Date,
    verificationDocuments: [{
      type: String,
      url: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  companyLogo: {
    public_id: String,
    secure_url: String
  },
  socialMedia: {
    linkedin: String,
    twitter: String,
    facebook: String,
    instagram: String
  },
  benefits: [String],
  culture: {
    values: [String],
    workEnvironment: String,
    perks: [String]
  },
  subscription: {
    plan: {
      type: String,
      enum: ['Free', 'Basic', 'Premium', 'Enterprise'],
      default: 'Free'
    },
    jobPostsLimit: {
      type: Number,
      default: 3
    },
    jobPostsUsed: {
      type: Number,
      default: 0
    },
    expiresAt: Date,
    features: [String]
  },
  stats: {
    totalJobsPosted: {
      type: Number,
      default: 0
    },
    activeJobs: {
      type: Number,
      default: 0
    },
    totalApplications: {
      type: Number,
      default: 0
    },
    totalHires: {
      type: Number,
      default: 0
    }
  },
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    smsNotifications: {
      type: Boolean,
      default: false
    },
    applicationAlerts: {
      type: Boolean,
      default: true
    }
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Suspended', 'Pending Verification'],
    default: 'Pending Verification'
  }
}, {
  timestamps: true
});

// Check if company can post more jobs
jobProviderProfileSchema.methods.canPostJob = function() {
  return this.subscription.jobPostsUsed < this.subscription.jobPostsLimit;
};

// Increment job post count
jobProviderProfileSchema.methods.incrementJobPost = function() {
  if (this.canPostJob()) {
    this.subscription.jobPostsUsed += 1;
    this.stats.totalJobsPosted += 1;
    this.stats.activeJobs += 1;
    return true;
  }
  return false;
};

const JobProviderProfile = model('JobProviderProfile', jobProviderProfileSchema);

export default JobProviderProfile;