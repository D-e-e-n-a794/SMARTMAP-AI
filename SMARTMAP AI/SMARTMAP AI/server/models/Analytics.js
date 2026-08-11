const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  event: {
    type: String,
    required: true,
    enum: ['visit', 'search', 'review', 'save', 'direction'],
    index: true
  },
  placeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place'
  },
  category: String,
  metadata: mongoose.Schema.Types.Mixed,
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Index for time-based queries
analyticsSchema.index({ timestamp: -1 });
analyticsSchema.index({ event: 1, timestamp: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
