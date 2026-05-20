const mongoose = require('mongoose');

const ScheduledPostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    connectedAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ConnectedAccount',
      required: true,
    },
    content: { type: String, required: true },
    mediaUrls: { type: [String], default: [] },
    scheduledAt: { type: Date, required: true },
    publishedAt: { type: Date, default: null },
    status: {
      type: String,
      required: true,
      enum: ['DRAFT', 'QUEUED', 'PUBLISHED', 'FAILED'],
      default: 'QUEUED',
    },
    failureReason: { type: String, default: null },
    jobId: { type: String, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model('ScheduledPost', ScheduledPostSchema);
