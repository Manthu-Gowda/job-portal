import { Schema, model } from "mongoose";

const jobSchema = new Schema({
  jobProviderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'JobProviderProfile',
    required: true
  },
  basicInfo: {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100
    },
    department: String,
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'],
      required: true
    },
    workMode: {
      type: String,
      enum: ['Remote', 'On-site', 'Hybrid'],
      required: true
    },
    experienceLevel: {
      type: String,
      enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'],
      required: true
    }
  },
  description: {
    overview: {
      type: String,
      required: true,
      maxLength: 2000
    },
    responsibilities: [String],
    requirements: [String],
    preferredQualifications: [String],
    benefits: [String]
  },
  location: {
    country: {
      type: String,
      required: true
    },
    state: String,
    city: String,
    address: String,
    zipCode: String,
    isRemote: {
      type: Boolean,
      default: false
    }
  },
  compensation: {
    salaryRange: {
      min: {
        type: Number,
        required: true
      },
      max: {
        type: Number,
        required: true
      },
      currency: {
        type: String,
        default: 'USD'
      },
      period: {
        type: String,
        enum: ['Hourly', 'Monthly', 'Yearly'],
        default: 'Yearly'
      }
    },
    negotiable: {
      type: Boolean,
      default: false
    },
    additionalBenefits: [String]
  },
  requirements: {
    education: {
      level: {
        type: String,
        enum: ['High School', 'Associate', 'Bachelor', 'Master', 'PhD', 'Not Required']
      },
      field: String
    },
    experience: {
      min: {
        type: Number,
        default: 0
      },
      max: Number
    },
    skills: {
      required: [String],
      preferred: [String]
    },
    languages: [String],
    certifications: [String]
  },
  applicationProcess: {
    applicationDeadline: Date,
    screeningQuestions: [{
      question: {
        type: String,
        required: true
      },
      type: {
        type: String,
        enum: ['text', 'multiple-choice', 'yes-no', 'file-upload'],
        default: 'text'
      },
      required: {
        type: Boolean,
        default: false
      },
      options: [String] // for multiple-choice questions
    }],
    requireCoverLetter: {
      type: Boolean,
      default: false
    },
    requirePortfolio: {
      type: Boolean,
      default: false
    }
  },
  status: {
    type: String,
    enum: ['Draft', 'Active', 'Paused', 'Closed', 'Expired'],
    default: 'Draft'
  },
  visibility: {
    type: String,
    enum: ['Public', 'Private', 'Internal'],
    default: 'Public'
  },
  stats: {
    views: {
      type: Number,
      default: 0
    },
    applications: {
      type: Number,
      default: 0
    },
    shortlisted: {
      type: Number,
      default: 0
    },
    interviewed: {
      type: Number,
      default: 0
    },
    hired: {
      type: Number,
      default: 0
    }
  },
  seo: {
    slug: {
      type: String,
      unique: true
    },
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  moderation: {
    isApproved: {
      type: Boolean,
      default: false
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: Date,
    rejectionReason: String,
    flags: [{
      reason: String,
      reportedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      reportedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  postedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: Date,
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Generate slug from title
jobSchema.pre('save', function(next) {
  if (this.isModified('basicInfo.title')) {
    this.seo.slug = this.basicInfo.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') + '-' + this._id.toString().slice(-6);
  }
  this.lastModified = new Date();
  next();
});

// Increment view count
jobSchema.methods.incrementViews = function() {
  this.stats.views += 1;
  return this.save();
};

// Check if job is expired
jobSchema.methods.isExpired = function() {
  return this.expiresAt && new Date() > this.expiresAt;
};

// Text search index
jobSchema.index({
  'basicInfo.title': 'text',
  'description.overview': 'text',
  'requirements.skills.required': 'text',
  'location.city': 'text',
  'location.state': 'text'
});

// Compound indexes for efficient queries
jobSchema.index({ status: 1, 'moderation.isApproved': 1, postedAt: -1 });
jobSchema.index({ 'location.city': 1, 'basicInfo.jobType': 1 });
jobSchema.index({ jobProviderId: 1, status: 1 });

const Job = model('Job', jobSchema);

export default Job;