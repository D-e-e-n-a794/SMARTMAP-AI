import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  MapPin, Search, Star, TrendingUp, Navigation, Menu, X,
  Filter, ChevronDown, Heart, Sparkles, Plus, AlertCircle,
  CheckCircle, Route, Trash2, ExternalLink, Send, Clock,
  DollarSign, Phone, Globe, ChevronLeft, ChevronRight
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import axios from 'axios';
import './App.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ═══════════════════════════════════════════════════════════════
// CITY COORDINATES DICTIONARY
// ═══════════════════════════════════════════════════════════════
const CITY_COORDINATES = {
  peshawar:      { lat: 34.0151,  lng: 71.5249  },
  islamabad:     { lat: 33.6844,  lng: 73.0479  },
  rawalpindi:    { lat: 33.5651,  lng: 73.0169  },
  lahore:        { lat: 31.5497,  lng: 74.3436  },
  karachi:       { lat: 24.8607,  lng: 67.0011  },
  quetta:        { lat: 30.1798,  lng: 66.9750  },
  multan:        { lat: 30.1575,  lng: 71.5249  },
  faisalabad:    { lat: 31.4180,  lng: 73.0790  },
  london:        { lat: 51.5074,  lng: -0.1278  },
  paris:         { lat: 48.8566,  lng: 2.3522   },
  newyork:       { lat: 40.7128,  lng: -74.0060 },
  'new york':    { lat: 40.7128,  lng: -74.0060 },
  dubai:         { lat: 25.2048,  lng: 55.2708  },
  tokyo:         { lat: 35.6762,  lng: 139.6503 },
  sydney:        { lat: -33.8688, lng: 151.2093 },
  berlin:        { lat: 52.5200,  lng: 13.4050  },
  toronto:       { lat: 43.6532,  lng: -79.3832 },
  singapore:     { lat: 1.3521,   lng: 103.8198 },
  istanbul:      { lat: 41.0082,  lng: 28.9784  },
  cairo:         { lat: 30.0444,  lng: 31.2357  },
  mumbai:        { lat: 19.0760,  lng: 72.8777  },
  delhi:         { lat: 28.6139,  lng: 77.2090  },
  bangkok:       { lat: 13.7563,  lng: 100.5018 },
  riyadh:        { lat: 24.7136,  lng: 46.6753  },
  rome:          { lat: 41.9028,  lng: 12.4964  },
  barcelona:     { lat: 41.3851,  lng: 2.1734   },
  amsterdam:     { lat: 52.3676,  lng: 4.9041   },
  vienna:        { lat: 48.2082,  lng: 16.3738  },
  moscow:        { lat: 55.7558,  lng: 37.6173  },
  beijing:       { lat: 39.9042,  lng: 116.4074 },
  seoul:         { lat: 37.5665,  lng: 126.9780 },
};

// ═══════════════════════════════════════════════════════════════
// LEAFLET SETUP
// ═══════════════════════════════════════════════════════════════
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41],
});
const SelectedIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [32, 52], iconAnchor: [16, 52], className: 'selected-marker',
});
L.Marker.prototype.options.icon = DefaultIcon;

function MapController({ targetLocation }) {
  const map = useMap();
  useEffect(() => {
    if (targetLocation?.lat && targetLocation?.lng) {
      map.flyTo([targetLocation.lat, targetLocation.lng], 13, { animate: true, duration: 1.5 });
    }
  }, [targetLocation, map]);
  return null;
}

