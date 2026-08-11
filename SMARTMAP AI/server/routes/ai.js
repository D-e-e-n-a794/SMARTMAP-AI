const express = require('express');
const router = express.Router();

// POST /api/ai/recommend - Get GLOBAL AI recommendations based on dynamic map locations
router.post('/recommend', async (req, res) => {
  try {
    const { preferences, location } = req.body;

    // 1. Load the Google Gemini SDK tool dynamically
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // 2. EASY GLOBAL LOGIC: Check if coordinates are coming from the map frontend
    let locationText = "the user's viewed map area globally";
    
    if (location && location.lat && location.lng) {
      // If user drags or searches somewhere on the globe, use those exact coordinates!
      locationText = `the global map coordinates at Latitude: ${location.lat}, Longitude: ${location.lng}`;
    } else if (typeof location === 'string' && location.trim() !== "") {
      // If the frontend sends a raw string location name like "Paris" or "Tokyo"
      locationText = `the city/region named "${location}"`;
    }

    const preferenceString = preferences && preferences.length > 0 ? preferences.join(', ') : 'interesting points of interest';

    // 3. Simple, strict instructions telling Gemini to dynamically find global venues
    const prompt = `
      You are an elite global mapping AI for the application "SmartMap AI".
      
      Target Location: Identify real venues around ${locationText}.
      Target Filters: ${preferenceString}.

      Generate a relevant array of 4 distinct recommendation categories matching this global location.
      You MUST reply ONLY with a raw JSON object matching this exact format. No markdown blocks, no \`\`\`json tags:
      {
        "recommendations": [
          {
            "id": 1,
            "name": "Local Feature Category Name",
            "reason": "Tailored description of why this fits the specified global area",
            "match": "92%",
            "icon": "📍",
            "places": ["Real Place 1", "Real Place 2", "Real Place 3"]
          }
        ]
      }
    `;

    // 4. Request the dynamic content from Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    // 5. Clean up code formats if Gemini adds markdown tags
    let cleanText = response.text.trim();
    if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();
    }

    // 6. Turn it into a real list and send it back to your dashboard cards
    const resultJson = JSON.parse(cleanText);

    res.json({
      success: true,
      data: resultJson.recommendations || []
    });

  } catch (error) {
    console.error('Global Gemini Route Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to generate global recommendations'
    });
  }
});

// POST /api/ai/optimize-route (Kept exactly identical to your project layout)
router.post('/optimize-route', async (req, res) => {
  try {
    const { waypoints } = req.body;
    if (!waypoints || waypoints.length < 2) {
      return res.status(400).json({ success: false, error: 'At least 2 waypoints required' });
    }
    const optimized = [...waypoints].sort((a, b) => (a.lat + a.lng) - (b.lat + b.lng));
    let totalDistance = 0;
    for (let i = 0; i < optimized.length - 1; i++) {
      const R = 6371;
      const dLat = (optimized[i + 1].lat - optimized[i].lat) * Math.PI / 180;
      const dLng = (optimized[i + 1].lng - optimized[i].lng) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(optimized[i].lat * Math.PI / 180) * Math.cos(optimized[i + 1].lat * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      totalDistance += R * c;
    }
    res.json({
      success: true,
      data: { route: optimized, distance: Math.round(totalDistance * 10) / 10, duration: Math.round(totalDistance / 5 * 60) }
    });
  } catch (error) {
    console.error('Route optimization error:', error);
    res.status(500).json({ success: false, error: 'Failed to optimize route' });
  }
});

module.exports = router;