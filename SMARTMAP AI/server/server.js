require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true,
}));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/SmartMapAI';
const PORT        = process.env.PORT || 5000;

console.log('\n═══════════════════════════════════════');
console.log('🚀 SmartMap AI Server Starting...');
console.log('═══════════════════════════════════════\n');

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log('✅ MongoDB Connected Successfully!'))
  .catch(err => {
    console.error('❌ MongoDB Connection Failed:', err.message);
    console.error('   Run: mongod\n');
    process.exit(1);
  });

// ── SCHEMAS ────────────────────────────────────────────────────
const placeSchema = new mongoose.Schema({
  name:        { type: String, required: true, index: true },
  category:    { type: String, index: true },
  description: String,
  rating:      { type: Number, default: 4.5, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  priceLevel:  String,
  image:       String,
  location: {
    address: String,
    city:    { type: String, index: true },
    country: { type: String, index: true },
    coordinates: { type: [Number], index: '2dsphere' },
  },
  phone:    String,
  website:  String,
  hours:    String,
  verified: { type: Boolean, default: true },
  createdAt:{ type: Date,    default: Date.now },
});

// Create text index for better full-text search
placeSchema.index({ name: 'text', 'location.city': 'text', 'location.country': 'text', category: 'text' });
placeSchema.index({ 'location.coordinates': '2dsphere' });

const Place = mongoose.model('Place', placeSchema);

const reviewSchema = new mongoose.Schema({
  placeId:   mongoose.Schema.Types.ObjectId,
  author:    String,
  rating:    Number,
  text:      String,
  verified:  Boolean,
  helpful:   { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});
const Review = mongoose.model('Review', reviewSchema);

const analyticsSchema = new mongoose.Schema({
  event:     String,
  placeId:   String,
  userId:    String,
  timestamp: { type: Date, default: Date.now },
});
const Analytics = mongoose.model('Analytics', analyticsSchema);

// ── SEED GENERATOR ─────────────────────────────────────────────
const generatePlaces = () => {
  const places = [];

  // ─── PAKISTAN ─────────────────────────────────────────────
  const pakistaniCities = [
    { name:'Islamabad',  coords:[73.0479,33.6844] },
    { name:'Lahore',     coords:[74.3436,31.5497] },
    { name:'Karachi',    coords:[67.0011,24.8607] },
    { name:'Peshawar',   coords:[71.5249,34.0151] },
    { name:'Rawalpindi', coords:[73.0169,33.5651] },
    { name:'Multan',     coords:[71.4243,30.1575] },
    { name:'Faisalabad', coords:[72.9790,31.4181] },
    { name:'Quetta',     coords:[66.9750,30.1798] },
    { name:'Sialkot',    coords:[74.5229,32.4945] },
    { name:'Hyderabad',  coords:[68.4736,25.3960] },
    { name:'Gilgit',     coords:[74.3114,35.9241] },
    { name:'Hunza',      coords:[74.8867,36.8405] },
    { name:'Mardan',     coords:[72.0338,34.1956] },
    { name:'Swat',       coords:[72.4244,35.2240] },
    { name:'Abbottabad', coords:[73.2107,34.1469] },
    { name:'Gujranwala', coords:[74.1855,32.1814] },
  ];

  const pkCafes       = ['Coffee Corner','Chai House','Tea Lounge','Espresso Bar','Brew House','Caffeine Hub','Bean Bliss','Cup Catch'];
  const pkRestaurants = ['Karahi Palace','BBQ King','Biryani House','Grill Master','Taste Delight','Flavors','Curry Corner','Feast House'];
  const pkLandmarks   = ['Historic Monument','Ancient Fort','Heritage Site','Memorial Park','Sacred Shrine','Old City Gate','Tower View','Ancient Bridge'];

  const rnd  = (min,max) => parseFloat((Math.random()*(max-min)+min).toFixed(1));
  const ri   = (min,max) => Math.floor(Math.random()*(max-min+1)+min);
  const pick = arr => arr[Math.floor(Math.random()*arr.length)];
  const jitter = () => (Math.random()-0.5)*0.05;

  pakistaniCities.forEach(city => {
    // 3 Cafes
    for(let i=0;i<3;i++) places.push({
      name:`${pick(pkCafes)} - ${city.name}`,
      category:'Cafe',
      description:`Popular coffee shop in ${city.name}`,
      rating:rnd(4.2,4.7),reviewCount:ri(100,600),priceLevel:'$',
      image:'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400',
      location:{ 
        address:`Market Area, ${city.name}`,
        city:city.name,
        country:'Pakistan',
        coordinates:[city.coords[0]+jitter(),city.coords[1]+jitter()] 
      }
    });
    // 4 Restaurants
    for(let i=0;i<4;i++) places.push({
      name:`${pick(pkRestaurants)} - ${city.name}`,
      category:'Restaurant',
      description:`Fine dining in ${city.name}`,
      rating:rnd(4.3,4.8),reviewCount:ri(200,900),priceLevel:'$$',
      image:'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      location:{ 
        address:`Downtown, ${city.name}`,
        city:city.name,
        country:'Pakistan',
        coordinates:[city.coords[0]+jitter(),city.coords[1]+jitter()] 
      }
    });
    // 2 Landmarks
    for(let i=0;i<2;i++) places.push({
      name:`${pick(pkLandmarks)} - ${city.name}`,
      category:'Landmark',
      description:`Historical landmark in ${city.name}`,
      rating:rnd(4.5,4.9),reviewCount:ri(500,1500),priceLevel:'Budget',
      image:'https://images.unsplash.com/photo-1552832860-cfcddd32b2d3?w=400',
      location:{ 
        address:`Old City, ${city.name}`,
        city:city.name,
        country:'Pakistan',
        coordinates:[city.coords[0]+jitter(),city.coords[1]+jitter()] 
      }
    });
    // Park
    places.push({ 
      name:`Central Park - ${city.name}`,
      category:'Park',
      description:`Beautiful park in ${city.name}`,
      rating:rnd(4.3,4.7),reviewCount:ri(150,700),priceLevel:'Free',
      image:'https://images.unsplash.com/photo-1568981652270-e69902ff1f3b?w=400',
      location:{ 
        address:`Green Area, ${city.name}`,
        city:city.name,
        country:'Pakistan',
        coordinates:[city.coords[0]+jitter(),city.coords[1]+jitter()] 
      }
    });
    // Hotel
    places.push({ 
      name:`Grand Hotel - ${city.name}`,
      category:'Hotel',
      description:`Luxury hotel in ${city.name}`,
      rating:rnd(4.4,4.8),reviewCount:ri(100,500),priceLevel:'$$$',
      image:'https://images.unsplash.com/photo-1564501049351-005e2b3e547d?w=400',
      location:{ 
        address:`City Center, ${city.name}`,
        city:city.name,
        country:'Pakistan',
        coordinates:[city.coords[0]+jitter(),city.coords[1]+jitter()] 
      }
    });
    // Museum
    places.push({ 
      name:`Museum of History - ${city.name}`,
      category:'Museum',
      description:`Cultural museum in ${city.name}`,
      rating:rnd(4.4,4.8),reviewCount:ri(100,400),priceLevel:'Budget',
      image:'https://images.unsplash.com/photo-1499555840578-aa737efd2b65?w=400',
      location:{ 
        address:`Cultural District, ${city.name}`,
        city:city.name,
        country:'Pakistan',
        coordinates:[city.coords[0]+jitter(),city.coords[1]+jitter()] 
      }
    });
    // Shop
    places.push({ 
      name:`Shopping Mall - ${city.name}`,
      category:'Shop',
      description:`Modern shopping center in ${city.name}`,
      rating:rnd(4.2,4.6),reviewCount:ri(150,600),priceLevel:'$$',
      image:'https://images.unsplash.com/photo-1567723552778-0e3a5d4d4d0e?w=400',
      location:{ 
        address:`Commercial Area, ${city.name}`,
        city:city.name,
        country:'Pakistan',
        coordinates:[city.coords[0]+jitter(),city.coords[1]+jitter()] 
      }
    });
  });

  // ─── WORLD CITIES ──────────────────────────────────────────
  const worldCities = [
    {name:'New York',        country:'USA',            coords:[-74.0060,40.7128]},
    {name:'London',          country:'UK',             coords:[-0.1278,51.5074]},
    {name:'Paris',           country:'France',         coords:[2.3522,48.8566]},
    {name:'Tokyo',           country:'Japan',          coords:[139.6503,35.6762]},
    {name:'Dubai',           country:'UAE',            coords:[55.2708,25.2048]},
    {name:'Sydney',          country:'Australia',      coords:[151.2093,-33.8688]},
    {name:'Bangkok',         country:'Thailand',       coords:[100.5018,13.7563]},
    {name:'Singapore',       country:'Singapore',      coords:[103.8198,1.3521]},
    {name:'Berlin',          country:'Germany',        coords:[13.4050,52.5200]},
    {name:'Rome',            country:'Italy',          coords:[12.4964,41.9028]},
  ];

  const catNames = ['Cafe','Restaurant','Landmark','Museum','Park','Hotel','Shop','Beach'];
  const catImages = {
    Cafe:       'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400',
    Restaurant: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    Landmark:   'https://images.unsplash.com/photo-1552832860-cfcddd32b2d3?w=400',
    Museum:     'https://images.unsplash.com/photo-1499555840578-aa737efd2b65?w=400',
    Park:       'https://images.unsplash.com/photo-1568981652270-e69902ff1f3b?w=400',
    Hotel:      'https://images.unsplash.com/photo-1564501049351-005e2b3e547d?w=400',
    Shop:       'https://images.unsplash.com/photo-1567723552778-0e3a5d4d4d0e?w=400',
    Beach:      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
  };
  const priceLevels = ['Free','$','$$','$$$'];

  worldCities.forEach(city => {
    catNames.forEach((cat, ci) => {
      for(let i=0;i<2;i++){
        places.push({
          name: `${cat} in ${city.name} ${i+1}`,
          category: cat,
          description: `${cat} destination in ${city.name}, ${city.country}`,
          rating: rnd(4.0, 4.9),
          reviewCount: ri(100, 3000),
          priceLevel: priceLevels[Math.floor(Math.random()*4)],
          image: catImages[cat],
          location:{
            address: `${city.name}, ${city.country}`,
            city: city.name,
            country: city.country,
            coordinates:[city.coords[0]+(Math.random()-0.5)*0.1, city.coords[1]+(Math.random()-0.5)*0.1],
          },
        });
      }
    });
  });

  return places;
};

// ── ROUTES ─────────────────────────────────────────────────────

app.get('/api/health', (req, res) => res.json({
  status:'ok', 
  timestamp:new Date().toISOString(),
  mongodb: mongoose.connection.readyState===1 ? 'connected' : 'disconnected',
}));

// GET ALL PLACES
app.get('/api/places', async (req, res) => {
  try {
    const limit  = parseInt(req.query.limit) || 2000;
    const places = await Place.find().sort({rating:-1}).limit(limit);
    console.log(`✅ /api/places - Found ${places.length} places`);
    res.json({ success:true, count:places.length, data:places });
  } catch(e){ 
    console.error('❌ /api/places error:', e.message);
    res.status(500).json({ success:false, error:e.message }); 
  }
});

// ✅✅✅ FIXED SEARCH - NOW RETURNS ALL FIELDS ✅✅✅
app.get('/api/places/search', async (req, res) => {
  try {
    let { q, category, lat, lng } = req.query;
    
    console.log(`\n🔍 Search Request: q="${q}", category="${category}"`);
    
    // If no query, return all with ALL fields
    if(!q || q.trim() === '') {
      const all = await Place.find()
        .lean()
        .sort({rating:-1})
        .limit(2000);
      console.log(`   → No query, returning all ${all.length} places with all fields`);
      return res.json({ success:true, count:all.length, data:all });
    }
    
    q = q.trim();
    const searchTerm = q.toLowerCase();
    
    // Build MongoDB query with multiple conditions
    const query = {
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },           // Name (case-insensitive)
        { 'location.city': { $regex: searchTerm, $options: 'i' } }, // City
        { 'location.country': { $regex: searchTerm, $options: 'i' } }, // Country
        { 'location.address': { $regex: searchTerm, $options: 'i' } }, // Address
        { category: { $regex: searchTerm, $options: 'i' } },       // Category
        { description: { $regex: searchTerm, $options: 'i' } },    // Description
      ]
    };
    
    // Apply category filter if provided
    if(category && category !== 'all' && category.trim() !== '') {
      query.category = { $regex: category.trim(), $options: 'i' };
    }
    
    // Execute search - use .lean() to return plain JS objects with all fields
    const places = await Place.find(query)
      .lean()  // ← KEY FIX: Return all fields in plain JS object
      .sort({ rating: -1, reviewCount: -1 })
      .limit(2000);
    
    console.log(`   ✅ Found ${places.length} places for "${q}"`);
    if(places.length > 0) {
      console.log(`   First 3: ${places.slice(0,3).map(p => `"${p.name}"`).join(', ')}`);
      console.log(`   Sample place keys: ${Object.keys(places[0]).join(', ')}`);
    }
    
    res.json({ success:true, count:places.length, data:places });
    
  } catch(e){ 
    console.error('❌ Search error:', e.message);
    res.status(500).json({ success:false, error:e.message }); 
  }
});

