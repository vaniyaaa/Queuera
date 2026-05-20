const mongoose = require('mongoose');

const ConnectedAccountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    platform: {
      type: String,
      required: true,
      enum: ['FACEBOOK', 'INSTAGRAM', 'LINKEDIN'],
    },
    platformAccountId: { type: String, required: true },
    platformAccountName: { type: String, required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, default: null },
    tokenExpiresAt: { type: Date, default: null },
    scope: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

ConnectedAccountSchema.index(
  { userId: 1, platformAccountId: 1, platform: 1 },
  { unique: true },
);

module.exports = mongoose.model('ConnectedAccount', ConnectedAccountSchema);
