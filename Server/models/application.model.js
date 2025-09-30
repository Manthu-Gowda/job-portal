import { Schema, model } from "mongoose";

const applicationSchema = new Schema({
  jobId: {
    type: Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  jobSeekerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobProviderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applicationData: {
    resume: {
      public_id: String,
      secure_url: String,
      filename: String
    },
    coverLetter: {
      type: String,
      maxLength: 2000
    },
    portfolio: {
      url: String,
      files: [{
        public_id: String,
        secure_url: String,
        filename: String
      }]
    },
    screeningAnswers: [{
      questionId: String,
      question: String,
      answer: String,
      fileUpload: {
        public_id: String,
        secure_url: String,
        filename: String
      }
    }]
  },
  status: {
    current: {
      type: String,
      enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Interviewed', 'Offered', 'Hired', 'Rejected', 'Withdrawn'],
      default: 'Applied'
    },
    history: [{
      status: {
        type: String,
        enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Interviewed', 'Offered', 'Hired', 'Rejected', 'Withdrawn']
      },
      changedAt: {
        type: Date,
        default: Date.now
      },
      changedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      notes: String
    }]
  },
  interview: {
    scheduledDate: Date,
    scheduledTime: String,
    duration: Number, // in minutes
    mode: {
      type: String,
      enum: ['In-person', 'Video Call', 'Phone Call']
    },
    location: String,
    meetingLink: String,
    interviewers: [{
      name: String,
      email: String,
      role: String
    }],
    notes: String,
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comments: String,
      strengths: [String],
      weaknesses: [String],
      recommendation: {
        type: String,
        enum: ['Strongly Recommend', 'Recommend', 'Maybe', 'Do Not Recommend']
      }
    }
  },
  offer: {
    salary: {
      amount: Number,
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
    startDate: Date,
    benefits: [String],
    terms: String,
    expiresAt: Date,
    response: {
      type: String,
      enum: ['Pending', 'Accepted', 'Declined', 'Negotiating']
    },
    responseDate: Date,
    negotiationNotes: String
  },
  communication: [{
    from: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    }
  }],
  ratings: {
    candidateRating: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      feedback: String
    },
    employerRating: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      feedback: String
    }
  },
  metadata: {
    source: {
      type: String,
      default: 'Direct'
    },
    utmSource: String,
    utmMedium: String,
    utmCampaign: String,
    referredBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    ipAddress: String,
    userAgent: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
applicationSchema.index({ jobId: 1, jobSeekerId: 1 }, { unique: true });
applicationSchema.index({ jobProviderId: 1, 'status.current': 1, createdAt: -1 });
applicationSchema.index({ jobSeekerId: 1, 'status.current': 1, createdAt: -1 });

// Update status with history tracking
applicationSchema.methods.updateStatus = function(newStatus, changedBy, notes) {
  this.status.history.push({
    status: this.status.current,
    changedAt: new Date(),
    changedBy,
    notes
  });
  this.status.current = newStatus;
  return this.save();
};

// Check if application is in active status
applicationSchema.methods.isActive = function() {
  const inactiveStatuses = ['Hired', 'Rejected', 'Withdrawn'];
  return !inactiveStatuses.includes(this.status.current);
};

const Application = model('Application', applicationSchema);

export default Application;