// DEBUG: GET all places for a specific city
app.get('/api/debug/city/:cityName', async (req, res) => {
  try {
    const city = req.params.cityName;
    const places = await Place.find({ 'location.city': { $regex: city, $options: 'i' } }).lean();
    console.log(`\n🔍 DEBUG /city/${city}: Found ${places.length} places`);
    if(places.length > 0) {
      console.log(`   Sample place: ${JSON.stringify(places[0], null, 2)}`);
    }
    res.json({ success:true, city, count:places.length, data:places });
  } catch(e){
    res.status(500).json({ success:false, error:e.message });
  }
});

// NEARBY
app.get('/api/places/nearby', async (req, res) => {
  try {
    const { lat, lng, maxDistance=50000 } = req.query;
    if(!lat||!lng){
      const all = await Place.find().lean().limit(2000);
      return res.json({ success:true, count:all.length, data:all });
    }
    const places = await Place.find({
      'location.coordinates':{
        $near:{ $geometry:{ type:'Point', coordinates:[parseFloat(lng),parseFloat(lat)] }, $maxDistance:parseInt(maxDistance) }
      }
    }).lean();
    res.json({ success:true, count:places.length, data:places });
  } catch(e){ res.json({ success:true, count:0, data:[], error:e.message }); }
});

// SINGLE PLACE
app.get('/api/places/:id', async (req, res) => {
  try {
    const place = await Place.findById(req.params.id).lean();
    if(!place) return res.status(404).json({ success:false, error:'Place not found' });
    res.json({ success:true, data:place });
  } catch(e){ res.status(500).json({ success:false, error:e.message }); }
});