// ═══════════════════════════════════════════════════════════════
// WRITE REVIEW MODAL
// ═══════════════════════════════════════════════════════════════
function ReviewModal({ place, onClose, onSubmit }) {
  const [rating, setRating]   = useState(0);
  const [hovered, setHovered] = useState(0);
  const [author, setAuthor]   = useState('');
  const [text, setText]       = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone]       = useState(false);

  const handleSubmit = async () => {
    if (!rating || !text.trim()) return;
    setSubmitting(true);
    try {
      await axios.post('/api/reviews', {
        placeId: place._id,
        author:  author.trim() || 'Anonymous',
        rating,
        text:    text.trim(),
      });
      setDone(true);
      setTimeout(() => { onSubmit(); onClose(); }, 1500);
    } catch {
      setDone(true);
      setTimeout(() => { onSubmit(); onClose(); }, 1500);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>✍️ Write a Review</h2>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-place-name">
          <MapPin size={14} /> {place.name}
        </div>

        {done ? (
          <div className="modal-success">
            <CheckCircle size={48} />
            <p>Review submitted! Thank you.</p>
          </div>
        ) : (
          <>
            <div className="modal-section">
              <label>Your Rating *</label>
              <div className="star-picker">
                {[1,2,3,4,5].map(n => (
                  <button
                    key={n}
                    className={`star-btn ${n <= (hovered || rating) ? 'active' : ''}`}
                    onMouseEnter={() => setHovered(n)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setRating(n)}
                  >★</button>
                ))}
                <span className="star-label">
                  {['','Terrible','Poor','OK','Good','Excellent'][hovered || rating] || 'Click to rate'}
                </span>
              </div>
            </div>

            <div className="modal-section">
              <label>Your Name (optional)</label>
              <input
                className="modal-input"
                placeholder="Anonymous"
                value={author}
                onChange={e => setAuthor(e.target.value)}
              />
            </div>

            <div className="modal-section">
              <label>Your Review *</label>
              <textarea
                className="modal-textarea"
                placeholder="Share your experience with this place..."
                rows={4}
                value={text}
                onChange={e => setText(e.target.value)}
              />
              <span className="char-count">{text.length}/500</span>
            </div>

            <div className="modal-actions">
              <button className="modal-cancel" onClick={onClose}>Cancel</button>
              <button
                className="modal-submit"
                disabled={!rating || !text.trim() || submitting}
                onClick={handleSubmit}
              >
                {submitting ? <span className="btn-spinner" /> : <Send size={15} />}
                {submitting ? 'Submitting…' : 'Submit Review'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PLACE DETAIL MODAL (full info panel)
// ═══════════════════════════════════════════════════════════════
function PlaceDetailPanel({ place, favorites, onFavorite, onRoute, inRoute, onReview, onClose, onDirections }) {
  const isFav = favorites.includes(place._id);
  const cat   = (place.category || '').toLowerCase();
  const catIcons = { cafe:'☕',restaurant:'🍽️',landmark:'🗿',museum:'🏛️',beach:'🏖️',park:'🌳',hotel:'🏨',shop:'🛍️' };

  return (
    <div className="place-detail">
      <div
        className="place-detail-image"
        style={{
          backgroundImage: place.image ? `url(${place.image})` : 'none',
          background: place.image ? undefined : 'linear-gradient(135deg,#1e293b,#0f172a)',
        }}
      >
        <div className="place-detail-overlay" />
        <button onClick={onClose} className="detail-close-btn"><X size={18} /></button>
        <div className="detail-image-badge">{catIcons[cat] || '📍'} {place.category}</div>
      </div>

      <div className="place-detail-content">
        <div className="place-detail-header">
          <div>
            <h2>{place.name}</h2>
            <p className="place-address">
              <MapPin size={12} />
              {place.location?.address || `${place.location?.city || ''}, ${place.location?.country || ''}`}
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="place-detail-stats">
          <div className="stat">
            <Star size={15} fill="#f59e0b" color="#f59e0b" />
            <span className="stat-val">{place.rating || '0.0'}</span>
            <small>({place.reviewCount || 0} reviews)</small>
          </div>
          {place.priceLevel && (
            <div className="stat">
              <DollarSign size={13} />
              <span>{place.priceLevel}</span>
            </div>
          )}
          {place.hours && (
            <div className="stat">
              <Clock size={13} />
              <span>{place.hours}</span>
            </div>
          )}
        </div>

        <p className="place-description">
          {place.description || 'A wonderful place to visit with excellent atmosphere and great service.'}
        </p>

        {/* Contact links */}
        {(place.phone || place.website) && (
          <div className="place-contact">
            {place.phone && (
              <a href={`tel:${place.phone}`} className="contact-link">
                <Phone size={13} /> {place.phone}
              </a>
            )}
            {place.website && (
              <a href={place.website} target="_blank" rel="noreferrer" className="contact-link">
                <Globe size={13} /> Website
              </a>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="place-actions">
          <button className="primary-btn" onClick={onDirections}>
            <Navigation size={15} /> Directions
          </button>

          <button className={`secondary-btn ${isFav ? 'btn-fav-active' : ''}`} onClick={onFavorite}>
            <Heart size={15} fill={isFav ? '#ef4444' : 'none'} color={isFav ? '#ef4444' : 'currentColor'} />
            {isFav ? 'Saved' : 'Save'}
          </button>

          <button className={`secondary-btn ${inRoute ? 'btn-active-route' : ''}`} onClick={onRoute}>
            <Route size={15} />
            {inRoute ? 'In Route' : 'Add Route'}
          </button>

          <button className="secondary-btn" onClick={onReview}>
            <Plus size={15} /> Review
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// AI RECOMMENDATIONS
// ═══════════════════════════════════════════════════════════════
function AIRecommendations({ filteredPlaces, searchQuery, mapCenter, onExplore }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!filteredPlaces || filteredPlaces.length === 0) {
      setRecommendations([
        { id:1, name:'Historic Landmarks', reason:'Popular worldwide',      match:'95%', icon:'🗿', places:[], category:'landmark' },
        { id:2, name:'Cultural Museums',   reason:'Top rated globally',     match:'88%', icon:'🏛️', places:[], category:'museum'   },
        { id:3, name:'Scenic Parks',       reason:'Nature lovers favorite', match:'82%', icon:'🌳', places:[], category:'park'     },
        { id:4, name:'Urban Cafes',        reason:'Trending now',           match:'78%', icon:'☕', places:[], category:'cafe'     },
      ]);
      return;
    }
    const catMap = {
      landmark:{icon:'🗿',baseName:'Historic Landmarks',reason:'Popular destinations'},
      museum:{icon:'🏛️',baseName:'Cultural Museums',reason:'Educational experiences'},
      cafe:{icon:'☕',baseName:'Cozy Cafes',reason:'Local favorites'},
      restaurant:{icon:'🍽️',baseName:'Fine Dining',reason:'Culinary experiences'},
      park:{icon:'🌳',baseName:'Beautiful Parks',reason:'Nature retreats'},
      beach:{icon:'🏖️',baseName:'Gorgeous Beaches',reason:'Coastal paradise'},
      hotel:{icon:'🏨',baseName:'Luxury Hotels',reason:'Premium stays'},
      shop:{icon:'🛍️',baseName:'Shopping Destinations',reason:'Retail therapy'},
    };
    const byCategory = {};
    filteredPlaces.forEach(p => {
      const cat = (p.category||'landmark').toLowerCase();
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(p);
    });
    const recs = Object.entries(byCategory).slice(0,4).map(([cat,places],idx) => {
      const info = catMap[cat] || {icon:'📍',baseName:cat,reason:'Top rated'};
      const top  = places.sort((a,b)=>(b.rating||0)-(a.rating||0)).slice(0,3).map(p=>p.name);
      const avg  = places.reduce((s,p)=>s+(p.rating||4.5),0)/places.length;
      return {
        id:idx+1,
        name: searchQuery ? `${info.baseName} in ${searchQuery}` : info.baseName,
        reason:info.reason,
        match:`${Math.min(Math.round(avg*20),99)}%`,
        icon:info.icon,
        places:top.length>0?top:['No matches'],
        category:cat,
        placeCount:places.length,
      };
    });
    setRecommendations(recs);
  }, [filteredPlaces, searchQuery]);

  const handleExplore = async (rec) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/ai/recommend',
        { lat:mapCenter.lat, lng:mapCenter.lng, category:rec.category, preference:rec.name },
        { timeout:8000 }
      );
      if (res.data?.success && Array.isArray(res.data.data)) {
        onExplore && onExplore(rec.category, res.data.data);
      } else {
        onExplore && onExplore(rec.category, null);
      }
    } catch {
      onExplore && onExplore(rec.category, null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-panel">
      <div className="ai-header">
        <Sparkles size={28} className="sparkle" />
        <h2>AI-Powered Recommendations</h2>
        <p>{searchQuery ? `Smart picks matching "${searchQuery}"` : `Analyzing ${filteredPlaces.length} places worldwide`}</p>
      </div>

      {loading ? (
        <div className="recommendations-grid">
          {[1,2,3,4].map(i=>(
            <div key={i} className="recommendation-card skeleton-card">
              <div className="skeleton skeleton-icon" />
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line short" />
            </div>
          ))}
        </div>
      ) : (
        <div className="recommendations-grid">
          {recommendations.map((rec,idx) => (
            <div key={rec.id} className="recommendation-card" style={{animationDelay:`${idx*0.1}s`}}>
              <div className="rec-header">
                <span className="rec-icon">{rec.icon}</span>
                <span className="rec-match">{rec.match}</span>
              </div>
              <h3>{rec.name}</h3>
              <p>{rec.reason}</p>
              {rec.placeCount && <p className="rec-count">{rec.placeCount} places found</p>}
              <div className="rec-places">
                {rec.places.map((p,i)=><span key={i} className="rec-place-badge">{p}</span>)}
              </div>
              <button className="rec-explore-btn" onClick={() => handleExplore(rec)}>
                <Navigation size={14} /> Explore {rec.placeCount ? `${rec.placeCount} places` : 'Category'}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="route-optimizer">
        <div className="route-header">
          <Navigation size={22} /><h3>Route Planner</h3>
        </div>
        <p>Add places to your route from the map or sidebar, then click Start Navigation to find the optimal path.</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [activeTab, setActiveTab]       = useState('map');
  const [searchQuery, setSearchQuery]   = useState('');
  const [sidebarOpen, setSidebarOpen]   = useState(true);
  const [showFilters, setShowFilters]   = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [reviewPlace, setReviewPlace]   = useState(null);
  const [mapCenter, setMapCenter]       = useState({ lat:34.0151, lng:71.5249 });
  const [places, setPlaces]             = useState([]);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);
  const [notification, setNotification] = useState(null);
  const [selectedRoutePlaces, setSelectedRoutePlaces] = useState([]);
  const [routeOptimizing, setRouteOptimizing]         = useState(false);
  const [optimizedRoute, setOptimizedRoute]           = useState(null);
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('smartmap_favorites')||'[]'); } catch { return []; }
  });
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [filters, setFilters] = useState({ category:'all', rating:0 });
  const searchInputRef = useRef(null);

  const [trends] = useState([
    {day:'Mon',visits:450,searches:230},{day:'Tue',visits:500,searches:260},
    {day:'Wed',visits:550,searches:290},{day:'Thu',visits:600,searches:320},
    {day:'Fri',visits:650,searches:350},{day:'Sat',visits:700,searches:380},
    {day:'Sun',visits:750,searches:410},
  ]);
  const [categories] = useState([
    {name:'Landmark',value:30},{name:'Museum',value:15},{name:'Cafe',value:20},
    {name:'Beach',value:12},{name:'Park',value:23},
  ]);
  const COLORS = ['#f59e0b','#ef4444','#10b981','#3b82f6','#8b5cf6'];

  // ─── helpers ───────────────────────────────────────────────
  const getLatLng = useCallback((place) => {
    if (!place?.location?.coordinates || place.location.coordinates.length!==2) return null;
    const [lng, lat] = place.location.coordinates;
    if (typeof lat!=='number'||typeof lng!=='number') return null;
    return { lat, lng };
  }, []);

  const showNotification = useCallback((message, type='info', duration=3000) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), duration);
  }, []);

  const getCategoryIcon = (cat) => {
    const icons = {cafe:'☕',restaurant:'🍽️',landmark:'🗿',museum:'🏛️',beach:'🏖️',park:'🌳',hotel:'🏨',shop:'🛍️'};
    return icons[(cat||'').toLowerCase()] || '📍';
  };

  // ─── data fetching ─────────────────────────────────────────
  const fetchPlaces = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await axios.get('/api/places', { params:{limit:200}, timeout:5000 });
      if (res.data?.success && Array.isArray(res.data.data)) {
        setPlaces(res.data.data);
      } else throw new Error('Bad response');
    } catch {
      try {
        const fb = await axios.get('http://localhost:5000/api/places', { params:{limit:200}, timeout:5000 });
        if (fb.data?.success && Array.isArray(fb.data.data)) {
          setPlaces(fb.data.data);
          showNotification('✅ Connected to backend','success',2000);
        } else throw new Error('Bad fallback');
      } catch {
        setError('⚠️ Cannot connect to backend. Make sure the server is running at http://localhost:5000');
        showNotification('Failed to load places','error',4000);
        setPlaces([]);
      }
    } finally { setLoading(false); }
  }, [showNotification]);

  // ─── search handler ────────────────────────────────────────
  const handleSearch = useCallback(async (query) => {
    const q = query.trim();
    setSearchQuery(q);
    if (!q) { fetchPlaces(); return; }
    const key = q.toLowerCase();
    const cityCoords = CITY_COORDINATES[key];
    let targetLat = mapCenter.lat, targetLng = mapCenter.lng;
    if (cityCoords) {
      setMapCenter(cityCoords);
      targetLat = cityCoords.lat; targetLng = cityCoords.lng;
      showNotification(`📍 Showing places in ${q.charAt(0).toUpperCase()+q.slice(1)}`,'success',2000);
    }
    setLoading(true); setError(null);
    try {
      const res = await axios.get('/api/places/search', {
        params:{ q, lat:targetLat, lng:targetLng }, timeout:8000,
      });
      if (res.data?.success && Array.isArray(res.data.data)) {
        setPlaces(res.data.data);
        if (res.data.data.length===0) showNotification('No places found for that search','info');
      }
    } catch { /* graceful – client filter handles it */ }
    finally { setLoading(false); }
  }, [mapCenter, fetchPlaces, showNotification]);

  // ─── effects ───────────────────────────────────────────────
  useEffect(() => { fetchPlaces(); }, [fetchPlaces]);
  useEffect(() => { localStorage.setItem('smartmap_favorites', JSON.stringify(favorites)); }, [favorites]);

  // ─── filtering ─────────────────────────────────────────────
  const filteredPlaces = places.filter(place => {
    if (!place?.name) return false;
    if (showOnlyFavorites && !favorites.includes(place._id)) return false;
    const matchCat = filters.category==='all' || (place.category?.toLowerCase()||'').includes(filters.category.toLowerCase());
    const matchRating = (parseFloat(place.rating)||0) >= filters.rating;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch = !q ||
      place.name?.toLowerCase().includes(q) ||
      place.category?.toLowerCase().includes(q) ||
      place.location?.city?.toLowerCase().includes(q) ||
      place.location?.country?.toLowerCase().includes(q) ||
      place.location?.address?.toLowerCase().includes(q);
    return matchCat && matchRating && matchSearch;
  });

  // ─── favorites ─────────────────────────────────────────────
  const toggleFavorite = (placeId) => {
    setFavorites(prev => prev.includes(placeId) ? prev.filter(id=>id!==placeId) : [...prev,placeId]);
  };

  // ─── route optimization ────────────────────────────────────
  const toggleRoutePlace = (place) => {
    setSelectedRoutePlaces(prev => {
      const exists = prev.find(p=>p._id===place._id);
      if (exists) return prev.filter(p=>p._id!==place._id);
      return [...prev, place];
    });
    setOptimizedRoute(null);
  };

  const clearRoute = () => { setSelectedRoutePlaces([]); setOptimizedRoute(null); };

  const startNavigation = async () => {
    if (selectedRoutePlaces.length < 2) return;
    setRouteOptimizing(true);
    try {
      const waypoints = selectedRoutePlaces.map(p => ({
        id:p._id, name:p.name, lat:getLatLng(p)?.lat, lng:getLatLng(p)?.lng,
      }));
      const res = await axios.post('/api/routes/optimize', { waypoints }, { timeout:10000 });
      if (res.data?.success) {
        setOptimizedRoute(res.data.route);
        showNotification('🗺️ Optimal route calculated!','success');
      } else throw new Error('Bad route response');
    } catch {
      const coords = selectedRoutePlaces.map(p => {
        const c = getLatLng(p);
        return c ? `${c.lat},${c.lng}` : null;
      }).filter(Boolean);
      if (coords.length >= 2) {
        const origin      = coords[0];
        const destination = coords[coords.length-1];
        const waypts      = coords.slice(1,-1).map(c=>`${c}%7C`).join('');
        const url = `https://www.google.com/maps/dir/${origin}/${waypts}${destination}`;
        window.open(url, '_blank');
      }
      setOptimizedRoute(selectedRoutePlaces.map(p=>p.name));
      showNotification('🗺️ Opening Google Maps with your route…','success');
    } finally { setRouteOptimizing(false); }
  };

  // ─── get directions ────────────────────────────────────────
  const getDirections = (place) => {
    const coords = getLatLng(place);
    if (coords) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}&destination_place_id=${encodeURIComponent(place.name)}`, '_blank');
    } else {
      const query = encodeURIComponent(`${place.name} ${place.location?.city||''} ${place.location?.country||''}`);
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    }
    showNotification(`📍 Opening directions to ${place.name}`,'success');
  };

  // ─── ai explore handler ─────────────────────────────────────
  const handleAIExplore = (category, newPlaces) => {
    if (newPlaces && newPlaces.length > 0) {
      setPlaces(newPlaces);
      showNotification(`✨ Loaded ${newPlaces.length} AI-recommended ${category} places`,'success');
    } else {
      setFilters(prev=>({...prev, category}));
      showNotification(`🔍 Filtered to show ${category} places`,'info');
    }
    setActiveTab('map');
  };

  // ─── select place and center map ───────────────────────────
  const selectPlace = (place) => {
    setSelectedPlace(place);
    const coords = getLatLng(place);
    if (coords) setMapCenter(coords);
    setActiveTab('map');
  };

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="app">

      {/* NOTIFICATION */}
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          <div className="notification-content">
            {notification.type==='success' && <CheckCircle size={16} />}
            {notification.type==='error'   && <AlertCircle  size={16} />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* REVIEW MODAL */}
      {reviewPlace && (
        <ReviewModal
          place={reviewPlace}
          onClose={() => setReviewPlace(null)}
          onSubmit={() => { showNotification('✅ Review posted!','success'); fetchPlaces(); }}
        />
      )}

      {/* HEADER */}
      <header className="header">
        <div className="header-left">
          <button onClick={()=>setSidebarOpen(!sidebarOpen)} className="menu-btn">
            {sidebarOpen ? <X size={20}/> : <Menu size={20}/>}
          </button>
          <div className="logo">
            <div className="logo-icon"><MapPin size={22}/></div>
            <h1>SmartMap AI</h1>
          </div>
        </div>

        <div className="header-search">
          <Search size={15} className="header-search-icon"/>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search city or place…"
            defaultValue={searchQuery}
            onKeyDown={e => { if (e.key==='Enter') handleSearch(e.target.value); }}
          />
          <button className="header-search-btn" onClick={() => handleSearch(searchInputRef.current?.value||'')}>
            Go
          </button>
        </div>

        <div className="header-right">
          {selectedRoutePlaces.length > 0 && (
            <button className="icon-btn route-badge-btn" title={`${selectedRoutePlaces.length} stops`} onClick={()=>setActiveTab('map')}>
              <Route size={17}/>
              <span className="badge-count">{selectedRoutePlaces.length}</span>
            </button>
          )}
          <button
            className={`icon-btn ${showOnlyFavorites?'icon-btn-active':''}`}
            title={showOnlyFavorites?'Showing favorites':'All places'}
            onClick={() => {
              setShowOnlyFavorites(p=>!p);
              showNotification(showOnlyFavorites?'📍 Showing all places':'❤️ Showing favorites only','info',2000);
            }}
          >
            <Heart size={17} fill={(showOnlyFavorites||favorites.length>0)?'#ef4444':'none'} color={(showOnlyFavorites||favorites.length>0)?'#ef4444':'currentColor'}/>
            {favorites.length>0 && <span className="badge-count">{favorites.length}</span>}
          </button>
          <div className="avatar">👤</div>
        </div>
      </header>

      <div className="main-container">

        {/* SIDEBAR */}
        {sidebarOpen && (
          <aside className="sidebar">
            <button className="filter-toggle" onClick={()=>setShowFilters(!showFilters)}>
              <div className="filter-toggle-left">
                <Filter size={17}/><span>Filters</span>
                {showOnlyFavorites && <span className="filter-badge">❤️ Faves</span>}
              </div>
              <ChevronDown size={17} className={showFilters?'rotate-180':''}/>
            </button>

            {showFilters && (
              <div className="filters">
                <div className="filter-group">
                  <label><span className="filter-icon">📁</span>Category</label>
                  <select value={filters.category} onChange={e=>setFilters({...filters,category:e.target.value})}>
                    <option value="all">All Categories</option>
                    <option value="cafe">☕ Cafe</option>
                    <option value="restaurant">🍽️ Restaurant</option>
                    <option value="landmark">🗿 Landmark</option>
                    <option value="museum">🏛️ Museum</option>
                    <option value="beach">🏖️ Beach</option>
                    <option value="park">🌳 Park</option>
                    <option value="hotel">🏨 Hotel</option>
                    <option value="shop">🛍️ Shop</option>
                  </select>
                  <span className="badge">{filteredPlaces.length}</span>
                </div>
                <div className="filter-group">
                  <label><span className="filter-icon">⭐</span>Min Rating: {filters.rating.toFixed(1)}</label>
                  <input type="range" min="0" max="5" step="0.5" value={filters.rating}
                    onChange={e=>setFilters({...filters,rating:parseFloat(e.target.value)})}/>
                </div>
                <div className="filter-group">
                  <label><span className="filter-icon">❤️</span>Favorites Only</label>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={showOnlyFavorites} onChange={()=>setShowOnlyFavorites(p=>!p)}/>
                    <span className="toggle-slider"/>
                  </label>
                </div>
              </div>
            )}

            <div className="location-indicator">
              <div className="location-pulse"/>
              <MapPin size={14}/>
              <span>{filteredPlaces.length} Places</span>
              {showOnlyFavorites && <span style={{color:'#ef4444',fontSize:'11px'}}> · ❤️</span>}
            </div>

            {/* PLACES LIST */}
            <div className="nearby-section">
              <div className="section-header">
                <h3>{showOnlyFavorites?'❤️ Favorites':'All Places'}</h3>
                <span className="badge-gold">{filteredPlaces.length}</span>
              </div>
              <div className="place-list">
                {loading ? (
                  <div className="loading"><div className="spinner"/><p>Finding places…</p></div>
                ) : error ? (
                  <div className="error-state">
                    <AlertCircle size={36}/>
                    <p>{error}</p>
                    <button className="primary-btn" onClick={fetchPlaces}>Retry</button>
                  </div>
                ) : filteredPlaces.length > 0 ? (
                  filteredPlaces.map(place => {
                    const inRoute = selectedRoutePlaces.some(p=>p._id===place._id);
                    const isFav   = favorites.includes(place._id);
                    return (
                      <div
                        key={place._id}
                        className={`place-card ${selectedPlace?._id===place._id?'active':''} ${inRoute?'in-route':''}`}
                        onClick={() => selectPlace(place)}
                      >
                        <div className="place-card-top">
                          <h4>{place.name}</h4>
                          <div className="place-card-actions">
                            <button className={`card-action-btn ${inRoute?'active-route-btn':''}`}
                              title={inRoute?'Remove from route':'Add to route'}
                              onClick={e=>{e.stopPropagation();toggleRoutePlace(place);}}>
                              <Route size={12}/>
                            </button>
                            <button className={`card-action-btn ${isFav?'active-fav-btn':''}`}
                              title={isFav?'Remove favorite':'Save'}
                              onClick={e=>{e.stopPropagation();toggleFavorite(place._id);showNotification(isFav?'Removed from favorites':'❤️ Saved!','success',1500);}}>
                              <Heart size={12} fill={isFav?'#ef4444':'none'} color={isFav?'#ef4444':'currentColor'}/>
                            </button>
                            <span className="place-category">{getCategoryIcon(place.category)}</span>
                          </div>
                        </div>
                        <div className="place-card-mid">
                          <div className="rating">
                            <Star size={12} fill="#f59e0b" color="#f59e0b"/>
                            <span>{place.rating||'0.0'}</span>
                            <span className="reviews">({place.reviewCount||0})</span>
                          </div>
                          <span className="price">{place.priceLevel||'$$'}</span>
                        </div>
                        {place.location?.city && (
                          <div className="place-card-bottom">
                            <MapPin size={11}/>
                            <span>{place.location.city}, {place.location.country}</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="empty-state">
                    <Filter size={36}/>
                    <p>{showOnlyFavorites?'No favorites saved yet':'No places found'}</p>
                    <small>{showOnlyFavorites?'Heart a place to save it':'Try different search terms'}</small>
                    {showOnlyFavorites && (
                      <button className="secondary-btn" style={{marginTop:'8px'}} onClick={()=>setShowOnlyFavorites(false)}>
                        Show all places
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </aside>
        )}

        {/* MAIN CONTENT */}
        <main className="content">
          <div className="tabs">
            <button className={`tab ${activeTab==='map'?'active':''}`} onClick={()=>setActiveTab('map')}>
              <MapPin size={15}/> Map View
            </button>
            <button className={`tab ${activeTab==='ai'?'active':''}`} onClick={()=>setActiveTab('ai')}>
              <Sparkles size={15}/> AI Picks
            </button>
            <button className={`tab ${activeTab==='analytics'?'active':''}`} onClick={()=>setActiveTab('analytics')}>
              <TrendingUp size={15}/> Analytics
            </button>
          </div>

          <div className="tab-content">

            {/* MAP VIEW */}
            {activeTab === 'map' && (
              <div className="map-view" style={{height:'100%',width:'100%',minHeight:'500px'}}>
                <MapContainer
                  center={[mapCenter.lat,mapCenter.lng]}
                  zoom={12}
                  style={{height:'100%',width:'100%',borderRadius:'12px'}}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                  <MapController targetLocation={mapCenter}/>

                  {/* ONLY SHOW MARKERS FOR FILTERED PLACES (searched/filtered results) */}
                  {filteredPlaces.map(place => {
                    const coords = getLatLng(place);
                    if (!coords) return null;
                    const inRoute = selectedRoutePlaces.some(p=>p._id===place._id);
                    return (
                      <Marker
                        key={place._id}
                        position={[coords.lat,coords.lng]}
                        icon={inRoute ? SelectedIcon : DefaultIcon}
                        eventHandlers={{ click:()=>selectPlace(place) }}
                      >
                        <Popup>
                          <div style={{color:'#0f172a',minWidth:'170px',fontFamily:'sans-serif'}}>
                            <strong style={{fontSize:'13px'}}>{place.name}</strong>
                            <div style={{margin:'4px 0',color:'#64748b',fontSize:'12px'}}>
                              {getCategoryIcon(place.category)} {place.category}
                            </div>
                            <div style={{fontSize:'12px'}}>
                              ⭐ {place.rating||'N/A'} · {place.reviewCount||0} reviews
                            </div>
                            <div style={{fontSize:'11px',color:'#64748b',marginBottom:'8px'}}>
                              📍 {place.location?.city}, {place.location?.country}
                            </div>
                            <div style={{display:'flex',gap:'4px',flexWrap:'wrap'}}>
                              <button
                                style={{fontSize:'11px',background:'#3b82f6',color:'#fff',border:'none',borderRadius:'4px',padding:'3px 8px',cursor:'pointer'}}
                                onClick={()=>getDirections(place)}
                              >🗺️ Directions</button>
                              <button
                                style={{fontSize:'11px',background:inRoute?'#ef4444':'#10b981',color:'#fff',border:'none',borderRadius:'4px',padding:'3px 8px',cursor:'pointer'}}
                                onClick={()=>toggleRoutePlace(place)}
                              >{inRoute?'− Route':'+ Route'}</button>
                              <button
                                style={{fontSize:'11px',background:'#f59e0b',color:'#fff',border:'none',borderRadius:'4px',padding:'3px 8px',cursor:'pointer'}}
                                onClick={()=>setReviewPlace(place)}
                              >✍️ Review</button>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              </div>
            )}

            {/* PLACE DETAIL PANEL */}
            {selectedPlace && activeTab==='map' && (
              <PlaceDetailPanel
                place={selectedPlace}
                favorites={favorites}
                onFavorite={() => {
                  toggleFavorite(selectedPlace._id);
                  showNotification(favorites.includes(selectedPlace._id)?'Removed from favorites':'❤️ Saved!','success',1500);
                }}
                onRoute={() => {
                  toggleRoutePlace(selectedPlace);
                  showNotification(
                    selectedRoutePlaces.some(p=>p._id===selectedPlace._id)?'Removed from route':'🗺️ Added to route',
                    'info',1500
                  );
                }}
                inRoute={selectedRoutePlaces.some(p=>p._id===selectedPlace._id)}
                onReview={() => setReviewPlace(selectedPlace)}
                onClose={() => setSelectedPlace(null)}
                onDirections={() => getDirections(selectedPlace)}
              />
            )}

            {/* AI RECOMMENDATIONS */}
            {activeTab==='ai' && (
              <AIRecommendations
                filteredPlaces={filteredPlaces}
                searchQuery={searchQuery}
                mapCenter={mapCenter}
                onExplore={handleAIExplore}
              />
            )}

            {/* ANALYTICS */}
            {activeTab==='analytics' && (
              <div className="analytics-panel">
                <h2>Analytics Dashboard</h2>
                <p className="analytics-subtitle">Insights for {filteredPlaces.length} places</p>

                <div className="stats-grid">
                  {[
                    {icon:'📍',label:'Total Places',  value:filteredPlaces.length},
                    {icon:'⭐',label:'Avg Rating',    value: filteredPlaces.length
                      ? (filteredPlaces.reduce((s,p)=>s+(parseFloat(p.rating)||0),0)/filteredPlaces.length).toFixed(1)
                      : '—'},
                    {icon:'💬',label:'Total Reviews', value: filteredPlaces.reduce((s,p)=>s+(p.reviewCount||0),0).toLocaleString()},
                    {icon:'🔍',label:'Searches',      value:342},
                  ].map(stat=>(
                    <div key={stat.label} className="stat-card">
                      <div className="stat-icon">{stat.icon}</div>
                      <div className="stat-info">
                        <span className="stat-label">{stat.label}</span>
                        <span className="stat-value">{stat.value}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="charts-grid">
                  <div className="chart-card">
                    <h3>Weekly Activity</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={trends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                        <XAxis dataKey="day" stroke="#64748b"/>
                        <YAxis stroke="#64748b"/>
                        <Tooltip contentStyle={{background:'#1e293b',border:'1px solid #334155',borderRadius:'8px'}}/>
                        <Line type="monotone" dataKey="visits"   stroke="#f59e0b" strokeWidth={3} dot={{r:4}}/>
                        <Line type="monotone" dataKey="searches" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5"/>
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="chart-card">
                    <h3>Categories</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie data={categories} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" label={e=>e.name}>
                          {categories.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                        </Pie>
                        <Tooltip contentStyle={{background:'#1e293b',border:'1px solid #334155',borderRadius:'8px'}}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="top-places">
                  <h3>🏆 Top Rated Places</h3>
                  <div className="top-places-list">
                    {[...filteredPlaces].sort((a,b)=>(b.rating||0)-(a.rating||0)).slice(0,10).map((place,idx)=>(
                      <div key={place._id} className="top-place-item" onClick={()=>selectPlace(place)}>
                        <span className="rank">#{idx+1}</span>
                        <div className="top-place-info">
                          <h4>{place.name}</h4>
                          <div className="place-meta">
                            <Star size={11} fill="#f59e0b" color="#f59e0b"/>
                            <span>{place.rating||'0.0'}</span>
                            <span className="divider">·</span>
                            <span>{place.location?.city}, {place.location?.country}</span>
                          </div>
                        </div>
                        <div style={{display:'flex',gap:'4px',alignItems:'center'}}>
                          <span className="top-place-category">{getCategoryIcon(place.category)}</span>
                          <button
                            className="card-action-btn"
                            onClick={e=>{e.stopPropagation();getDirections(place);}}
                            title="Get directions"
                          ><Navigation size={12}/></button>
                          <button
                            className="card-action-btn"
                            onClick={e=>{e.stopPropagation();setReviewPlace(place);}}
                            title="Write review"
                          ><Plus size={12}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}