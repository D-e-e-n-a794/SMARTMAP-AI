require('dotenv').config();
const Place = require('../models/Place');

const seedPlaces = async () => {
  try {
    // Clear existing data
    await Place.deleteMany({});
    console.log('✅ Cleared existing places');

    // 60+ GLOBAL PLACES with ALL CATEGORIES
    const placesData = [
      // ========== 🇵🇰 PAKISTAN ==========
      {
        name: 'Faisal Mosque Islamabad',
        category: 'landmark',
        location: {
          type: 'Point',
          coordinates: [73.2397, 33.7294],
          city: 'Islamabad',
          country: 'Pakistan',
          address: 'Faisal Mosque, Islamabad, Pakistan'
        },
        image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600',
        description: 'One of the largest mosques in the world with stunning modern architecture.',
        priceLevel: '$',
        rating: 4.8,
        reviewCount: 2345
      },
      {
        name: 'Minar-e-Pakistan',
        category: 'landmark',
        location: {
          type: 'Point',
          coordinates: [74.3161, 31.5825],
          city: 'Lahore',
          country: 'Pakistan',
          address: 'Minar-e-Pakistan, Lahore, Pakistan'
        },
        image: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=600',
        description: 'Historic monument celebrating Pakistan independence with panoramic views.',
        priceLevel: '$',
        rating: 4.6,
        reviewCount: 1890
      },
      {
        name: 'Badshahi Mosque Lahore',
        category: 'landmark',
        location: {
          type: 'Point',
          coordinates: [74.3137, 31.5860],
          city: 'Lahore',
          country: 'Pakistan',
          address: 'Badshahi Mosque, Lahore, Pakistan'
        },
        image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600',
        description: 'Magnificent Mughal mosque with red sandstone architecture.',
        priceLevel: '$',
        rating: 4.9,
        reviewCount: 3456
      },
      {
        name: 'Coffee Planet Peshawar',
        category: 'cafe',
        location: {
          type: 'Point',
          coordinates: [71.5585, 34.0151],
          city: 'Peshawar',
          country: 'Pakistan',
          address: 'Firdous Market, Peshawar, Pakistan'
        },
        image: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=600',
        description: 'Cozy cafe offering authentic Pakistani tea and coffee.',
        priceLevel: '$',
        rating: 4.4,
        reviewCount: 567
      },
      {
        name: 'Chief Grill Peshawar',
        category: 'restaurant',
        location: {
          type: 'Point',
          coordinates: [71.5500, 34.0200],
          city: 'Peshawar',
          country: 'Pakistan',
          address: 'Peshawar, Pakistan'
        },
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
        description: 'Traditional Pakistani grill restaurant famous for kebabs.',
        priceLevel: '$$',
        rating: 4.5,
        reviewCount: 789
      },
      {
        name: 'Lahore Fort',
        category: 'landmark',
        location: {
          type: 'Point',
          coordinates: [74.3076, 31.5860],
          city: 'Lahore',
          country: 'Pakistan',
          address: 'Lahore Fort, Pakistan'
        },
        image: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=600',
        description: 'Ancient fortress with Mughal architecture and historical significance.',
        priceLevel: '$',
        rating: 4.7,
        reviewCount: 2100
      },
      {
        name: 'Karachi Museum',
        category: 'museum',
        location: {
          type: 'Point',
          coordinates: [67.0396, 24.8607],
          city: 'Karachi',
          country: 'Pakistan',
          address: 'Burns Road, Karachi, Pakistan'
        },
        image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600',
        description: 'Museum showcasing Pakistan cultural heritage and artifacts.',
        priceLevel: '$',
        rating: 4.3,
        reviewCount: 890
      },

      // ========== 🇺🇸 USA ==========
      {
        name: 'Statue of Liberty',
        category: 'landmark',
        location: {
          type: 'Point',
          coordinates: [-74.0445, 40.6892],
          city: 'New York',
          country: 'USA',
          address: 'Liberty Island, New York, NY 10004'
        },
        image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600',
        description: 'Iconic symbol of freedom with stunning NYC views.',
        priceLevel: '$$',
        rating: 4.7,
        reviewCount: 5678
      },
      {
        name: 'Central Park',
        category: 'park',
        location: {
          type: 'Point',
          coordinates: [-73.9680, 40.7829],
          city: 'New York',
          country: 'USA',
          address: 'Central Park, New York, NY 10024'
        },
        image: 'https://images.unsplash.com/photo-1491236014055-111ecb48753d?w=600',
        description: 'Urban oasis with beautiful landscapes and recreational facilities.',
        priceLevel: '$',
        rating: 4.8,
        reviewCount: 4567
      },
      {
        name: 'Times Square',
        category: 'landmark',
        location: {
          type: 'Point',
          coordinates: [-73.9857, 40.7580],
          city: 'New York',
          country: 'USA',
          address: 'Times Square, New York, NY'
        },
        image: 'https://images.unsplash.com/photo-1560707303-4e980ce876ad?w=600',
        description: 'World-famous plaza with bright lights and endless energy.',
        priceLevel: '$$',
        rating: 4.5,
        reviewCount: 3456
      },
      {
        name: 'Metropolitan Museum of Art',
        category: 'museum',
        location: {
          type: 'Point',
          coordinates: [-73.9626, 40.7813],
          city: 'New York',
          country: 'USA',
          address: '1000 5th Avenue, New York, NY 10028'
        },
        image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600',
        description: 'World-renowned museum with 2 million artworks.',
        priceLevel: '$$',
        rating: 4.9,
        reviewCount: 6789
      },
      {
        name: 'Golden Gate Bridge',
        category: 'landmark',
        location: {
          type: 'Point',
          coordinates: [-122.4787, 37.8199],
          city: 'San Francisco',
          country: 'USA',
          address: 'Golden Gate Bridge, San Francisco, CA'
        },
        image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600',
        description: 'Iconic suspension bridge with panoramic bay views.',
        priceLevel: '$',
        rating: 4.9,
        reviewCount: 6789
      },
      {
        name: 'Starbucks Reserve Roastery',
        category: 'cafe',
        location: {
          type: 'Point',
          coordinates: [-122.4056, 37.7842],
          city: 'San Francisco',
          country: 'USA',
          address: 'San Francisco, CA'
        },
        image: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=600',
        description: 'Premium coffee roastery with artisanal preparations.',
        priceLevel: '$$',
        rating: 4.7,
        reviewCount: 2345
      },
      {
        name: 'Hollywood Sign',
        category: 'landmark',
        location: {
          type: 'Point',
          coordinates: [-118.3189, 34.1381],
          city: 'Los Angeles',
          country: 'USA',
          address: 'Hollywood Sign, Los Angeles, CA'
        },
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600',
        description: 'Legendary white letters representing global entertainment industry.',
        priceLevel: '$',
        rating: 4.6,
        reviewCount: 2345
      },
      {
        name: 'Griffith Observatory',
        category: 'landmark',
        location: {
          type: 'Point',
          coordinates: [-118.3041, 34.1184],
          city: 'Los Angeles',
          country: 'USA',
          address: 'Griffith Observatory, Los Angeles, CA'
        },
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600',
        description: 'Observatory with telescopes and planetarium shows.',
        priceLevel: '$',
        rating: 4.6,
        reviewCount: 3456
      },
      {
        name: 'The Ivy Restaurant',
        category: 'restaurant',
        location: {
          type: 'Point',
          coordinates: [-118.3857, 34.0822],
          city: 'Los Angeles',
          country: 'USA',
          address: 'West Hollywood, CA'
        },
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
        description: 'Iconic celebrity hotspot with classic American cuisine.',
        priceLevel: '$$$',
        rating: 4.5,
        reviewCount: 1890
      },

      // ========== 🇬🇧 UK ==========
      {
        name: 'Big Ben',
        category: 'landmark',
        location: {
          type: 'Point',
          coordinates: [-0.1246, 51.4975],
          city: 'London',
          country: 'UK',
          address: 'Palace of Westminster, London, UK'
        },
        image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600',
        description: 'Iconic clock tower symbol of London.',
        priceLevel: '$$',
        rating: 4.7,
        reviewCount: 4567
      },
      {
        name: 'British Museum',
        category: 'museum',
        location: {
          type: 'Point',
          coordinates: [-0.1269, 51.5194],
          city: 'London',
          country: 'UK',
          address: 'Great Russell Street, London, WC1B 3DG'
        },
        image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600',
        description: 'World-renowned museum with 8 million artifacts.',
        priceLevel: '$',
        rating: 4.8,
        reviewCount: 5678
      },
      {
        name: 'Hyde Park',
        category: 'park',
        location: {
          type: 'Point',
          coordinates: [-0.1654, 51.5073],
          city: 'London',
          country: 'UK',
          address: 'Hyde Park, London, UK'
        },
        image: 'https://images.unsplash.com/photo-1466275146928-f67db3167d10?w=600',
        description: 'Beautiful royal park perfect for strolls.',
        priceLevel: '$',
        rating: 4.6,
        reviewCount: 3456
      },
      {
        name: 'The Ivy Restaurant London',
        category: 'restaurant',
        location: {
          type: 'Point',
          coordinates: [-0.1283, 51.5099],
          city: 'London',
          country: 'UK',
          address: 'Covent Garden, London'
        },
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
        description: 'Legendary London restaurant with classic British cuisine.',
        priceLevel: '$$$',
        rating: 4.6,
        reviewCount: 2345
      },
      {
        name: 'Fortnum & Mason Cafe',
        category: 'cafe',
        location: {
          type: 'Point',
          coordinates: [-0.1355, 51.5079],
          city: 'London',
          country: 'UK',
          address: 'Piccadilly, London'
        },
        image: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=600',
        description: 'Historic luxury tea room and cafe.',
        priceLevel: '$$$',
        rating: 4.7,
        reviewCount: 1890
      },
      {
        name: 'Tower of London',
        category: 'landmark',
        location: {
          type: 'Point',
          coordinates: [-0.0759, 51.5055],
          city: 'London',
          country: 'UK',
          address: 'Tower of London, London, UK'
        },
        image: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=600',
        description: 'Historic fortress with Crown Jewels.',
        priceLevel: '$$',
        rating: 4.7,
        reviewCount: 4567
      },

      // ========== 🇫🇷 FRANCE ==========
      {
        name: 'Eiffel Tower',
        category: 'landmark',
        location: {
          type: 'Point',
          coordinates: [2.2945, 48.8584],
          city: 'Paris',
          country: 'France',
          address: '5 Avenue Anatole France, 75007 Paris'
        },
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600',
        description: 'Iconic iron lattice tower with breathtaking Paris views.',
        priceLevel: '$$',
        rating: 4.9,
        reviewCount: 7890
      },
      {
        name: 'Louvre Museum',
        category: 'museum',
        location: {
          type: 'Point',
          coordinates: [2.3360, 48.8606],
          city: 'Paris',
          country: 'France',
          address: 'Rue de Rivoli, 75004 Paris'
        },
        image: 'https://images.unsplash.com/photo-1499856871957-5b8620a42a38?w=600',
        description: 'World largest museum with Mona Lisa and masterpieces.',
        priceLevel: '$$',
        rating: 4.8,
        reviewCount: 6789
      },
      {
        name: 'Café de Flore',
        category: 'cafe',
        location: {
          type: 'Point',
          coordinates: [2.3331, 48.8547],
          city: 'Paris',
          country: 'France',
          address: '172 Boulevard Saint-Germain, 75006 Paris'
        },
        image: 'https://images.unsplash.com/photo-1534991542629-52ec1c58e0e7?w=600',
        description: 'Historic café with traditional French atmosphere.',
        priceLevel: '$$$',
        rating: 4.7,
        reviewCount: 4567
      },
      {
        name: 'L\'Astrance Restaurant',
        category: 'restaurant',
        location: {
          type: 'Point',
          coordinates: [2.2870, 48.8634],
          city: 'Paris',
          country: 'France',
          address: '4 rue Beethoven, 75016 Paris'
        },
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
        description: 'Michelin-starred French restaurant with innovative cuisine.',
        priceLevel: '$$$',
        rating: 4.8,
        reviewCount: 2345
      },
      {
        name: 'Notre-Dame Cathedral',
        category: 'landmark',
        location: {
          type: 'Point',
          coordinates: [2.3499, 48.8530],
          city: 'Paris',
          country: 'France',
          address: '6 Parvis Notre-Dame, 75004 Paris'
        },
        image: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=600',
        description: 'Gothic cathedral with stunning architecture.',
        priceLevel: '$',
        rating: 4.6,
        reviewCount: 5678
      },
      {
        name: 'Versailles Palace',
        category: 'landmark',
        location: {
          type: 'Point',
          coordinates: [2.1202, 48.8047],
          city: 'Versailles',
          country: 'France',
          address: 'Palace of Versailles, Versailles, France'
        },
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600',
        description: 'Royal palace with magnificent gardens and fountains.',
        priceLevel: '$$',
        rating: 4.8,
        reviewCount: 6789
      },

      // ========== 🇯🇵 JAPAN ==========
      {
        name: 'Tokyo Tower',
        category: 'landmark',
        location: {
          type: 'Point',
          coordinates: [139.7454, 35.6586],
          city: 'Tokyo',
          country: 'Japan',
          address: '4 Chome-2-8 Shibakoen, Minato City, Tokyo'
        },
        image: 'https://images.unsplash.com/photo-1540959375944-7049f642e9a1?w=600',
        description: 'Iconic red steel tower with panoramic Tokyo views.',
        priceLevel: '$$',
        rating: 4.7,
        reviewCount: 3456
      },
      {
        name: 'Senso-ji Temple',
        category: 'landmark',
        location: {
          type: 'Point',
          coordinates: [139.7969, 35.7148],
          city: 'Tokyo',
          country: 'Japan',
          address: '2 Chome-3-1 Asakusa, Taito City, Tokyo'
        },
        image: 'https://images.unsplash.com/photo-1522383507921-efb23cba17ee?w=600',
        description: 'Ancient Buddhist temple with iconic red lantern.',
        priceLevel: '$',
        rating: 4.8,
        reviewCount: 4567
      },
      {
        name: 'Shibuya Crossing',
        category: 'landmark',
        location: {
          type: 'Point',
          coordinates: [139.7010, 35.6595],
          city: 'Tokyo',
          country: 'Japan',
          address: 'Shibuya, Tokyo, Japan'
        },
        image: 'https://images.unsplash.com/photo-1551632786-de41adffbf91?w=600',
        description: 'Busiest pedestrian crossing in the world.',
        priceLevel: '$',
        rating: 4.6,
        reviewCount: 3234
      },
      {
        name: 'Tsukiji Outer Market Cafe',
        category: 'cafe',
        location: {
          type: 'Point',
          coordinates: [139.7756, 35.6653],
          city: 'Tokyo',
          country: 'Japan',
          address: 'Tsukiji, Tokyo'
        },
        image: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=600',
        description: 'Traditional market with fresh food and cafe.',
        priceLevel: '$',
        rating: 4.5,
        reviewCount: 2345
      },
      {
        name: 'Roppongi Hills Museum',
        category: 'museum',
        location: {
          type: 'Point',
          coordinates: [139.7297, 35.6662],
          city: 'Tokyo',
          country: 'Japan',
          address: 'Roppongi Hills, Tokyo'
        },
        image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600',
        description: 'Modern art museum in shopping complex.',
        priceLevel: '$$',
        rating: 4.6,
        reviewCount: 1890
      },
      {
        name: 'Kyoto Arashiyama Bamboo Grove',
        category: 'park',
        location: {
          type: 'Point',
          coordinates: [135.6747, 35.0122],
          city: 'Kyoto',
          country: 'Japan',
          address: 'Sagatenryuji Susukinobabacho, Kyoto'
        },
        image: 'https://images.unsplash.com/photo-1466275146928-f67db3167d10?w=600',
        description: 'Serene bamboo forest path.',
        priceLevel: '$',
        rating: 4.8,
        reviewCount: 4567
      },

      // ========== 🇦🇪 UAE ==========
      {
        name: 'Burj Khalifa',
        category: 'landmark',
        location: {
          type: 'Point',
          coordinates: [55.2744, 25.1972],
          city: 'Dubai',
          country: 'UAE',
          address: 'Downtown Dubai, Dubai, UAE'
        },
        image: 'https://images.unsplash.com/photo-1512453333214-b91c1ab03f9f?w=600',
        description: 'World tallest building with 163 observation levels.',
        priceLevel: '$$$',
        rating: 4.7,
        reviewCount: 5678
      },
      {
        name: 'Dubai Mall',
        category: 'shop',
        location: {
          type: 'Point',
          coordinates: [55.2699, 25.1972],
          city: 'Dubai',
          country: 'UAE',
          address: 'Downtown Dubai, Dubai, UAE'
        },
        image: 'https://images.unsplash.com/photo-1567723552543-a13e70a34ee0?w=600',
        description: 'Massive shopping mall with 1200+ stores.',
        priceLevel: '$$',
        rating: 4.6,
        reviewCount: 4567
      },
      {
        name: 'Gold Souk Dubai',
        category: 'shop',
        location: {
          type: 'Point',
          coordinates: [55.2627, 25.2654],
          city: 'Dubai',
          country: 'UAE',
          address: 'Gold Souk, Dubai, UAE'
        },
        image: 'https://images.unsplash.com/photo-1567723552543-a13e70a34ee0?w=600',
        description: 'Traditional market with gold jewelry and souvenirs.',
        priceLevel: '$',
        rating: 4.5,
        reviewCount: 3456
      },
      {
        name: 'Nobu Dubai Restaurant',
        category: 'restaurant',
        location: {
          type: 'Point',
          coordinates: [55.1821, 25.1438],
          city: 'Dubai',
          country: 'UAE',
          address: 'Atlantis the Palm, Dubai'
        },
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
        description: 'Michelin-starred Japanese-Peruvian fusion restaurant.',
        priceLevel: '$$$',
        rating: 4.8,
        reviewCount: 2345
      },
      {
        name: 'Arabica Coffee Co Dubai',
        category: 'cafe',
        location: {
          type: 'Point',
          coordinates: [55.2711, 25.2065],
          city: 'Dubai',
          country: 'UAE',
          address: 'Al Fahidi Historical District, Dubai'
        },
        image: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=600',
        description: 'Specialty coffee roastery in historic district.',
        priceLevel: '$$',
        rating: 4.7,
        reviewCount: 1890
      },

      // ========== 🇦🇺 AUSTRALIA ==========
      {
        name: 'Sydney Opera House',
        category: 'landmark',
        location: {
          type: 'Point',
          coordinates: [151.2153, -33.8568],
          city: 'Sydney',
          country: 'Australia',
          address: 'Bennelong Point, Sydney NSW 2000'
        },
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
        description: 'Iconic modernist building with distinctive shell-shaped roof.',
        priceLevel: '$$',
        rating: 4.8,
        reviewCount: 6789
      },
      {
        name: 'Bondi Beach',
        category: 'beach',
        location: {
          type: 'Point',
          coordinates: [151.2749, -33.8901],
          city: 'Sydney',
          country: 'Australia',
          address: 'Bondi Beach, Sydney NSW 2026'
        },
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600',
        description: 'Famous beach with golden sand and vibrant atmosphere.',
        priceLevel: '$',
        rating: 4.7,
        reviewCount: 5678
      },
      {
        name: 'Bondi Beach Cafe Culture',
        category: 'cafe',
        location: {
          type: 'Point',
          coordinates: [151.2761, -33.8905],
          city: 'Sydney',
          country: 'Australia',
          address: 'Bondi Beach, Sydney'
        },
        image: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=600',
        description: 'Trendy beach-side cafes with specialty coffee.',
        priceLevel: '$$',
        rating: 4.6,
        reviewCount: 2345
      },
      {
        name: 'Sydney Harbour National Park',
        category: 'park',
        location: {
          type: 'Point',
          coordinates: [151.2295, -33.8425],
          city: 'Sydney',
          country: 'Australia',
          address: 'Sydney Harbour, Sydney'
        },
        image: 'https://images.unsplash.com/photo-1466275146928-f67db3167d10?w=600',
        description: 'Beautiful park with harbour views and hiking trails.',
        priceLevel: '$',
        rating: 4.7,
        reviewCount: 3456
      },
      {
        name: 'Australian Museum',
        category: 'museum',
        location: {
          type: 'Point',
          coordinates: [151.2123, -33.8757],
          city: 'Sydney',
          country: 'Australia',
          address: '1 William Street, Sydney NSW 2010'
        },
        image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600',
        description: 'Natural history museum with Australian artifacts.',
        priceLevel: '$$',
        rating: 4.5,
        reviewCount: 2100
      },

      // ========== 🇮🇹 ITALY ==========
      {
        name: 'Colosseum Rome',
        category: 'landmark',
        location: {
          type: 'Point',
          coordinates: [12.4964, 41.8902],
          city: 'Rome',
          country: 'Italy',
          address: 'Piazza del Colosseo, 1, 00184 Rome'
        },
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
        description: 'Ancient Roman amphitheater, iconic structure of empire.',
        priceLevel: '$$',
        rating: 4.8,
        reviewCount: 5678
      },
      {
        name: 'Trevi Fountain',
        category: 'landmark',
        location: {
          type: 'Point',
          coordinates: [12.4833, 41.9009],
          city: 'Rome',
          country: 'Italy',
          address: 'Piazza di Trevi, 00187 Rome'
        },
        image: 'https://images.unsplash.com/photo-1552832860-cfde20b31b7f?w=600',
        description: 'Stunning Baroque fountain with coin-tossing tradition.',
        priceLevel: '$',
        rating: 4.7,
        reviewCount: 4567
      },
      {
        name: 'Caffè Sant\'Eustachio',
        category: 'cafe',
        location: {
          type: 'Point',
          coordinates: [12.4732, 41.8980],
          city: 'Rome',
          country: 'Italy',
          address: 'Piazza Sant\'Eustachio, Rome'
        },
        image: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=600',
        description: 'Historic espresso bar famous for chocolate-topped coffee.',
        priceLevel: '$',
        rating: 4.6,
        reviewCount: 1890
      },
      {
        name: 'Armando al Pantheon Restaurant',
        category: 'restaurant',
        location: {
          type: 'Point',
          coordinates: [12.4737, 41.8989],
          city: 'Rome',
          country: 'Italy',
          address: 'Via dei Pastini, Rome'
        },
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
        description: 'Traditional Roman cuisine with Pantheon views.',
        priceLevel: '$$',
        rating: 4.7,
        reviewCount: 2345
      },
      {
        name: 'Vatican Museums',
        category: 'museum',
        location: {
          type: 'Point',
          coordinates: [12.4534, 41.9070],
          city: 'Rome',
          country: 'Italy',
          address: 'Vatican Museums, Vatican City'
        },
        image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600',
        description: 'World-class art museum with Sistine Chapel ceiling.',
        priceLevel: '$$',
        rating: 4.8,
        reviewCount: 5678
      },
      {
        name: 'Pantheon Rome',
        category: 'landmark',
        location: {
          type: 'Point',
          coordinates: [12.4737, 41.8989],
          city: 'Rome',
          country: 'Italy',
          address: 'Piazza della Rotonda, Rome'
        },
        image: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=600',
        description: 'Ancient temple with stunning dome and oculus.',
        priceLevel: '$',
        rating: 4.8,
        reviewCount: 4567
      },

      // ========== 🇪🇸 SPAIN ==========
      {
        name: 'Sagrada Familia Barcelona',
        category: 'landmark',
        location: {
          type: 'Point',
          coordinates: [2.1744, 41.4036],
          city: 'Barcelona',
          country: 'Spain',
          address: 'Carrer de Mallorca, 401, 08013 Barcelona'
        },
        image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600',
        description: 'Gaudí masterpiece basilica with intricate architecture.',
        priceLevel: '$$',
        rating: 4.8,
        reviewCount: 6789
      },
      {
        name: 'Park Güell',
        category: 'park',
        location: {
          type: 'Point',
          coordinates: [2.1528, 41.4145],
          city: 'Barcelona',
          country: 'Spain',
          address: 'Carrer d\'Olot, 5, 08024 Barcelona'
        },
        image: 'https://images.unsplash.com/photo-1583390968051-fc91707cf82c?w=600',
        description: 'Whimsical park with colorful mosaics and city views.',
        priceLevel: '$$',
        rating: 4.7,
        reviewCount: 5678
      },
      {
        name: 'Gresca Restaurant Barcelona',
        category: 'restaurant',
        location: {
          type: 'Point',
          coordinates: [2.1592, 41.3851],
          city: 'Barcelona',
          country: 'Spain',
          address: 'Carrer de Còrsega, Barcelona'
        },
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
        description: 'Michelin-starred restaurant with modern Catalan cuisine.',
        priceLevel: '$$$',
        rating: 4.7,
        reviewCount: 2345
      },
      {
        name: 'Picasso Museum Barcelona',
        category: 'museum',
        location: {
          type: 'Point',
          coordinates: [2.1775, 41.3858],
          city: 'Barcelona',
          country: 'Spain',
          address: 'Carrer de Montcada, 15-23, Barcelona'
        },
        image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600',
        description: 'Collection of Pablo Picasso masterpieces.',
        priceLevel: '$$',
        rating: 4.6,
        reviewCount: 3456
      },
      {
        name: 'Federal Cafe Barcelona',
        category: 'cafe',
        location: {
          type: 'Point',
          coordinates: [2.1803, 41.3857],
          city: 'Barcelona',
          country: 'Spain',
          address: 'Carrer del Carme, Barcelona'
        },
        image: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=600',
        description: 'Trendy brunch cafe with specialty coffee.',
        priceLevel: '$$',
        rating: 4.6,
        reviewCount: 1890
      },

      // ========== 🇹🇭 THAILAND ==========
      {
        name: 'Grand Palace Bangkok',
        category: 'landmark',
        location: {
          type: 'Point',
          coordinates: [100.4925, 13.6505],
          city: 'Bangkok',
          country: 'Thailand',
          address: 'Na Phra Lan Road, Bangkok 10200'
        },
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600',
        description: 'Magnificent royal palace with golden architecture.',
        priceLevel: '$',
        rating: 4.7,
        reviewCount: 3456
      },
      {
        name: 'Wat Pho Bangkok',
        category: 'landmark',
        location: {
          type: 'Point',
          coordinates: [100.4883, 13.6459],
          city: 'Bangkok',
          country: 'Thailand',
          address: 'Sanam Chai Road, Bangkok 10200'
        },
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600',
        description: 'Temple famous for giant reclining Buddha statue.',
        priceLevel: '$',
        rating: 4.8,
        reviewCount: 4567
      },
      {
        name: 'Chatuchak Market Bangkok',
        category: 'shop',
        location: {
          type: 'Point',
          coordinates: [100.5531, 13.8021],
          city: 'Bangkok',
          country: 'Thailand',
          address: 'Chatuchak Market, Bangkok'
        },
        image: 'https://images.unsplash.com/photo-1567723552543-a13e70a34ee0?w=600',
        description: 'World largest weekend market with 15000+ vendors.',
        priceLevel: '$',
        rating: 4.6,
        reviewCount: 3234
      },
      {
        name: 'Gaggan Restaurant Bangkok',
        category: 'restaurant',
        location: {
          type: 'Point',
          coordinates: [100.5547, 13.7313],
          city: 'Bangkok',
          country: 'Thailand',
          address: 'Bangkok'
        },
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
        description: 'Progressive Indian cuisine with artistic presentation.',
        priceLevel: '$$$',
        rating: 4.8,
        reviewCount: 2345
      },
      {
        name: 'Ristr8to Coffee Bangkok',
        category: 'cafe',
        location: {
          type: 'Point',
          coordinates: [100.5328, 13.7407],
          city: 'Bangkok',
          country: 'Thailand',
          address: 'Thonglor, Bangkok'
        },
        image: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=600',
        description: 'Specialty coffee roastery with artisanal brews.',
        priceLevel: '$$',
        rating: 4.7,
        reviewCount: 1890
      },

      // ========== 🇸🇬 SINGAPORE ==========
      {
        name: 'Marina Bay Sands',
        category: 'landmark',
        location: {
          type: 'Point',
          coordinates: [103.8554, 1.2867],
          city: 'Singapore',
          country: 'Singapore',
          address: '10 Bayfront Avenue, Singapore 018956'
        },
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600',
        description: 'Iconic hotel with rooftop infinity pool.',
        priceLevel: '$$$',
        rating: 4.7,
        reviewCount: 5678
      },
      {
        name: 'Gardens by the Bay',
        category: 'park',
        location: {
          type: 'Point',
          coordinates: [103.8639, 1.2816],
          city: 'Singapore',
          country: 'Singapore',
          address: '18 Marina Gardens Drive, Singapore 018953'
        },
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600',
        description: 'Futuristic gardens with Supertrees and light shows.',
        priceLevel: '$$',
        rating: 4.8,
        reviewCount: 6789
      },
      {
        name: 'Tiong Bahru Cafe Singapore',
        category: 'cafe',
        location: {
          type: 'Point',
          coordinates: [103.8237, 1.2978],
          city: 'Singapore',
          country: 'Singapore',
          address: 'Tiong Bahru, Singapore'
        },
        image: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=600',
        description: 'Trendy heritage cafes with specialty coffee.',
        priceLevel: '$$',
        rating: 4.6,
        reviewCount: 2345
      },
      {
        name: 'ArtScience Museum Singapore',
        category: 'museum',
        location: {
          type: 'Point',
          coordinates: [103.8554, 1.2867],
          city: 'Singapore',
          country: 'Singapore',
          address: 'Marina Bay Sands, Singapore'
        },
        image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600',
        description: 'Museum blending art science and technology.',
        priceLevel: '$$',
        rating: 4.6,
        reviewCount: 1890
      },

      // ========== 🇹🇷 TURKEY ==========
      {
        name: 'Hagia Sophia Istanbul',
        category: 'landmark',
        location: {
          type: 'Point',
          coordinates: [28.9784, 41.0086],
          city: 'Istanbul',
          country: 'Turkey',
          address: 'Sultan Ahmet, Ayasofya Meydanı, Istanbul'
        },
        image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600',
        description: 'Historic Byzantine monument with stunning dome.',
        priceLevel: '$$',
        rating: 4.7,
        reviewCount: 4567
      },
      {
        name: 'Blue Mosque Istanbul',
        category: 'landmark',
        location: {
          type: 'Point',
          coordinates: [28.9766, 41.0054],
          city: 'Istanbul',
          country: 'Turkey',
          address: 'Fatih, Sultanahmet Mah., Istanbul'
        },
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600',
        description: 'Ottoman mosque with blue Iznik tiles.',
        priceLevel: '$',
        rating: 4.6,
        reviewCount: 3456
      },
      {
        name: 'Grand Bazaar Istanbul',
        category: 'shop',
        location: {
          type: 'Point',
          coordinates: [28.9640, 41.0087],
          city: 'Istanbul',
          country: 'Turkey',
          address: 'Grand Bazaar, Istanbul'
        },
        image: 'https://images.unsplash.com/photo-1567723552543-a13e70a34ee0?w=600',
        description: 'Historic covered market with 4000+ shops.',
        priceLevel: '$',
        rating: 4.5,
        reviewCount: 2345
      },
      {
        name: 'Karakoy Coffee Istanbul',
        category: 'cafe',
        location: {
          type: 'Point',
          coordinates: [28.9725, 41.0265],
          city: 'Istanbul',
          country: 'Turkey',
          address: 'Karakoy, Istanbul'
        },
        image: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=600',
        description: 'Specialty coffee roastery in bohemian district.',
        priceLevel: '$$',
        rating: 4.7,
        reviewCount: 1890
      },

      // ========== 🇪🇬 EGYPT ==========
      {
        name: 'Great Pyramid Giza',
        category: 'landmark',
        location: {
          type: 'Point',
          coordinates: [31.1342, 29.9792],
          city: 'Cairo',
          country: 'Egypt',
          address: 'Giza, Cairo, Egypt'
        },
        image: 'https://images.unsplash.com/photo-1571115764595-644a12c7d58d?w=600',
        description: 'Last standing ancient wonder of the world.',
        priceLevel: '$$',
        rating: 4.8,
        reviewCount: 5678
      },
      {
        name: 'Egyptian Museum Cairo',
        category: 'museum',
        location: {
          type: 'Point',
          coordinates: [31.2357, 30.0477],
          city: 'Cairo',
          country: 'Egypt',
          address: 'Tahrir Square, Cairo, Egypt'
        },
        image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600',
        description: 'Museum with Egyptian artifacts and mummies.',
        priceLevel: '$',
        rating: 4.6,
        reviewCount: 3456
      },
      {
        name: 'Nile River Cruise Cairo',
        category: 'landmark',
        location: {
          type: 'Point',
          coordinates: [31.2476, 30.0444],
          city: 'Cairo',
          country: 'Egypt',
          address: 'Nile River, Cairo, Egypt'
        },
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600',
        description: 'Scenic cruise with Cairo cityscape views.',
        priceLevel: '$$',
        rating: 4.7,
        reviewCount: 2345
      },
      {
        name: 'Khan El Khalili Cafe Cairo',
        category: 'cafe',
        location: {
          type: 'Point',
          coordinates: [31.2494, 30.0610],
          city: 'Cairo',
          country: 'Egypt',
          address: 'Khan El Khalili Bazaar, Cairo'
        },
        image: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=600',
        description: 'Historic bazaar cafe with traditional Egyptian tea.',
        priceLevel: '$',
        rating: 4.5,
        reviewCount: 1890
      },

      // ========== 🇷🇺 RUSSIA ==========
      {
        name: 'Red Square Moscow',
        category: 'landmark',
        location: {
          type: 'Point',
          coordinates: [37.6208, 55.7539],
          city: 'Moscow',
          country: 'Russia',
          address: 'Red Square, Moscow, Russia'
        },
        image: 'https://images.unsplash.com/photo-1547421080-7cc2caa01a18?w=600',
        description: 'Historic square surrounded by iconic architecture.',
        priceLevel: '$',
        rating: 4.6,
        reviewCount: 3456
      },
      {
        name: 'Saint Basil\'s Cathedral',
        category: 'landmark',
        location: {
          type: 'Point',
          coordinates: [37.6229, 55.7530],
          city: 'Moscow',
          country: 'Russia',
          address: 'Red Square, Moscow 109012'
        },
        image: 'https://images.unsplash.com/photo-1569154509287-d4b46bac34f5?w=600',
        description: 'Colorful cathedral with distinctive onion-shaped domes.',
        priceLevel: '$',
        rating: 4.7,
        reviewCount: 4567
      },
      {
        name: 'Hermitage Museum St Petersburg',
        category: 'museum',
        location: {
          type: 'Point',
          coordinates: [30.3161, 59.9411],
          city: 'St. Petersburg',
          country: 'Russia',
          address: 'Palace Square, St. Petersburg'
        },
        image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600',
        description: 'World largest art museum with 3 million works.',
        priceLevel: '$$',
        rating: 4.8,
        reviewCount: 5678
      },

      // ========== 🇨🇳 CHINA ==========
      {
        name: 'Great Wall Beijing',
        category: 'landmark',
        location: {
          type: 'Point',
          coordinates: [116.0324, 40.4319],
          city: 'Beijing',
          country: 'China',
          address: 'Huairou, Beijing, China'
        },
        image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600',
        description: 'Ancient defensive wall spanning thousands of miles.',
        priceLevel: '$$',
        rating: 4.8,
        reviewCount: 6789
      },
      {
        name: 'Forbidden City Beijing',
        category: 'landmark',
        location: {
          type: 'Point',
          coordinates: [116.3975, 39.9163],
          city: 'Beijing',
          country: 'China',
          address: '4 Jingshan Front Street, Beijing 100009'
        },
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600',
        description: 'Former Chinese imperial palace with vast complex.',
        priceLevel: '$$',
        rating: 4.7,
        reviewCount: 5678
      },
      {
        name: 'Summer Palace Beijing',
        category: 'park',
        location: {
          type: 'Point',
          coordinates: [116.2748, 39.9967],
          city: 'Beijing',
          country: 'China',
          address: 'Haidian District, Beijing'
        },
        image: 'https://images.unsplash.com/photo-1466275146928-f67db3167d10?w=600',
        description: 'Imperial gardens with Kunming Lake.',
        priceLevel: '$',
        rating: 4.6,
        reviewCount: 3456
      },
      {
        name: 'Din Tai Fung Shanghai',
        category: 'restaurant',
        location: {
          type: 'Point',
          coordinates: [121.4737, 31.2304],
          city: 'Shanghai',
          country: 'China',
          address: 'Nanjing Road, Shanghai'
        },
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
        description: 'Famous dumpling restaurant with Michelin stars.',
        priceLevel: '$$',
        rating: 4.8,
        reviewCount: 4567
      },

  { "name": "Khyber Pass Coffee Lounge", "category": "Cafe", "description": "Traditional green tea and robust espressos.", "location": { "type": "Point", "coordinates": [71.5249, 34.0151] }, "city": "Peshawar", "country": "Pakistan", "rating": 4.7, "reviewCount": 142, "priceLevel": "$", "visitCount": 0, "featured": true },
  { "name": "Chief Burger University Road", "category": "Restaurant", "description": "Legendary local fast-food burger joint.", "location": { "type": "Point", "coordinates": [71.4782, 33.9994] }, "city": "Peshawar", "country": "Pakistan", "rating": 4.5, "reviewCount": 890, "priceLevel": "$$", "visitCount": 0, "featured": true },
  { "name": "Charsi Tikka Namak Mandi", "category": "Restaurant", "description": "World-famous traditional mutton karahi.", "location": { "type": "Point", "coordinates": [71.5622, 34.0061] }, "city": "Peshawar", "country": "Pakistan", "rating": 4.8, "reviewCount": 2300, "priceLevel": "$$", "visitCount": 0, "featured": true },
  { "name": "Bala Hisar Fort View", "category": "Landmark", "description": "Historic fortress offering panoramic city overlooks.", "location": { "type": "Point", "coordinates": [71.5694, 34.0125] }, "city": "Peshawar", "country": "Pakistan", "rating": 4.6, "reviewCount": 412, "priceLevel": "$", "visitCount": 0, "featured": false },
  { "name": "Peshawar Museum Heritage", "category": "Museum", "description": "Grand collection of Gandhara Buddhist art items.", "location": { "type": "Point", "coordinates": [71.5583, 34.0081] }, "city": "Peshawar", "country": "Pakistan", "rating": 4.4, "reviewCount": 310, "priceLevel": "$", "visitCount": 0, "featured": true },
  { "name": "Tatara Park Hayatabad", "category": "Park", "description": "Beautiful lake view park tucked inside Hayatabad.", "location": { "type": "Point", "coordinates": [71.4333, 33.9722] }, "city": "Peshawar", "country": "Pakistan", "rating": 4.3, "reviewCount": 1100, "priceLevel": "$", "visitCount": 0, "featured": false },
  { "name": "Dean's Trade Center", "category": "Shop", "description": "Mega shopping plaza with local clothes and electronics.", "location": { "type": "Point", "coordinates": [71.5422, 33.9989] }, "city": "Peshawar", "country": "Pakistan", "rating": 4.1, "reviewCount": 1500, "priceLevel": "$$", "visitCount": 0, "featured": false },
  { "name": "Saddar Bazaar Traditional Market", "category": "Shop", "description": "Vibrant local marketplace with Peshawari chappals.", "location": { "type": "Point", "coordinates": [71.5312, 34.0012] }, "city": "Peshawar", "country": "Pakistan", "rating": 4.6, "reviewCount": 3100, "priceLevel": "$", "visitCount": 0, "featured": true },
  { "name": "Shelton Accommodator Inn", "category": "Hotel", "description": "Premium corporate lodging sector choice.", "location": { "type": "Point", "coordinates": [71.5122, 34.0111] }, "city": "Peshawar", "country": "Pakistan", "rating": 4.2, "reviewCount": 88, "priceLevel": "$$$", "visitCount": 0, "featured": false },
  { "name": "Pearl Continental Peshawar", "category": "Hotel", "description": "Luxury 5-star lodging with high-tier hospitality setups.", "location": { "type": "Point", "coordinates": [71.5511, 34.0155] }, "city": "Peshawar", "country": "Pakistan", "rating": 4.7, "reviewCount": 1940, "priceLevel": "$$$$", "visitCount": 0, "featured": true },
  { "name": "The Monal Islamabad", "category": "Restaurant", "description": "Terrace dining sitting atop the Margalla Hills panorama.", "location": { "type": "Point", "coordinates": [73.0348, 33.7483] }, "city": "Islamabad", "country": "Pakistan", "rating": 4.8, "reviewCount": 12400, "priceLevel": "$$$", "visitCount": 0, "featured": true },
  { "name": "Faisal Mosque Plaza", "category": "Landmark", "description": "Iconic desert-tent architectural marvel monument.", "location": { "type": "Point", "coordinates": [73.0118, 33.7297] }, "city": "Islamabad", "country": "Pakistan", "rating": 4.9, "reviewCount": 45000, "priceLevel": "$", "visitCount": 0, "featured": true },
  { "name": "Centaurus Shopping Complex", "category": "Shop", "description": "Three mega mega-towers containing upscale megamalls.", "location": { "type": "Point", "coordinates": [73.0501, 33.7077] }, "city": "Islamabad", "country": "Pakistan", "rating": 4.5, "reviewCount": 22000, "priceLevel": "$$$", "visitCount": 0, "featured": true },
  { "name": "Lok Virsa Heritage Museum", "category": "Museum", "description": "Folk history and deep cultural exhibition halls.", "location": { "type": "Point", "coordinates": [73.0682, 33.6934] }, "city": "Islamabad", "country": "Pakistan", "rating": 4.6, "reviewCount": 3200, "priceLevel": "$", "visitCount": 0, "featured": false },
  { "name": "Daman-e-Koh Park Viewpoint", "category": "Park", "description": "Hillside garden overlook spot featuring binoculars.", "location": { "type": "Point", "coordinates": [73.0583, 33.7381] }, "city": "Islamabad", "country": "Pakistan", "rating": 4.6, "reviewCount": 8900, "priceLevel": "$", "visitCount": 0, "featured": true },
  { "name": "Secret Recipe Cafe F-7", "category": "Cafe", "description": "Cozy workspace cafe serving gourmet cheese treats.", "location": { "type": "Point", "coordinates": [73.0552, 33.7194] }, "city": "Islamabad", "country": "Pakistan", "rating": 4.4, "reviewCount": 540, "priceLevel": "$$", "visitCount": 0, "featured": false },
  { "name": "Burning Brownie Beverly Centre", "category": "Cafe", "description": "Premium visual style bakery with artisanal roasted beans.", "location": { "type": "Point", "coordinates": [73.0611, 33.7122] }, "city": "Islamabad", "country": "Pakistan", "rating": 4.7, "reviewCount": 1600, "priceLevel": "$$", "visitCount": 0, "featured": true },
  { "name": "Serena Hotel Sanctuary", "category": "Hotel", "description": "Deluxe traditional Swati craftsmanship structures.", "location": { "type": "Point", "coordinates": [73.1002, 33.7225] }, "city": "Islamabad", "country": "Pakistan", "rating": 4.9, "reviewCount": 5300, "priceLevel": "$$$$", "visitCount": 0, "featured": true },
  { "name": "Savour Foods Blue Area", "category": "Restaurant", "description": "Legendary affordable chicken pulao benchmark outlet.", "location": { "type": "Point", "coordinates": [73.0699, 33.7101] }, "city": "Islamabad", "country": "Pakistan", "rating": 4.5, "reviewCount": 14000, "priceLevel": "$", "visitCount": 0, "featured": false },
  { "name": "Lake View Bird Park", "category": "Park", "description": "Massive lakeside activity grounds with avian walkthrough enclosures.", "location": { "type": "Point", "coordinates": [73.1234, 33.7112] }, "city": "Islamabad", "country": "Pakistan", "rating": 4.4, "reviewCount": 9800, "priceLevel": "$$", "visitCount": 0, "featured": false },
  { "name": "Rawal Lake Jet Beach", "category": "Beach", "description": "Freshwater reservoir shoreline boasting water sports.", "location": { "type": "Point", "coordinates": [73.1189, 33.7022] }, "city": "Islamabad", "country": "Pakistan", "rating": 4.1, "reviewCount": 2400, "priceLevel": "$", "visitCount": 0, "featured": false },
  { "name": "Eiffel Tower Vista Cafe", "category": "Cafe", "description": "Charming espresso counter facing down the central iron trellis view.", "location": { "type": "Point", "coordinates": [2.2945, 48.8584] }, "city": "Paris", "country": "France", "rating": 4.7, "reviewCount": 8900, "priceLevel": "$$$", "visitCount": 0, "featured": true },
  { "name": "Le Bistro Parisien", "category": "Restaurant", "description": "Classic French duck confit right on the Seine riverbanks.", "location": { "type": "Point", "coordinates": [2.2972, 48.8592] }, "city": "Paris", "country": "France", "rating": 4.4, "reviewCount": 3100, "priceLevel": "$$$", "visitCount": 0, "featured": false },
  { "name": "The Louvre Glass Pyramid", "category": "Museum", "description": "World's prime fine art complex holding Mona Lisa.", "location": { "type": "Point", "coordinates": [2.3376, 48.8606] }, "city": "Paris", "country": "France", "rating": 4.9, "reviewCount": 67000, "priceLevel": "$$", "visitCount": 0, "featured": true },
  { "name": "Arc de Triomphe Overlook", "category": "Landmark", "description": "Triumphal monument standing center at the star intersection.", "location": { "type": "Point", "coordinates": [2.2950, 48.8738] }, "city": "Paris", "country": "France", "rating": 4.8, "reviewCount": 29000, "priceLevel": "$", "visitCount": 0, "featured": false },
  { "name": "Jardin du Luxembourg", "category": "Park", "description": "Palatial dynamic lawns featuring historic water basins.", "location": { "type": "Point", "coordinates": [2.3372, 48.8462] }, "city": "Paris", "country": "France", "rating": 4.7, "reviewCount": 18500, "priceLevel": "$", "visitCount": 0, "featured": false },
  { "name": "Plage de la Seine Spot", "category": "Beach", "description": "Seasonal urban pop-up sand lounge deck strips.", "location": { "type": "Point", "coordinates": [2.3522, 48.8530] }, "city": "Paris", "country": "France", "rating": 3.9, "reviewCount": 450, "priceLevel": "$", "visitCount": 0, "featured": false },
  { "name": "The Ritz Paris Luxury", "category": "Hotel", "description": "The golden standard historic luxury accommodation option.", "location": { "type": "Point", "coordinates": [2.3294, 48.8681] }, "city": "Paris", "country": "France", "rating": 4.9, "reviewCount": 1800, "priceLevel": "$$$$$", "visitCount": 0, "featured": true },
  { "name": "Champs-Élysées Galeries", "category": "Shop", "description": "Premier global flagships shopping avenue run.", "location": { "type": "Point", "coordinates": [2.3050, 48.8698] }, "city": "Paris", "country": "France", "rating": 4.6, "reviewCount": 15000, "priceLevel": "$$$$", "visitCount": 0, "featured": true },
  { "name": "Monmouth Coffee Covent Garden", "category": "Cafe", "description": "Artisanal coffee filter brewing institution landmark.", "location": { "type": "Point", "coordinates": [-0.1268, 51.5137] }, "city": "London", "country": "United Kingdom", "rating": 4.7, "reviewCount": 2400, "priceLevel": "$$", "visitCount": 0, "featured": true },
  { "name": "The Ivy West Street", "category": "Restaurant", "description": "Celebrity favorite British classic dining hall venue.", "location": { "type": "Point", "coordinates": [-0.1281, 51.5125] }, "city": "London", "country": "United Kingdom", "rating": 4.5, "reviewCount": 4200, "priceLevel": "$$$$", "visitCount": 0, "featured": false },
  { "name": "The British Museum Dome", "category": "Museum", "description": "Grand courtyard ceiling protecting the Rosetta Stone artifact.", "location": { "type": "Point", "coordinates": [-0.1269, 51.5194] }, "city": "London", "country": "United Kingdom", "rating": 4.8, "reviewCount": 54000, "priceLevel": "$", "visitCount": 0, "featured": true },
  { "name": "Big Ben Elizabeth Tower", "category": "Landmark", "description": "The quintessential Neo-Gothic clock tower architectural signature.", "location": { "type": "Point", "coordinates": [-0.1246, 51.5007] }, "city": "London", "country": "United Kingdom", "rating": 4.7, "reviewCount": 38000, "priceLevel": "$", "visitCount": 0, "featured": true },
  { "name": "Hyde Park Serpentine", "category": "Park", "description": "Massive royal recreational parklands containing boating lakes.", "location": { "type": "Point", "coordinates": [-0.1657, 51.5073] }, "city": "London", "country": "United Kingdom", "rating": 4.7, "reviewCount": 27000, "priceLevel": "$", "visitCount": 0, "featured": false },
  { "name": "Ruislip Lido Beach", "category": "Beach", "description": "Inland natural lake sandy beach strip on London outskirts.", "location": { "type": "Point", "coordinates": [-0.4322, 51.5912] }, "city": "London", "country": "United Kingdom", "rating": 4.1, "reviewCount": 1800, "priceLevel": "$", "visitCount": 0, "featured": false },
  { "name": "The Savoy Palace Hotel", "category": "Hotel", "description": "Edwardian luxury masterclass overlooking the River Thames.", "location": { "type": "Point", "coordinates": [-0.1203, 51.5104] }, "city": "London", "country": "United Kingdom", "rating": 4.8, "reviewCount": 3300, "priceLevel": "$$$$$", "visitCount": 0, "featured": true },
  { "name": "Harrods Knightsbridge Department", "category": "Shop", "description": "Legendary high-end food halls and absolute luxury fashion.", "location": { "type": "Point", "coordinates": [-0.1631, 51.4994] }, "city": "London", "country": "United Kingdom", "rating": 4.6, "reviewCount": 31000, "priceLevel": "$$$$", "visitCount": 0, "featured": true },
  { "name": "Shibuya Blue Bottle Espresso", "category": "Cafe", "description": "Minimalist modern precise pour-over coffee bar location.", "location": { "type": "Point", "coordinates": [139.7042, 35.6621] }, "city": "Tokyo", "country": "Japan", "rating": 4.6, "reviewCount": 1200, "priceLevel": "$$", "visitCount": 0, "featured": false },
  { "name": "Sukiyabashi Jiro Ginza", "category": "Restaurant", "description": "World Elite 3-Star Michelin traditional edomae sushi master.", "location": { "type": "Point", "coordinates": [139.7641, 35.6722] }, "city": "Tokyo", "country": "Japan", "rating": 4.8, "reviewCount": 650, "priceLevel": "$$$$$", "visitCount": 0, "featured": true },
  { "name": "Tokyo National Museum Arts", "category": "Museum", "description": "Deep imperial artifacts, samurai swords, and historic scrolls.", "location": { "type": "Point", "coordinates": [139.7764, 35.7188] }, "city": "Tokyo", "country": "Japan", "rating": 4.6, "reviewCount": 9400, "priceLevel": "$$", "visitCount": 0, "featured": false },
  { "name": "Tokyo Skytree Obseravtory", "category": "Landmark", "description": "The world's absolute tallest freestanding broadcast tower view deck.", "location": { "type": "Point", "coordinates": [139.8107, 35.7101] }, "city": "Tokyo", "country": "Japan", "rating": 4.8, "reviewCount": 42000, "priceLevel": "$$$", "visitCount": 0, "featured": true },
  { "name": "Shinjuku Gyoen National Garden", "category": "Park", "description": "Stunning formal cherry blossom traditional bridge pathways.", "location": { "type": "Point", "coordinates": [139.7101, 35.6852] }, "city": "Tokyo", "country": "Japan", "rating": 4.8, "reviewCount": 19000, "priceLevel": "$", "visitCount": 0, "featured": true },
  { "name": "Odaiba Artificial Beach Strip", "category": "Beach", "description": "Futuristic skyline views hugging an urban sand bay shoreline.", "location": { "type": "Point", "coordinates": [139.7761, 35.6294] }, "city": "Tokyo", "country": "Japan", "rating": 4.3, "reviewCount": 5400, "priceLevel": "$", "visitCount": 0, "featured": false },
  { "name": "Aman Tokyo Sanctuary", "category": "Hotel", "description": "Zen sky-lobby hotel blending minimal basalt stone aesthetics.", "location": { "type": "Point", "coordinates": [139.7655, 35.6848] }, "city": "Tokyo", "country": "Japan", "rating": 4.9, "reviewCount": 820, "priceLevel": "$$$$$", "visitCount": 0, "featured": true },
  { "name": "Akihabara Radio Kaikan", "category": "Shop", "description": "The absolute epicentre structure for modern electronics culture items.", "location": { "type": "Point", "coordinates": [139.7719, 35.6978] }, "city": "Tokyo", "country": "Japan", "rating": 4.5, "reviewCount": 11000, "priceLevel": "$$", "visitCount": 0, "featured": true },
  { "name": "Stumptown Coffee Ace Hotel", "category": "Cafe", "description": "Cold brew pioneer warehouse style lobby cafe setup.", "location": { "type": "Point", "coordinates": [-73.9878, 40.7458] }, "city": "New York", "country": "USA", "rating": 4.5, "reviewCount": 1800, "priceLevel": "$$", "visitCount": 0, "featured": false },
  { "name": "Joe's Shanghai Chinatown", "category": "Restaurant", "description": "Legendary pork soup dumplings signature dining basement venue.", "location": { "type": "Point", "coordinates": [-73.9969, 40.7142] }, "city": "New York", "country": "USA", "rating": 4.4, "reviewCount": 6800, "priceLevel": "$$", "visitCount": 0, "featured": true },
  { "name": "The Met Fifth Avenue", "category": "Museum", "description": "Colossal global artifact halls mapping 5000 years of design.", "location": { "type": "Point", "coordinates": [-73.9632, 40.7794] }, "city": "New York", "country": "USA", "rating": 4.9, "reviewCount": 51000, "priceLevel": "$$", "visitCount": 0, "featured": true },
  { "name": "Empire State Building Spire", "category": "Landmark", "description": "Classic Art Deco skyscraper multi-tier tower deck overview.", "location": { "type": "Point", "coordinates": [-73.9857, 40.7484] }, "city": "New York", "country": "USA", "rating": 4.7, "reviewCount": 64000, "priceLevel": "$$$", "visitCount": 0, "featured": false },
  { "name": "Central Park Bethesda Terrace", "category": "Park", "description": "The iconic Manhattan foliage oasis containing structural lake fountains.", "location": { "type": "Point", "coordinates": [-73.9708, 40.7737] }, "city": "New York", "country": "USA", "rating": 4.9, "reviewCount": 125000, "priceLevel": "$", "visitCount": 0, "featured": true },
  { "name": "Coney Island Sandy Beach", "category": "Beach", "description": "Vintage boardwalk seaside strip hosting ocean rollercoasters.", "location": { "type": "Point", "coordinates": [-73.9742, 40.5744] }, "city": "New York", "country": "USA", "rating": 4.3, "reviewCount": 14000, "priceLevel": "$", "visitCount": 0, "featured": false },
  { "name": "The Plaza Hotel Manhattan", "category": "Hotel", "description": "Historic French Renaissance palace style grand luxury landmark.", "location": { "type": "Point", "coordinates": [-73.9740, 40.7644] }, "city": "New York", "country": "USA", "rating": 4.7, "reviewCount": 7800, "priceLevel": "$$$$$", "visitCount": 0, "featured": true },
  { "name": "Fifth Avenue Luxury Mile", "category": "Shop", "description": "Elite destination mapping flagship global brand jewelry vaults.", "location": { "type": "Point", "coordinates": [-73.9719, 40.7618] }, "city": "New York", "country": "USA", "rating": 4.7, "reviewCount": 19000, "priceLevel": "$$$$", "visitCount": 0, "featured": true },
  { "name": "Paramount Coffee House Surry Hills", "category": "Cafe", "description": "Sunlit warehouse loft showcasing custom micro-lot single origins.", "location": { "type": "Point", "coordinates": [151.2119, -33.8791] }, "city": "Sydney", "country": "Australia", "rating": 4.6, "reviewCount": 890, "priceLevel": "$$", "visitCount": 0, "featured": false },
  { "name": "Quay Waterfront Dining", "category": "Restaurant", "description": "Award-winning high culinary view directly framing harbor sails.", "location": { "type": "Point", "coordinates": [151.2094, -33.8583] }, "city": "Sydney", "country": "Australia", "rating": 4.7, "reviewCount": 1400, "priceLevel": "$$$$$", "visitCount": 0, "featured": true },
  { "name": "Australian Museum Science", "category": "Museum", "description": "Deep taxonomy galleries charting native outback fossils and geology.", "location": { "type": "Point", "coordinates": [151.2131, -33.8744] }, "city": "Sydney", "country": "Australia", "rating": 4.5, "reviewCount": 3800, "priceLevel": "$$", "visitCount": 0, "featured": false },
  { "name": "Sydney Opera House Deck", "category": "Landmark", "description": "The transcendent geometric sail shell modern structural wonder.", "location": { "type": "Point", "coordinates": [151.2153, -33.8568] }, "city": "Sydney", "country": "Australia", "rating": 4.9, "reviewCount": 42000, "priceLevel": "$$$$", "visitCount": 0, "featured": true },
  { "name": "Royal Botanic Garden Sydney", "category": "Park", "description": "Harborfront pathways showing giant exotic native canopy trees.", "location": { "type": "Point", "coordinates": [151.2194, -33.8642] }, "city": "Sydney", "country": "Australia", "rating": 4.8, "reviewCount": 16000, "priceLevel": "$", "visitCount": 0, "featured": true },
  { "name": "Bondi Beach Pavilion Bay", "category": "Beach", "description": "World elite deep white crescent sand surfing point break.", "location": { "type": "Point", "coordinates": [151.2742, -33.8915] }, "city": "Sydney", "country": "Australia", "rating": 4.8, "reviewCount": 34000, "priceLevel": "$", "visitCount": 0, "featured": true },
  { "name": "The Park Hyatt Sydney", "category": "Hotel", "description": "Waterfront absolute luxury docks viewing directly beneath the bridge spans.", "location": { "type": "Point", "coordinates": [151.2089, -33.8552] }, "city": "Sydney", "country": "Australia", "rating": 4.9, "reviewCount": 1100, "priceLevel": "$$$$$", "visitCount": 0, "featured": true },
  { "name": "Queen Victoria Building QVB", "category": "Shop", "description": "Glorious 19th-century Romanesque arcade domes detailing stained glass window panels.", "location": { "type": "Point", "coordinates": [151.2067, -33.8717] }, "city": "Sydney", "country": "Australia", "rating": 4.6, "reviewCount": 12000, "priceLevel": "$$$", "visitCount": 0, "featured": false },
  { "name": "Truth Coffee Cape Town", "category": "Cafe", "description": "Extravagant Steampunk themed espresso fantasy warehouse machinery space.", "location": { "type": "Point", "coordinates": [18.4261, -33.9281] }, "city": "Cape Town", "country": "South Africa", "rating": 4.7, "reviewCount": 3200, "priceLevel": "$$", "visitCount": 0, "featured": true },
  { "name": "The Test Kitchen", "category": "Restaurant", "description": "Elite industrial molecular gastronomy artistic plating courses.", "location": { "type": "Point", "coordinates": [18.4611, -33.9272] }, "city": "Cape Town", "country": "South Africa", "rating": 4.8, "reviewCount": 1100, "priceLevel": "$$$$$", "visitCount": 0, "featured": true },
  { "name": "Zeitz MOCAA Museum Silo", "category": "Museum", "description": "Hollowed-out architectural concrete elevator silo housing contemporary African art panels.", "location": { "type": "Point", "coordinates": [18.4233, -33.9083] }, "city": "Cape Town", "country": "South Africa", "rating": 4.6, "reviewCount": 2400, "priceLevel": "$$", "visitCount": 0, "featured": true },
  { "name": "Table Mountain Aerial Cable", "category": "Landmark", "description": "Flat-top geological plateau overlook framing two ocean coastlines.", "location": { "type": "Point", "coordinates": [18.4028, -33.9628] }, "city": "Cape Town", "country": "South Africa", "rating": 4.9, "reviewCount": 36000, "priceLevel": "$$$", "visitCount": 0, "featured": true },
  { "name": "Kirstenbosch Botanical Gardens", "category": "Park", "description": "Curved suspension steel canopy bridges winding above unique mountainside flora.", "location": { "type": "Point", "coordinates": [18.4325, -33.9875] }, "city": "Cape Town", "country": "South Africa", "rating": 4.8, "reviewCount": 14000, "priceLevel": "$$", "visitCount": 0, "featured": false },
  { "name": "Camps Bay White Beach", "category": "Beach", "description": "Palm-lined fine granite sand strip backing into Twelve Apostles mountain walls.", "location": { "type": "Point", "coordinates": [18.3789, -33.9514] }, "city": "Cape Town", "country": "South Africa", "rating": 4.7, "reviewCount": 11000, "priceLevel": "$", "visitCount": 0, "featured": true },
  { "name": "The Silo Hotel Waterfront", "category": "Hotel", "description": "Multi-tier glass geometric convex window configurations looking over marine harbors.", "location": { "type": "Point", "coordinates": [18.4231, -33.9081] }, "city": "Cape Town", "country": "South Africa", "rating": 4.9, "reviewCount": 420, "priceLevel": "$$$$$", "visitCount": 0, "featured": false },
  { "name": "V&A Waterfront Market", "category": "Shop", "description": "Historic active maritime jetty converted into diamond galleries and regional craft stalls.", "location": { "type": "Point", "coordinates": [18.4201, -33.9031] }, "city": "Cape Town", "country": "South Africa", "rating": 4.6, "reviewCount": 45000, "priceLevel": "$$$", "visitCount": 0, "featured": true },
  { "name": "Café Central Wien", "category": "Cafe", "description": "Historic 19th-century intellectual hub under vaulted columns.", "location": { "type": "Point", "coordinates": [16.3654, 48.2103] }, "city": "Vienna", "country": "Austria", "rating": 4.5, "reviewCount": 16000, "priceLevel": "$$$", "visitCount": 0, "featured": true },
  { "name": "Steirereck Fine Dining", "category": "Restaurant", "description": "Monolithic mirror glass cubes serving avant-garde Austrian dishes.", "location": { "type": "Point", "coordinates": [16.3842, 48.2044] }, "city": "Vienna", "country": "Austria", "rating": 4.7, "reviewCount": 1900, "priceLevel": "$$$$$", "visitCount": 0, "featured": true },
  { "name": "Kunsthistorisches Museum", "category": "Museum", "description": "Opulent marble interiors guarding high Renaissance art masterworks.", "location": { "type": "Point", "coordinates": [16.3617, 48.2036] }, "city": "Vienna", "country": "Austria", "rating": 4.8, "reviewCount": 12000, "priceLevel": "$$", "visitCount": 0, "featured": false },
  { "name": "Schönbrunn Imperial Palace", "category": "Landmark", "description": "Habsburg dynasty summer castle displaying sprawling baroque hedge layouts.", "location": { "type": "Point", "coordinates": [16.3122, 48.1848] }, "city": "Vienna", "country": "Austria", "rating": 4.8, "reviewCount": 49000, "priceLevel": "$$", "visitCount": 0, "featured": true },
  { "name": "Wiener Prater Green Park", "category": "Park", "description": "Avenue woods holding the historic landmark giant spinning iron wheel.", "location": { "type": "Point", "coordinates": [16.3981, 48.2158] }, "city": "Vienna", "country": "Austria", "rating": 4.4, "reviewCount": 31000, "priceLevel": "$", "visitCount": 0, "featured": false },
  { "name": "Donauinsel Pebble Beach", "category": "Beach", "description": "Island river banks hosting summer water swimming trails.", "location": { "type": "Point", "coordinates": [16.4111, 48.2281] }, "city": "Vienna", "country": "Austria", "rating": 4.3, "reviewCount": 3400, "priceLevel": "$", "visitCount": 0, "featured": false },
  { "name": "Hotel Sacher Wien", "category": "Hotel", "description": "Elegant aristocratic lodging fame birthplace of the authentic Sachertorte cake.", "location": { "type": "Point", "coordinates": [16.3692, 48.2039] }, "city": "Vienna", "country": "Austria", "rating": 4.7, "reviewCount": 2800, "priceLevel": "$$$$$", "visitCount": 0, "featured": true },
  { "name": "Kohlmarkt Atelier Boutiques", "category": "Shop", "description": "High-end pedestrian luxury corridor leading towards the royal palace gates.", "location": { "type": "Point", "coordinates": [16.3669, 48.2089] }, "city": "Vienna", "country": "Austria", "rating": 4.6, "reviewCount": 5400, "priceLevel": "$$$$", "visitCount": 0, "featured": false },
  { "name": "The Coffee Academics Wanchai", "category": "Cafe", "description": "Industrial style laboratory serving glass-blown single origin extractions.", "location": { "type": "Point", "coordinates": [114.1749, 22.2784] }, "city": "Hong Kong", "country": "China", "rating": 4.4, "reviewCount": 920, "priceLevel": "$$$", "visitCount": 0, "featured": false },
  { "name": "Lung King Heen Cantonese", "category": "Restaurant", "description": "First Chinese restaurant globally to secure 3 Michelin stars consistently.", "location": { "type": "Point", "coordinates": [114.1568, 22.2868] }, "city": "Hong Kong", "country": "China", "rating": 4.7, "reviewCount": 1100, "priceLevel": "$$$$$", "visitCount": 0, "featured": true },
  { "name": "M+ Museum of Visual Culture", "category": "Museum", "description": "Enormous modern waterfront structure mapping twentieth-century Asian media art sets.", "location": { "type": "Point", "coordinates": [114.1594, 22.3012] }, "city": "Hong Kong", "country": "China", "rating": 4.5, "reviewCount": 3100, "priceLevel": "$$", "visitCount": 0, "featured": true },
  { "name": "Victoria Peak Tram Point", "category": "Landmark", "description": "Classic vertical steel funicular scaling towards the highest city fog line viewpoints.", "location": { "type": "Point", "coordinates": [114.1439, 22.2711] }, "city": "Hong Kong", "country": "China", "rating": 4.8, "reviewCount": 39000, "priceLevel": "$$", "visitCount": 0, "featured": true },
  { "name": "Hong Kong Park Aviary", "category": "Park", "description": "Dense walled rainforest valley layout preserving waterfalls inside high skyscrapers.", "location": { "type": "Point", "coordinates": [114.1619, 22.2778] }, "city": "Hong Kong", "country": "China", "rating": 4.6, "reviewCount": 7800, "priceLevel": "$", "visitCount": 0, "featured": false },
  { "name": "Repulse Bay Beach Crescent", "category": "Beach", "description": "Wide upscale sand shoreline protected by luxury seaside apartment blocks.", "location": { "type": "Point", "coordinates": [114.1967, 22.2369] }, "city": "Hong Kong", "country": "China", "rating": 4.5, "reviewCount": 6200, "priceLevel": "$", "visitCount": 0, "featured": true },
  { "name": "The Peninsula Hong Kong", "category": "Hotel", "description": "The legendary Grand Old Lady hotel layout managing fleets of green Rolls-Royces.", "location": { "type": "Point", "coordinates": [114.1718, 22.2951] }, "city": "Hong Kong", "country": "China", "rating": 4.8, "reviewCount": 3900, "priceLevel": "$$$$$", "visitCount": 0, "featured": true },
  { "name": "Temple Street Night Market", "category": "Shop", "description": "Vibrant rows of open-air trinket stalls underneath red neon entrance blocks.", "location": { "type": "Point", "coordinates": [114.1701, 22.3061] }, "city": "Hong Kong", "country": "China", "rating": 4.2, "reviewCount": 18000, "priceLevel": "$", "visitCount": 0, "featured": false },
  { "name": "Brunetti Classico Carlton", "category": "Cafe", "description": "Roman marble espresso counters serving endless trays of fresh cannoli pastries.", "location": { "type": "Point", "coordinates": [144.9694, -37.8003] }, "city": "Melbourne", "country": "Australia", "rating": 4.5, "reviewCount": 5400, "priceLevel": "$$", "visitCount": 0, "featured": false },
  { "name": "Attica Ripponlea", "category": "Restaurant", "description": "Renowned culinary innovation lab plating unique local outback ingredients.", "location": { "type": "Point", "coordinates": [145.0006, -37.8767] }, "city": "Melbourne", "country": "Australia", "rating": 4.7, "reviewCount": 840, "priceLevel": "$$$$$", "visitCount": 0, "featured": true },
  { "name": "National Gallery of Victoria NGV", "category": "Museum", "description": "Majestic waterfall entry wall leading to historic Australian painting collections.", "location": { "type": "Point", "coordinates": [144.9691, -37.8225] }, "city": "Melbourne", "country": "Australia", "rating": 4.8, "reviewCount": 16000, "priceLevel": "$", "visitCount": 0, "featured": true },
  { "name": "Flinders Street Station Dome", "category": "Landmark", "description": "Beautiful yellow Edwardian facade clocks serving as the central urban intersection grid.", "location": { "type": "Point", "coordinates": [144.9672, -37.8181] }, "city": "Melbourne", "country": "Australia", "rating": 4.6, "reviewCount": 21000, "priceLevel": "$", "visitCount": 0, "featured": false },
  { "name": "Royal Botanic Gardens Victoria", "category": "Park", "description": "Immaculate rolling lakeside lawns holding deep collection classifications of world flora.", "location": { "type": "Point", "coordinates": [144.9801, -37.8306] }, "city": "Melbourne", "country": "Australia", "rating": 4.8, "reviewCount": 19000, "priceLevel": "$", "visitCount": 0, "featured": true },
  { "name": "St Kilda Coastal Beach", "category": "Beach", "description": "Scenic shoreline bay hosting historic wooden boardwalk piers protecting penguin nests.", "location": { "type": "Point", "coordinates": [144.9722, -37.8644] }, "city": "Melbourne", "country": "Australia", "rating": 4.4, "reviewCount": 12000, "priceLevel": "$", "visitCount": 0, "featured": false },
  { "name": "The Crown Towers Luxury", "category": "Hotel", "description": "Premium glass skyscraper hotels handling world class dynamic riverside views.", "location": { "type": "Point", "coordinates": [144.9602, -37.8228] }, "city": "Melbourne", "country": "Australia", "rating": 4.7, "reviewCount": 5200, "priceLevel": "$$$$$", "visitCount": 0, "featured": true },
  { "name": "Block Arcade Mosaic Lanes", "category": "Shop", "description": "Stunning 19th-century tile paths underneath glass canopy framework structures.", "location": { "type": "Point", "coordinates": [144.9641, -37.8158] }, "city": "Melbourne", "country": "Australia", "rating": 4.6, "reviewCount": 7400, "priceLevel": "$$$", "visitCount": 0, "featured": false },
  { "name": "Panella Pastry Palermo", "category": "Cafe", "description": "Artisanal ancient stone mill bakery serving golden Sicilian brioche configurations.", "location": { "type": "Point", "coordinates": [13.3614, 38.1155] }, "city": "Palermo", "country": "Italy", "rating": 4.5, "reviewCount": 940, "priceLevel": "$$", "visitCount": 0, "featured": false },
  { "name": "Osteria Ballarò Kitchen", "category": "Restaurant", "description": "Authentic local market stables repurposed into high fine dining seafood frameworks.", "location": { "type": "Point", "coordinates": [13.3644, 38.1139] }, "city": "Palermo", "country": "Italy", "rating": 4.4, "reviewCount": 1600, "priceLevel": "$$$", "visitCount": 0, "featured": false },
  { "name": "Palermo Regional Archeological Museum", "category": "Museum", "description": "Stunning open courtyard cloisters protecting deep ancient Punic artifact assets.", "location": { "type": "Point", "coordinates": [13.3601, 38.1206] }, "city": "Palermo", "country": "Italy", "rating": 4.6, "reviewCount": 1800, "priceLevel": "$", "visitCount": 0, "featured": false },
  { "name": "Teatro Massimo Opera Building", "category": "Landmark", "description": "Monumental Neoclassical opera house landmark fame venue from Godfather films.", "location": { "type": "Point", "coordinates": [13.3567, 38.1203] }, "city": "Palermo", "country": "Italy", "rating": 4.8, "reviewCount": 14000, "priceLevel": "$$", "visitCount": 0, "featured": true },
  { "name": "Foro Italico Lawns", "category": "Park", "description": "Sprawling modern coastal grass garden promenades facing directly out into Mediterranean bays.", "location": { "type": "Point", "coordinates": [13.3752, 38.1189] }, "city": "Palermo", "country": "Italy", "rating": 4.3, "reviewCount": 2400, "priceLevel": "$", "visitCount": 0, "featured": false },
  { "name": "Mondello White Sand Beach", "category": "Beach", "description": "Stunning turquoise coastal shallow bay framed between matching high rock headlands.", "location": { "type": "Point", "coordinates": [13.3258, 38.1994] }, "city": "Palermo", "country": "Italy", "rating": 4.6, "reviewCount": 22000, "priceLevel": "$", "visitCount": 0, "featured": true },
  { "name": "Grand Hotel Villa Igiea", "category": "Hotel", "description": "Historic coastal stone palace layouts offering high-tier luxury terraced saltwater pools.", "location": { "type": "Point", "coordinates": [13.3722, 38.1411] }, "city": "Palermo", "country": "Italy", "rating": 4.8, "reviewCount": 740, "priceLevel": "$$$$$", "visitCount": 0, "featured": true },
  { "name": "Via Maqueda Bazaar Stalls", "category": "Shop", "description": "Historic active market corridors selling fresh traditional local leather goods.", "location": { "type": "Point", "coordinates": [13.3625, 38.1158] }, "city": "Palermo", "country": "Italy", "rating": 4.5, "reviewCount": 15000, "priceLevel": "$", "visitCount": 0, "featured": false },

      // ========== 🇧🇷 BRAZIL ==========
      {
        name: 'Christ the Redeemer Rio',
        category: 'landmark',
        location: {
          type: 'Point',
          coordinates: [-43.2120, -22.9519],
          city: 'Rio de Janeiro',
          country: 'Brazil',
          address: 'Rio de Janeiro, Brazil'
        },
        image: 'https://images.unsplash.com/photo-1599748236585-48ceb2ee8c5e?w=600',
        description: 'Iconic statue overlooking Rio with panoramic views.',
        priceLevel: '$$',
        rating: 4.8,
        reviewCount: 5678
      },
      {
        name: 'Copacabana Beach Rio',
        category: 'beach',
        location: {
          type: 'Point',
          coordinates: [-43.1872, -22.9868],
          city: 'Rio de Janeiro',
          country: 'Brazil',
          address: 'Copacabana, Rio de Janeiro, Brazil'
        },
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600',
        description: 'Famous beach with vibrant atmosphere.',
        priceLevel: '$',
        rating: 4.6,
        reviewCount: 4567
      },
      {
        name: 'Ipanema Cafe Rio',
        category: 'cafe',
        location: {
          type: 'Point',
          coordinates: [-43.2033, -22.9854],
          city: 'Rio de Janeiro',
          country: 'Brazil',
          address: 'Ipanema, Rio de Janeiro, Brazil'
        },
        image: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=600',
        description: 'Beach-side cafes with specialty coffee.',
        priceLevel: '$$',
        rating: 4.6,
        reviewCount: 2345
      }
    ];

    // Insert all places
    const createdPlaces = await Place.insertMany(placesData);
    console.log(`\n✅ Successfully seeded ${createdPlaces.length} places worldwide!\n`);

    // Print summary by country
    const byCountry = {};
    const byCategory = {};
    
    createdPlaces.forEach(place => {
      const country = place.location.country;
      const category = place.category;
      
      byCountry[country] = (byCountry[country] || 0) + 1;
      byCategory[category] = (byCategory[category] || 0) + 1;
    });

    console.log('📍 Places by Country:');
    Object.keys(byCountry)
      .sort((a, b) => byCountry[b] - byCountry[a])
      .forEach(country => {
        console.log(`   🌍 ${country}: ${byCountry[country]} places`);
      });

    console.log('\n📂 Places by Category:');
    Object.keys(byCategory)
      .sort((a, b) => byCategory[b] - byCategory[a])
      .forEach(category => {
        console.log(`   📌 ${category}: ${byCategory[category]} places`);
      });

    console.log('\n🌍 Seed complete! Your app now has global coverage!\n');
    console.log('✨ Includes: Landmarks, Museums, Cafes, Restaurants, Parks, Beaches, Hotels, Shopping\n');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
};

module.exports = seedPlaces;