// CREATE PLACE
app.post('/api/places', async (req, res) => {
  try {
    const saved = await new Place(req.body).save();
    res.status(201).json({ success:true, data:saved });
  } catch(e){ res.status(500).json({ success:false, error:e.message }); }
});

// REVIEWS
app.post('/api/reviews', async (req, res) => {
  try {
    const saved = await new Review(req.body).save();
    if(req.body.placeId){
      const reviews = await Review.find({ placeId:req.body.placeId });
      const avg     = reviews.reduce((s,r)=>s+(r.rating||0),0)/reviews.length;
      await Place.findByIdAndUpdate(req.body.placeId,{ rating:parseFloat(avg.toFixed(1)), reviewCount:reviews.length });
    }
    res.status(201).json({ success:true, data:saved });
  } catch(e){ res.status(500).json({ success:false, error:e.message }); }
});

// ANALYTICS
app.get('/api/analytics/overview', async (req, res) => {
  try {
    const [total, totalReviews, avgArr] = await Promise.all([
      Place.countDocuments(), Review.countDocuments(),
      Place.aggregate([{ $group:{ _id:null, avg:{ $avg:'$rating' } } }]),
    ]);
    res.json({ success:true, data:{
      totalPlaces:total, totalReviews,
      avgRating: avgArr[0]?.avg?.toFixed(1)||'4.5',
      totalVisits: Math.floor(Math.random()*50000)+10000,
    }});
  } catch(e){ res.status(500).json({ success:false, error:e.message }); }
});

