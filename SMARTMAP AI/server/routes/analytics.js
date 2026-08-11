// File: server/routes/analytics.js
// Add these endpoints to your backend

const express = require('express');
const router = express.Router();
const Analytics = require('../models/Analytics');
const Place = require('../models/Place');

// ═══════════════════════════════════════════════════════════
// GET OVERVIEW - All summary stats
// ═══════════════════════════════════════════════════════════
router.get('/overview', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Total events
    const totalEvents = await Analytics.countDocuments();
    
    // Events by type (last 30 days)
    const eventCounts = await Analytics.aggregate([
      {
        $match: { timestamp: { $gte: thirtyDaysAgo } }
      },
      {
        $group: {
          _id: '$event',
          count: { $sum: 1 }
        }
      }
    ]);

    // Top searched places
    const topSearches = await Analytics.aggregate([
      {
        $match: { 
          event: 'search',
          timestamp: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: '$placeId',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: 'places',
          localField: '_id',
          foreignField: '_id',
          as: 'place'
        }
      }
    ]);

    // Total saves (favorites)
    const totalSaves = await Analytics.countDocuments({
      event: 'save',
      timestamp: { $gte: thirtyDaysAgo }
    });

    // Total visits
    const totalVisits = await Analytics.countDocuments({
      event: 'visit',
      timestamp: { $gte: thirtyDaysAgo }
    });

    // Total reviews
    const totalReviews = await Analytics.countDocuments({
      event: 'review',
      timestamp: { $gte: thirtyDaysAgo }
    });

    // Daily counts for trend
    const dailyTrends = await Analytics.aggregate([
      {
        $match: { timestamp: { $gte: thirtyDaysAgo } }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          visits: {
            $sum: { $cond: [{ $eq: ['$event', 'visit'] }, 1, 0] }
          },
          searches: {
            $sum: { $cond: [{ $eq: ['$event', 'search'] }, 1, 0] }
          },
          reviews: {
            $sum: { $cond: [{ $eq: ['$event', 'review'] }, 1, 0] }
          },
          saves: {
            $sum: { $cond: [{ $eq: ['$event', 'save'] }, 1, 0] }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Category breakdown (from places)
    const categories = await Place.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    return res.json({
      success: true,
      data: {
        totalEvents,
        eventCounts: eventCounts.reduce((acc, e) => {
          acc[e._id] = e.count;
          return acc;
        }, {}),
        totalVisits,
        totalSearches: eventCounts.find(e => e._id === 'search')?.count || 0,
        totalReviews,
        totalSaves,
        topSearches: topSearches.map(s => ({
          name: s.place[0]?.name || 'Unknown',
          count: s.count,
          category: s.place[0]?.category
        })),
        dailyTrends,
        categories: categories.map(c => ({
          name: c._id || 'Other',
          value: c.count
        }))
      }
    });
  } catch (error) {
    console.error('Analytics overview error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════
// GET TRENDS - Weekly/Monthly trends
// ═══════════════════════════════════════════════════════════
router.get('/trends', async (req, res) => {
  try {
    const days = req.query.days || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const trends = await Analytics.aggregate([
      {
        $match: { timestamp: { $gte: startDate } }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          visits: {
            $sum: { $cond: [{ $eq: ['$event', 'visit'] }, 1, 0] }
          },
          searches: {
            $sum: { $cond: [{ $eq: ['$event', 'search'] }, 1, 0] }
          },
          reviews: {
            $sum: { $cond: [{ $eq: ['$event', 'review'] }, 1, 0] }
          },
          saves: {
            $sum: { $cond: [{ $eq: ['$event', 'save'] }, 1, 0] }
          },
          directions: {
            $sum: { $cond: [{ $eq: ['$event', 'direction'] }, 1, 0] }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Format for chart (Mon, Tue, Wed...)
    const chartData = trends.map(t => ({
      day: new Date(t._id).toLocaleDateString('en-US', { weekday: 'short' }),
      date: t._id,
      visits: t.visits,
      searches: t.searches,
      reviews: t.reviews,
      saves: t.saves,
      directions: t.directions
    }));

    return res.json({
      success: true,
      data: {
        trends: chartData,
        summary: {
          totalVisits: trends.reduce((s, t) => s + t.visits, 0),
          totalSearches: trends.reduce((s, t) => s + t.searches, 0),
          totalReviews: trends.reduce((s, t) => s + t.reviews, 0),
          totalSaves: trends.reduce((s, t) => s + t.saves, 0),
          totalDirections: trends.reduce((s, t) => s + t.directions, 0)
        }
      }
    });
  } catch (error) {
    console.error('Analytics trends error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════
// GET CATEGORIES - Category statistics
// ═══════════════════════════════════════════════════════════
router.get('/categories', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const categoryStats = await Analytics.aggregate([
      {
        $match: { timestamp: { $gte: thirtyDaysAgo } }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const data = categoryStats.map(c => ({
      name: c._id || 'Other',
      value: c.count
    }));

    return res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Analytics categories error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════
// POST EVENT - Log an event
// ═══════════════════════════════════════════════════════════
router.post('/event', async (req, res) => {
  try {
    const { event, placeId, category, metadata } = req.body;

    if (!event) {
      return res.status(400).json({ success: false, error: 'Event required' });
    }

    const analytics = new Analytics({
      event,
      placeId,
      category,
      metadata,
      timestamp: new Date()
    });

    await analytics.save();

    return res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Analytics event error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════
// GET TOP PLACES - Most visited/searched
// ═══════════════════════════════════════════════════════════
router.get('/top-places', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const eventType = req.query.event || 'visit';

    const topPlaces = await Analytics.aggregate([
      {
        $match: {
          event: eventType,
          placeId: { $exists: true },
          timestamp: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: '$placeId',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      },
      {
        $lookup: {
          from: 'places',
          localField: '_id',
          foreignField: '_id',
          as: 'place'
        }
      },
      {
        $unwind: '$place'
      },
      {
        $project: {
          _id: 0,
          placeId: '$_id',
          name: '$place.name',
          category: '$place.category',
          rating: '$place.rating',
          count: 1
        }
      }
    ]);

    return res.json({
      success: true,
      data: topPlaces
    });
  } catch (error) {
    console.error('Analytics top places error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;