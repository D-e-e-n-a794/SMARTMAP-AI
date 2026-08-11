const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  placeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
    required: true,
    index: true
  },
  userName: {
    type: String,
    default: 'Anonymous User'
  },
  userImage: {
    type: String,
    default: 'https://i.pravatar.cc/150'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    default: 'Great experience!'
  },
  comment: {
    type: String,
    required: true
  },
  images: [String],
  helpful: {
    type: Number,
    default: 0
  },
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
reviewSchema.index({ placeId: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);
