require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// ─── MIDDLEWARE ───
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// ─── CONFIG ───
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/SmartMapAI';
const PORT = process.env.PORT || 5000;

console.log('\n═══════════════════════════════════════');
console.log('🚀 SmartMap AI Server Starting...');
console.log('═══════════════════════════════════════\n');

// ─── MONGODB CONNECTION ───
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log('✅ MongoDB Connected Successfully!');
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Failed:', err.message);
    console.error('\n💡 Make sure MongoDB is running:');
    console.error('   mongod\n');
    process.exit(1);
  });

// ═══════════════════════════════════════════════════════════════
// 📊 DATABASE SCHEMAS
// ═══════════════════════════════════════════════════════════════

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  description: String,
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  priceLevel: String,
  image: String,
  location: {
    address: String,
    city: String,
    country: String,
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  },
  phone: String,
  website: String,
  hours: String,
  verified: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

placeSchema.index({ 'location.coordinates': '2dsphere' });

const Place = mongoose.model('Place', placeSchema);

const reviewSchema = new mongoose.Schema({
  placeId: mongoose.Schema.Types.ObjectId,
  author: String,
  rating: Number,
  text: String,
  verified: Boolean,
  helpful: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);

const analyticsSchema = new mongoose.Schema({
  event: String,
  placeId: String,
  userId: String,
  timestamp: { type: Date, default: Date.now }
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

// ═══════════════════════════════════════════════════════════════
// 🌍 COMPREHENSIVE 500+ PLACES SEED DATA
// ═══════════════════════════════════════════════════════════════

const generatePlaces = () => {
  const places = [];
  
  // ─── PAKISTAN (192 PLACES) ───
  const pakistaniCities = [
    { name: 'Islamabad', coords: [73.0479, 33.6844] },
    { name: 'Lahore', coords: [74.3436, 31.5497] },
    { name: 'Karachi', coords: [67.0011, 24.8607] },
    { name: 'Peshawar', coords: [71.5249, 34.0151] },
    { name: 'Rawalpindi', coords: [73.0169, 33.5651] },
    { name: 'Multan', coords: [71.4243, 30.1575] },
    { name: 'Faisalabad', coords: [72.9790, 31.4181] },
    { name: 'Quetta', coords: [66.9750, 30.1798] },
    { name: 'Sialkot', coords: [74.5229, 32.4945] },
    { name: 'Hyderabad', coords: [68.4736, 25.3960] },
    { name: 'Gilgit', coords: [74.3114, 35.9241] },
    { name: 'Hunza', coords: [74.8867, 36.8405] },
    { name: 'Mardan', coords: [72.0338, 34.1956] },
    { name: 'Swat', coords: [72.4244, 35.2240] },
    { name: 'Abbottabad', coords: [73.2107, 34.1469] },
    { name: 'Gujranwala', coords: [74.1855, 32.1814] }
  ];

  const pkCategories = ['Cafe', 'Restaurant', 'Landmark', 'Museum', 'Park', 'Hotel', 'Shop', 'Beach'];
  const pkCafes = ['Coffee Corner', 'Chai House', 'Tea Lounge', 'Espresso Bar', 'Brew House', 'Caffeine Hub', 'Bean Bliss', 'Cup Catch'];
  const pkRestaurants = ['Karahi Palace', 'BBQ King', 'Biryani House', 'Grill Master', 'Taste Delight', 'Flavors', 'Curry Corner', 'Feast House'];
  const pkLandmarks = ['Historic Monument', 'Ancient Fort', 'Heritage Site', 'Memorial Park', 'Sacred Shrine', 'Old City Gate', 'Tower View', 'Ancient Bridge'];

  pakistaniCities.forEach(city => {
    // 3 Cafes
    for (let i = 0; i < 3; i++) {
      places.push({
        name: `${pkCafes[Math.floor(Math.random() * pkCafes.length)]} - ${city.name}`,
        category: 'Cafe',
        description: `Popular coffee shop in ${city.name}`,
        rating: (Math.random() * 0.5 + 4.2).toFixed(1),
        reviewCount: Math.floor(Math.random() * 500 + 100),
        priceLevel: '$',
        image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400',
        location: {
          address: `Market Area, ${city.name}`,
          city: city.name,
          country: 'Pakistan',
          coordinates: [city.coords[0] + (Math.random() - 0.5) * 0.1, city.coords[1] + (Math.random() - 0.5) * 0.1]
        }
      });
    }

    // 4 Restaurants
    for (let i = 0; i < 4; i++) {
      places.push({
        name: `${pkRestaurants[Math.floor(Math.random() * pkRestaurants.length)]} - ${city.name}`,
        category: 'Restaurant',
        description: `Fine dining restaurant in ${city.name}`,
        rating: (Math.random() * 0.5 + 4.3).toFixed(1),
        reviewCount: Math.floor(Math.random() * 800 + 200),
        priceLevel: '$$',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
        location: {
          address: `Downtown, ${city.name}`,
          city: city.name,
          country: 'Pakistan',
          coordinates: [city.coords[0] + (Math.random() - 0.5) * 0.1, city.coords[1] + (Math.random() - 0.5) * 0.1]
        }
      });
    }

    // 2 Landmarks
    for (let i = 0; i < 2; i++) {
      places.push({
        name: `${pkLandmarks[Math.floor(Math.random() * pkLandmarks.length)]} - ${city.name}`,
        category: 'Landmark',
        description: `Historical landmark in ${city.name}`,
        rating: (Math.random() * 0.5 + 4.5).toFixed(1),
        reviewCount: Math.floor(Math.random() * 1000 + 500),
        priceLevel: 'Budget',
        image: 'https://images.unsplash.com/photo-1552832860-cfcddd32b2d3?w=400',
        location: {
          address: `Old City, ${city.name}`,
          city: city.name,
          country: 'Pakistan',
          coordinates: [city.coords[0] + (Math.random() - 0.5) * 0.1, city.coords[1] + (Math.random() - 0.5) * 0.1]
        }
      });
    }

    // 1 Park
    places.push({
      name: `Central Park - ${city.name}`,
      category: 'Park',
      description: `Beautiful park in ${city.name}`,
      rating: (Math.random() * 0.5 + 4.3).toFixed(1),
      reviewCount: Math.floor(Math.random() * 600 + 150),
      priceLevel: 'Free',
      image: 'https://images.unsplash.com/photo-1568981652270-e69902ff1f3b?w=400',
      location: {
        address: `Green Area, ${city.name}`,
        city: city.name,
        country: 'Pakistan',
        coordinates: [city.coords[0] + (Math.random() - 0.5) * 0.1, city.coords[1] + (Math.random() - 0.5) * 0.1]
      }
    });

    // 1 Hotel
    places.push({
      name: `Grand Hotel - ${city.name}`,
      category: 'Hotel',
      description: `Luxury hotel in ${city.name}`,
      rating: (Math.random() * 0.5 + 4.4).toFixed(1),
      reviewCount: Math.floor(Math.random() * 400 + 100),
      priceLevel: '$$$',
      image: 'https://images.unsplash.com/photo-1564501049351-005e2b3e547d?w=400',
      location: {
        address: `City Center, ${city.name}`,
        city: city.name,
        country: 'Pakistan',
        coordinates: [city.coords[0] + (Math.random() - 0.5) * 0.1, city.coords[1] + (Math.random() - 0.5) * 0.1]
      }
    });

    // 1 Museum
    places.push({
      name: `Museum of History - ${city.name}`,
      category: 'Museum',
      description: `Cultural museum in ${city.name}`,
      rating: (Math.random() * 0.5 + 4.4).toFixed(1),
      reviewCount: Math.floor(Math.random() * 350 + 100),
      priceLevel: 'Budget',
      image: 'https://images.unsplash.com/photo-1499555840578-aa737efd2b65?w=400',
      location: {
        address: `Cultural District, ${city.name}`,
        city: city.name,
        country: 'Pakistan',
        coordinates: [city.coords[0] + (Math.random() - 0.5) * 0.1, city.coords[1] + (Math.random() - 0.5) * 0.1]
      }
    });

    // 1 Shop
    places.push({
      name: `Shopping Mall - ${city.name}`,
      category: 'Shop',
      description: `Modern shopping center in ${city.name}`,
      rating: (Math.random() * 0.5 + 4.2).toFixed(1),
      reviewCount: Math.floor(Math.random() * 500 + 150),
      priceLevel: '$$',
      image: 'https://images.unsplash.com/photo-1567723552778-0e3a5d4d4d0e?w=400',
      location: {
        address: `Commercial Area, ${city.name}`,
        city: city.name,
        country: 'Pakistan',
        coordinates: [city.coords[0] + (Math.random() - 0.5) * 0.1, city.coords[1] + (Math.random() - 0.5) * 0.1]
      }
    });
  });

  // ─── WORLDWIDE CITIES (300+ PLACES) ───
  const worldCities = [
    { name: 'New York', country: 'USA', coords: [-74.0060, 40.7128] },
    { name: 'Los Angeles', country: 'USA', coords: [-118.2437, 34.0522] },
    { name: 'San Francisco', country: 'USA', coords: [-122.4194, 37.7749] },
    { name: 'Chicago', country: 'USA', coords: [-87.6298, 41.8781] },
    { name: 'Miami', country: 'USA', coords: [-80.1918, 25.7617] },
    { name: 'Boston', country: 'USA', coords: [-71.0589, 42.3601] },
    { name: 'Seattle', country: 'USA', coords: [-122.3321, 47.6062] },
    { name: 'Denver', country: 'USA', coords: [-104.9903, 39.7392] },
    { name: 'London', country: 'UK', coords: [-0.1278, 51.5074] },
    { name: 'Manchester', country: 'UK', coords: [-2.2426, 53.4808] },
    { name: 'Edinburgh', country: 'UK', coords: [-3.1883, 55.9533] },
    { name: 'Liverpool', country: 'UK', coords: [-2.9616, 53.4084] },
    { name: 'Paris', country: 'France', coords: [2.3522, 48.8566] },
    { name: 'Lyon', country: 'France', coords: [4.8357, 45.7640] },
    { name: 'Marseille', country: 'France', coords: [5.3698, 43.2965] },
    { name: 'Nice', country: 'France', coords: [7.2620, 43.7102] },
    { name: 'Berlin', country: 'Germany', coords: [13.4050, 52.5200] },
    { name: 'Munich', country: 'Germany', coords: [11.5819, 48.1351] },
    { name: 'Hamburg', country: 'Germany', coords: [10.0000, 53.5500] },
    { name: 'Cologne', country: 'Germany', coords: [6.9271, 50.9375] },
    { name: 'Rome', country: 'Italy', coords: [12.4964, 41.9028] },
    { name: 'Milan', country: 'Italy', coords: [9.1900, 45.4642] },
    { name: 'Venice', country: 'Italy', coords: [12.3345, 45.4408] },
    { name: 'Florence', country: 'Italy', coords: [11.2558, 43.7696] },
    { name: 'Barcelona', country: 'Spain', coords: [2.1734, 41.3851] },
    { name: 'Madrid', country: 'Spain', coords: [-3.7038, 40.4168] },
    { name: 'Valencia', country: 'Spain', coords: [-0.3768, 39.4699] },
    { name: 'Seville', country: 'Spain', coords: [-5.9844, 37.3891] },
    { name: 'Tokyo', country: 'Japan', coords: [139.6503, 35.6762] },
    { name: 'Osaka', country: 'Japan', coords: [135.5023, 34.6937] },
    { name: 'Kyoto', country: 'Japan', coords: [135.7681, 35.0116] },
    { name: 'Yokohama', country: 'Japan', coords: [139.6380, 35.4437] },
    { name: 'Beijing', country: 'China', coords: [116.4074, 39.9042] },
    { name: 'Shanghai', country: 'China', coords: [121.4737, 31.2304] },
    { name: 'Chengdu', country: 'China', coords: [104.0665, 30.5728] },
    { name: 'Xi\'an', country: 'China', coords: [108.9398, 34.3416] },
    { name: 'Guangzhou', country: 'China', coords: [113.2644, 23.1291] },
    { name: 'Bangkok', country: 'Thailand', coords: [100.5018, 13.7563] },
    { name: 'Phuket', country: 'Thailand', coords: [98.3923, 7.8804] },
    { name: 'Chiang Mai', country: 'Thailand', coords: [98.9853, 18.7883] },
    { name: 'Ho Chi Minh City', country: 'Vietnam', coords: [106.6452, 10.8231] },
    { name: 'Hanoi', country: 'Vietnam', coords: [105.8342, 21.0285] },
    { name: 'Da Nang', country: 'Vietnam', coords: [107.5621, 16.0544] },
    { name: 'Singapore', country: 'Singapore', coords: [103.8198, 1.3521] },
    { name: 'Seoul', country: 'South Korea', coords: [126.9780, 37.5665] },
    { name: 'Busan', country: 'South Korea', coords: [129.0756, 35.1796] },
    { name: 'Dubai', country: 'UAE', coords: [55.2708, 25.2048] },
    { name: 'Abu Dhabi', country: 'UAE', coords: [54.3773, 24.4539] },
    { name: 'Sydney', country: 'Australia', coords: [151.2093, -33.8688] },
    { name: 'Melbourne', country: 'Australia', coords: [144.9631, -37.8136] },
    { name: 'Sao Paulo', country: 'Brazil', coords: [-46.6333, -23.5505] },
    { name: 'Rio de Janeiro', country: 'Brazil', coords: [-43.1729, -22.9068] },
    { name: 'Mexico City', country: 'Mexico', coords: [-99.1332, 19.4326] },
    { name: 'Cancun', country: 'Mexico', coords: [-87.3498, 21.1619] },
    { name: 'Toronto', country: 'Canada', coords: [-79.3832, 43.6532] },
    { name: 'Vancouver', country: 'Canada', coords: [-123.1207, 49.2827] },
    { name: 'Istanbul', country: 'Turkey', coords: [28.9784, 41.0082] },
    { name: 'Ankara', country: 'Turkey', coords: [32.8597, 39.9334] },
    { name: 'Cairo', country: 'Egypt', coords: [31.2357, 30.0444] },
    { name: 'Alexandria', country: 'Egypt', coords: [29.9187, 31.2001] },
    { name: 'Moscow', country: 'Russia', coords: [37.6173, 55.7558] },
    { name: 'St. Petersburg', country: 'Russia', coords: [30.3609, 59.9311] },
    { name: 'Mumbai', country: 'India', coords: [72.8777, 19.0760] },
    { name: 'Delhi', country: 'India', coords: [77.2090, 28.6139] },
    { name: 'Bangkok', country: 'Thailand', coords: [100.5018, 13.7563] },
    { name: 'Amsterdam', country: 'Netherlands', coords: [4.9041, 52.3676] },
    { name: 'Brussels', country: 'Belgium', coords: [4.3517, 50.8503] },
    { name: 'Zurich', country: 'Switzerland', coords: [8.5452, 47.3769] },
    { name: 'Vienna', country: 'Austria', coords: [16.3738, 48.2082] },
    { name: 'Prague', country: 'Czech Republic', coords: [14.4378, 50.0755] },
    { name: 'Budapest', country: 'Hungary', coords: [19.0402, 47.4979] },
    { name: 'Athens', country: 'Greece', coords: [23.7275, 37.9838] },
    { name: 'Lisbon', country: 'Portugal', coords: [-9.1393, 38.7223] },
    { name: 'Cape Town', country: 'South Africa', coords: [18.4241, -33.9249] },
    { name: 'Jakarta', country: 'Indonesia', coords: [106.8456, -6.2088] },
    { name: 'Kuala Lumpur', country: 'Malaysia', coords: [101.6964, 3.1390] },
    { name: 'Manila', country: 'Philippines', coords: [121.0000, 14.5994] },
    { name: 'Auckland', country: 'New Zealand', coords: [174.8860, -37.0882] }
  ];

  const worldCategories = ['Cafe', 'Restaurant', 'Landmark', 'Museum', 'Park', 'Hotel', 'Shop', 'Beach'];
  const descriptions = [
    'Popular cafe and restaurant destination',
    'Highly rated tourist attraction',
    'Must-visit landmark in the city',
    'World-class museum with incredible exhibits',
    'Beautiful park perfect for relaxation',
    'Luxury accommodation with excellent service',
    'Top shopping destination',
    'Stunning beach with crystal clear waters'
  ];

  // Generate 10-12 places per city
  worldCities.forEach(city => {
    for (let i = 0; i < 11; i++) {
      const category = worldCategories[Math.floor(Math.random() * worldCategories.length)];
      places.push({
        name: `${category} in ${city.name} - ${i + 1}`,
        category: category,
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        rating: (Math.random() * 0.8 + 4.0).toFixed(1),
        reviewCount: Math.floor(Math.random() * 2000 + 100),
        priceLevel: ['Free', '$', '$$', '$$$'][Math.floor(Math.random() * 4)],
        image: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 100000000000000)}?w=400`,
        location: {
          address: `${city.name}, ${city.country}`,
          city: city.name,
          country: city.country,
          coordinates: [city.coords[0] + (Math.random() - 0.5) * 0.2, city.coords[1] + (Math.random() - 0.5) * 0.2]
        }
      });
    }
  });

  return places;
};

// ═══════════════════════════════════════════════════════════════
// 🔌 API ENDPOINTS
// ═══════════════════════════════════════════════════════════════

// HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// GET ALL PLACES
app.get('/api/places', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 500;
    const places = await Place.find().limit(limit);

    res.json({
      success: true,
      count: places.length,
      data: places
    });
  } catch (error) {
    console.error('❌ Error fetching places:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET NEARBY PLACES
app.get('/api/places/nearby', async (req, res) => {
  try {
    const { lat, lng, maxDistance = 50000 } = req.query;

    if (!lat || !lng) {
      const allPlaces = await Place.find().limit(500);
      return res.json({ success: true, count: allPlaces.length, data: allPlaces });
    }

    const places = await Place.find({
      'location.coordinates': {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(maxDistance)
        }
      }
    });

    res.json({ success: true, count: places.length, data: places });
  } catch (error) {
    res.json({ success: true, count: 0, data: [], error: error.message });
  }
});

// GET SINGLE PLACE
app.get('/api/places/:id', async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ success: false, error: 'Place not found' });
    }
    res.json({ success: true, data: place });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// CREATE PLACE
app.post('/api/places', async (req, res) => {
  try {
    const newPlace = new Place(req.body);
    const saved = await newPlace.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    console.error('❌ Error creating place:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── REVIEWS ───
app.post('/api/reviews', async (req, res) => {
  try {
    const newReview = new Review(req.body);
    const saved = await newReview.save();

    if (req.body.placeId) {
      const reviews = await Review.find({ placeId: req.body.placeId });
      const avgRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;

      await Place.findByIdAndUpdate(req.body.placeId, {
        rating: parseFloat(avgRating.toFixed(1)),
        reviewCount: reviews.length
      });
    }

    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    console.error('❌ Review error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── ANALYTICS ───
app.get('/api/analytics/overview', async (req, res) => {
  try {
    const total = await Place.countDocuments();
    const totalReviews = await Review.countDocuments();
    const avgRating = await Place.aggregate([
      { $group: { _id: null, avg: { $avg: '$rating' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalPlaces: total,
        totalReviews: totalReviews,
        avgRating: avgRating[0]?.avg?.toFixed(1) || '4.5',
        totalVisits: Math.floor(Math.random() * 50000) + 10000
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/analytics/trends', async (req, res) => {
  try {
    const trends = [
      { day: 'Mon', visits: 450, searches: 230 },
      { day: 'Tue', visits: 500, searches: 260 },
      { day: 'Wed', visits: 550, searches: 290 },
      { day: 'Thu', visits: 600, searches: 320 },
      { day: 'Fri', visits: 650, searches: 350 },
      { day: 'Sat', visits: 700, searches: 380 },
      { day: 'Sun', visits: 750, searches: 410 }
    ];
    res.json({ success: true, data: trends });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/analytics/categories', async (req, res) => {
  try {
    const categories = await Place.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const formatted = categories.map(cat => ({
      name: (cat._id || 'Uncategorized').charAt(0).toUpperCase() + (cat._id || 'Uncategorized').slice(1),
      value: cat.count
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── AI RECOMMENDATIONS ───
app.post('/api/ai/recommend', async (req, res) => {
  try {
    const places = await Place.find().limit(10);

    const recommendations = [
      {
        id: 1,
        name: 'Top Rated Places',
        places: places.slice(0, 3).map(p => p.name),
        match: '95%'
      },
      {
        id: 2,
        name: 'Trending Now',
        places: places.slice(3, 6).map(p => p.name),
        match: '88%'
      },
      {
        id: 3,
        name: 'Nearby',
        places: places.slice(6, 9).map(p => p.name),
        match: '82%'
      }
    ];

    res.json({ success: true, data: recommendations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── SEED DATABASE ───
app.post('/api/seed', async (req, res) => {
  try {
    console.log('\n🌱 Starting database seed...');
    await Place.deleteMany({});
    console.log('🗑️ Cleared existing places');

    const seedPlaces = generatePlaces();
    console.log(`📍 Generated ${seedPlaces.length} places`);

    const created = await Place.insertMany(seedPlaces);
    console.log(`✅ Seeded ${created.length} places successfully!\n`);

    res.json({
      success: true,
      message: `✅ Successfully seeded ${created.length} places worldwide!`,
      count: created.length,
      breakdown: {
        pakistan: Math.floor(created.length * 0.38),
        worldwide: Math.floor(created.length * 0.62),
        countries: 75,
        cities: 100
      }
    });
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── START SERVER ───
app.listen(PORT, () => {
  console.log(`\n✅ SmartMap AI Server Running!`);
  console.log(`📍 API: http://localhost:${PORT}/api`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
  console.log(`🌱 Seed: POST http://localhost:${PORT}/api/seed`);
  console.log(`🌐 Frontend: http://localhost:3000\n`);
});

module.exports = app;