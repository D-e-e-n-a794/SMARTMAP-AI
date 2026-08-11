const express = require('express');
const router = express.Router();
const Place = require('../models/Place');
const Analytics = require('../models/Analytics');

// Helper function to calculate distance between two points (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// GET /api/places - Get all places with filters (WORKS WORLDWIDE)
router.get('/', async (req, res) => {
  try {
    const { category, minRating, limit = 200, lat, lng } = req.query;
    
    let query = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    let places = await Place.find(query)
      .sort({ featured: -1, rating: -1 })
      .limit(parseInt(limit))
      .select('-__v');

    // If user location provided, add calculated distance metadata to each place object
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);

      places = places.map(place => {
        const distance = calculateDistance(
          userLat,
          userLng,
          place.location.coordinates[1],
          place.location.coordinates[0]
        );
        
        return {
          ...place.toObject(),
          distance: Math.round(distance * 10) / 10
        };
      }).sort((a, b) => a.distance - b.distance); // Sort ascending by proximity
    }

    res.json({
      success: true,
      count: places.length,
      data: places
    });
  } catch (error) {
    console.error('Get places error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch places'
    });
  }
});

// GET /api/places/nearby - Fallback gracefully when missing lat/lng coordinates
router.get('/nearby', async (req, res) => {
  try {
    const { lng, lat, maxDistance = 5000 } = req.query;

    // If no coordinates are passed from the client app dashboard layout, return global rankings
    if (!lng || !lat) {
      console.log('No coordinates provided, returning all places worldwide');
      
      const allPlaces = await Place.find({})
        .sort({ featured: -1, rating: -1 })
        .limit(200)
        .select('-__v');

      return res.json({
        success: true,
        count: allPlaces.length,
        data: allPlaces,
        message: 'Showing all places worldwide (no location provided)'
      });
    }

    const longitude = parseFloat(lng);
    const latitude = parseFloat(lat);

    // Validate GeoJSON coordinate system limit parameters
    if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
      return res.status(400).json({
        success: false,
        error: 'Invalid coordinates'
      });
    }

    // Grab database catalog item collection entries for processing
    const allPlaces = await Place.find({}).select('-__v');

    const placesWithDistance = allPlaces.map(place => {
      const distance = calculateDistance(
        latitude,
        longitude,
        place.location.coordinates[1],
        place.location.coordinates[0]
      );
      
      return {
        ...place.toObject(),
        distance: Math.round(distance * 10) / 10
      };
    });

    const sortedPlaces = placesWithDistance
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 100); // Deliver top 100 items matching proximity criteria

    // Document client tracking metrics safely in secondary analytics cluster collection
    await Analytics.create({
      event: 'search',
      metadata: { type: 'nearby', distance: maxDistance, resultCount: sortedPlaces.length }
    }).catch(err => console.log('Analytics logging error skipped:', err));

    res.json({
      success: true,
      count: sortedPlaces.length,
      data: sortedPlaces
    });
  } catch (error) {
    console.error('Nearby places error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch nearby places'
    });
  }
});

// GET /api/places/worldwide - Dedicated clean route overview parameters
router.get('/worldwide', async (req, res) => {
  try {
    const { category, minRating, limit = 200 } = req.query;
    
    let query = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    const places = await Place.find(query)
      .sort({ rating: -1, reviewCount: -1 })
      .limit(parseInt(limit))
      .select('-__v');

    res.json({
      success: true,
      count: places.length,
      data: places,
      message: 'All places worldwide'
    });
  } catch (error) {
    console.error('Worldwide places error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch worldwide places'
    });
  }
});

// GET /api/places/search - Advanced query dynamic parsing regex
router.get('/search', async (req, res) => {
  try {
    const { q, category, minRating, lat, lng, maxDistance = 5000 } = req.query;

    let query = {};

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { 'location.city': { $regex: q, $options: 'i' } },
        { 'location.country': { $regex: q, $options: 'i' } }
      ];
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    let places = await Place.find(query)
      .sort({ rating: -1 })
      .limit(200)
      .select('-__v');

    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);

      places = places
        .map(place => {
          const distance = calculateDistance(
            userLat,
            userLng,
            place.location.coordinates[1],
            place.location.coordinates[0]
          );
          return {
            ...place.toObject(),
            distance: Math.round(distance * 10) / 10
          };
        })
        .sort((a, b) => a.distance - b.distance);
    }

    await Analytics.create({
      event: 'search',
      metadata: { query: q, category, minRating, resultCount: places.length }
    }).catch(err => console.log('Analytics tracking entry dropped:', err));

    res.json({
      success: true,
      count: places.length,
      data: places
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: 'Search operation failed'
    });
  }
});

// GET /api/places/:id - Single item fetch with incrementing counter values
router.get('/:id', async (req, res) => {
  try {
    const place = await Place.findById(req.params.id).select('-__v');

    if (!place) {
      return res.status(404).json({
        success: false,
        error: 'Place not found'
      });
    }

    // Increment view matrix metrics
    place.visitCount = (place.visitCount || 0) + 1;
    await place.save();

    await Analytics.create({
      event: 'visit',
      placeId: place._id,
      category: place.category
    }).catch(err => console.log('Analytics interaction dropped:', err));

    res.json({
      success: true,
      data: place
    });
  } catch (error) {
    console.error('Get place error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Place not found'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to fetch place'
    });
  }
});

// POST /api/places - Document record creation and generation mapping
router.post('/', async (req, res) => {
  try {
    const { name, category, latitude, longitude, address, city, country, image, description, priceLevel } = req.body;

    if (!name || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'Name, latitude, and longitude parameters required'
      });
    }

    const place = new Place({
      name,
      category: category || 'cafe',
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
        address,
        city,
        country
      },
      image: image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      description,
      priceLevel: priceLevel || '$$',
      rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 500),
      visitCount: 1
    });

    const savedPlace = await place.save();

    res.status(201).json({
      success: true,
      data: savedPlace
    });
  } catch (error) {
    console.error('Create place error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create place record'
    });
  }
});

// PUT /api/places/:id - Modify properties safely
router.put('/:id', async (req, res) => {
  try {
    const place = await Place.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!place) {
      return res.status(404).json({
        success: false,
        error: 'Place not found'
      });
    }

    res.json({
      success: true,
      data: place
    });
  } catch (error) {
    console.error('Update place error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to update place updates'
    });
  }
});

// DELETE /api/places/:id - Delete entity cleanly
router.delete('/:id', async (req, res) => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);

    if (!place) {
      return res.status(404).json({
        success: false,
        error: 'Place not found'
      });
    }

    res.json({
      success: true,
      message: 'Place deleted successfully'
    });
  } catch (error) {
    console.error('Delete place error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete place data entity'
    });
  }
});

module.exports = router;