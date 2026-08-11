const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Place = require('../models/Place');

// GET /api/reviews/place/:placeId - Get reviews for a place
router.get('/place/:placeId', async (req, res) => {
  try {
    const reviews = await Review.find({ placeId: req.params.placeId })
      .sort({ createdAt: -1 })
      .limit(100)
      .select('-__v');

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reviews'
    });
  }
});

// POST /api/reviews - Create new review
router.post('/', async (req, res) => {
  try {
    const { placeId, userName, rating, comment, title } = req.body;

    if (!placeId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        error: 'PlaceId, rating, and comment are required'
      });
    }

    // Check if place exists
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({
        success: false,
        error: 'Place not found'
      });
    }

    // Create review
    const review = new Review({
      placeId,
      userName: userName || 'Anonymous',
      rating: parseFloat(rating),
      comment,
      title: title || 'Great experience!',
      verified: Math.random() > 0.3, // 70% verified for demo
      userImage: `https://i.pravatar.cc/150?u=${userName || Date.now()}`
    });

    const savedReview = await review.save();

    // Update place rating
    const allReviews = await Review.find({ placeId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await Place.findByIdAndUpdate(placeId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: allReviews.length
    });

    res.status(201).json({
      success: true,
      data: savedReview
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create review'
    });
  }
});

// PATCH /api/reviews/:id/helpful - Mark review as helpful
router.patch('/:id/helpful', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpful: 1 } },
      { new: true }
    ).select('-__v');

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update review'
    });
  }
});

module.exports = router;
