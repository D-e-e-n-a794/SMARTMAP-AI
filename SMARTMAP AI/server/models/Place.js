const express = require('express');
const router  = express.Router();
const Place   = require('../models/Place');

// ── Safe Analytics helper — never crashes the server if model is missing ──
let Analytics;
try {
  Analytics = require('../models/Analytics');
} catch {
  Analytics = null;
}
const trackEvent = async (payload) => {
  if (!Analytics) return;
  try { await Analytics.create(payload); } catch { /* silently skip */ }
};

// ── Haversine distance (km) ───────────────────────────────────────────────
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R    = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a    = Math.sin(dLat / 2) ** 2 +
               Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
               Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// =========================================================================
// GET /api/places  — all places with optional category / rating filter
// =========================================================================
router.get('/', async (req, res) => {
  try {
    const { category, minRating, limit = 200, lat, lng } = req.query;

    const query = {};
    if (category && category !== 'all') query.category = category;
    if (minRating) query.rating = { $gte: parseFloat(minRating) };

    let places = await Place.find(query)
      .sort({ featured: -1, rating: -1 })
      .limit(parseInt(limit))
      .select('-__v');

    if (lat && lng) {
      const uLat = parseFloat(lat);
      const uLng = parseFloat(lng);
      places = places
        .map(p => ({
          ...p.toObject(),
          distance: Math.round(calculateDistance(uLat, uLng,
            p.location.coordinates[1], p.location.coordinates[0]) * 10) / 10
        }))
        .sort((a, b) => a.distance - b.distance);
    }

    res.json({ success: true, count: places.length, data: places });
  } catch (error) {
    console.error('Get places error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch places' });
  }
});

// =========================================================================
// GET /api/places/search  — text search + optional geo sort
// =========================================================================
router.get('/search', async (req, res) => {
  try {
    const { q, category, minRating, lat, lng } = req.query;

    const query = {};
    if (q) {
      query.$or = [
        { name:               { $regex: q, $options: 'i' } },
        { description:        { $regex: q, $options: 'i' } },
        { 'location.city':    { $regex: q, $options: 'i' } },
        { 'location.country': { $regex: q, $options: 'i' } }
      ];
    }
    if (category && category !== 'all') query.category = category;
    if (minRating) query.rating = { $gte: parseFloat(minRating) };

    let places = await Place.find(query)
      .sort({ rating: -1 })
      .limit(200)
      .select('-__v');

    if (lat && lng) {
      const uLat = parseFloat(lat);
      const uLng = parseFloat(lng);
      places = places
        .map(p => ({
          ...p.toObject(),
          distance: Math.round(calculateDistance(uLat, uLng,
            p.location.coordinates[1], p.location.coordinates[0]) * 10) / 10
        }))
        .sort((a, b) => a.distance - b.distance);
    }

    await trackEvent({ event: 'search', metadata: { query: q, category, resultCount: places.length } });

    res.json({ success: true, count: places.length, data: places });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ success: false, error: 'Search operation failed' });
  }
});

// =========================================================================
// GET /api/places/nearby  — geo proximity (graceful fallback if no coords)
// =========================================================================
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, maxDistance = 5000 } = req.query;

    if (!lat || !lng) {
      const allPlaces = await Place.find({})
        .sort({ featured: -1, rating: -1 })
        .limit(200)
        .select('-__v');
      return res.json({
        success: true, count: allPlaces.length, data: allPlaces,
        message: 'Showing all places worldwide (no location provided)'
      });
    }

    const latitude  = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
      return res.status(400).json({ success: false, error: 'Invalid coordinates' });
    }

    const allPlaces = await Place.find({}).select('-__v');
    const sorted = allPlaces
      .map(p => ({
        ...p.toObject(),
        distance: Math.round(calculateDistance(latitude, longitude,
          p.location.coordinates[1], p.location.coordinates[0]) * 10) / 10
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 100);

    await trackEvent({ event: 'search', metadata: { type: 'nearby', maxDistance, resultCount: sorted.length } });

    res.json({ success: true, count: sorted.length, data: sorted });
  } catch (error) {
    console.error('Nearby places error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch nearby places' });
  }
});

// =========================================================================
// GET /api/places/worldwide
// =========================================================================
router.get('/worldwide', async (req, res) => {
  try {
    const { category, minRating, limit = 200 } = req.query;
    const query = {};
    if (category && category !== 'all') query.category = category;
    if (minRating) query.rating = { $gte: parseFloat(minRating) };

    const places = await Place.find(query)
      .sort({ rating: -1, reviewCount: -1 })
      .limit(parseInt(limit))
      .select('-__v');

    res.json({ success: true, count: places.length, data: places, message: 'All places worldwide' });
  } catch (error) {
    console.error('Worldwide places error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch worldwide places' });
  }
});

// =========================================================================
// GET /api/places/:id  — single place + visit counter
// =========================================================================
router.get('/:id', async (req, res) => {
  try {
    const place = await Place.findById(req.params.id).select('-__v');
    if (!place) return res.status(404).json({ success: false, error: 'Place not found' });

    place.visitCount = (place.visitCount || 0) + 1;
    await place.save();

    await trackEvent({ event: 'visit', placeId: place._id, category: place.category });

    res.json({ success: true, data: place });
  } catch (error) {
    console.error('Get place error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, error: 'Place not found' });
    }
    res.status(500).json({ success: false, error: 'Failed to fetch place' });
  }
});

// =========================================================================
// POST /api/places  — create a place
// =========================================================================
router.post('/', async (req, res) => {
  try {
    const { name, category, latitude, longitude, address, city, country, image, description, priceLevel } = req.body;

    if (!name || !latitude || !longitude) {
      return res.status(400).json({ success: false, error: 'name, latitude, and longitude are required' });
    }

    const place = new Place({
      name,
      category: category || 'cafe',
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
        address, city, country
      },
      image:       image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      description,
      priceLevel:  priceLevel || '$$',
      rating:      parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 500),
      visitCount:  1
    });

    const saved = await place.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    console.error('Create place error:', error);
    res.status(400).json({ success: false, error: error.message || 'Failed to create place' });
  }
});

// =========================================================================
// PUT /api/places/:id  — update a place
// =========================================================================
router.put('/:id', async (req, res) => {
  try {
    const place = await Place.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!place) return res.status(404).json({ success: false, error: 'Place not found' });
    res.json({ success: true, data: place });
  } catch (error) {
    console.error('Update place error:', error);
    res.status(400).json({ success: false, error: error.message || 'Failed to update place' });
  }
});

// =========================================================================
// DELETE /api/places/:id
// =========================================================================
router.delete('/:id', async (req, res) => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);
    if (!place) return res.status(404).json({ success: false, error: 'Place not found' });
    res.json({ success: true, message: 'Place deleted successfully' });
  } catch (error) {
    console.error('Delete place error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete place' });
  }
});

module.exports = router;