app.get('/api/analytics/trends', (req, res) => res.json({ success:true, data:[
  {day:'Mon',visits:450,searches:230},{day:'Tue',visits:500,searches:260},
  {day:'Wed',visits:550,searches:290},{day:'Thu',visits:600,searches:320},
  {day:'Fri',visits:650,searches:350},{day:'Sat',visits:700,searches:380},
  {day:'Sun',visits:750,searches:410},
]}));

app.get('/api/analytics/categories', async (req, res) => {
  try {
    const cats = await Place.aggregate([{ $group:{ _id:'$category', count:{ $sum:1 } } }]);
    res.json({ success:true, data: cats.map(c=>({ name:(c._id||'Other'), value:c.count })) });
  } catch(e){ res.status(500).json({ success:false, error:e.message }); }
});

// AI RECOMMEND
app.post('/api/ai/recommend', async (req, res) => {
  try {
    const { category } = req.body;
    const query = category ? { category:{ $regex:category, $options:'i' } } : {};
    const places = await Place.find(query).lean().sort({ rating:-1 }).limit(2000);
    res.json({ success:true, data:places });
  } catch(e){ res.status(500).json({ success:false, error:e.message }); }
});

// ROUTE OPTIMIZE
app.post('/api/routes/optimize', async (req, res) => {
  try {
    const { waypoints } = req.body;
    res.json({ success:true, route:waypoints });
  } catch(e){ res.status(500).json({ success:false, error:e.message }); }
});

// ── SEED ───────────────────────────────────────────────────────
app.post('/api/seed', async (req, res) => {
  try {
    console.log('\n🌱 Starting database seed...');
    const existing = await Place.countDocuments();
    console.log(`📊 Current places in DB: ${existing}`);
    
    await Place.deleteMany({});
    console.log('🗑️  Cleared existing places');

    const seedPlaces = generatePlaces();
    console.log(`📍 Generated ${seedPlaces.length} places`);

    // Batch insert
    const BATCH = 100;
    let inserted = 0;
    for(let i=0;i<seedPlaces.length;i+=BATCH){
      await Place.insertMany(seedPlaces.slice(i,i+BATCH));
      inserted += Math.min(BATCH, seedPlaces.length-i);
    }

    // Breakdown
    const byCountry  = {};
    const byCategory = {};
    seedPlaces.forEach(p=>{
      const co=p.location?.country||'Unknown';
      const ca=p.category||'Unknown';
      byCountry[co]  = (byCountry[co]||0)+1;
      byCategory[ca] = (byCategory[ca]||0)+1;
    });
    const countries = Object.keys(byCountry).length;

    console.log(`\n✅ Seeded ${inserted} places across ${countries} countries\n`);
    console.log('📊 By Category:');
    Object.entries(byCategory).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count}`);
    });
    console.log('\n');

    res.json({
      success:true,
      message:`✅ Seeded ${inserted} places across ${countries} countries!`,
      count:inserted,
      byCategory,
      byCountry,
      countries,
    });
  } catch(e){
    console.error('❌ Seed error:', e.message);
    res.status(500).json({ success:false, error:e.message });
  }
});

// ── START ──────────────────────────────────────────────────────
const server = app.listen(PORT, ()=>{
  console.log(`\n✅ SmartMap AI Server Running!`);
  console.log(`📍 API:      http://localhost:${PORT}/api`);
  console.log(`🏥 Health:   http://localhost:${PORT}/api/health`);
  console.log(`🌱 Seed:     POST http://localhost:${PORT}/api/seed`);
  console.log(`🌐 Frontend: http://localhost:3000\n`);
  console.log(`📍 DEBUG: http://localhost:${PORT}/api/debug/city/Islamabad\n`);
});

server.on('error', err=>{
  if(err.code==='EADDRINUSE'){
    console.error(`❌ Port ${PORT} in use. Kill it or change PORT in .env`);
    process.exit(1);
  }
});

module.exports = app;