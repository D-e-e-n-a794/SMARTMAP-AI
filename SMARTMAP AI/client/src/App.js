import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  MapPin, Search, Star, TrendingUp, Navigation, Menu, X,
  Filter, ChevronDown, Heart, Sparkles, Plus, AlertCircle,
  CheckCircle, Route, Trash2, Send, Clock, DollarSign,
  Phone, Globe, BarChart2, Activity, Users, Award,
  RefreshCw, Zap, Target, ArrowRight, Map
} from 'lucide-react';
import {
  ResponsiveContainer, PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import axios from 'axios';
import './App.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ── ERROR BOUNDARY for Leaflet ─────────────────────────────────
class MapErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state={hasError:false}; }
  static getDerivedStateFromError(){ return{hasError:true}; }
  componentDidCatch(err){ console.warn('Map error caught:',err.message); }
  render(){
    if(this.state.hasError){
      return(
        <div style={{height:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'#141b2d',borderRadius:'12px',color:'#64748b',flexDirection:'column',gap:'12px'}}>
          <Map size={40} style={{opacity:.3}}/>
          <p style={{fontSize:'14px'}}>Map reloading…</p>
          <button onClick={()=>this.setState({hasError:false})} style={{padding:'8px 16px',background:'#f59e0b',border:'none',borderRadius:'8px',color:'#0f172a',fontWeight:700,cursor:'pointer'}}>Reload Map</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const CITY_COORDINATES = {
  peshawar:{lat:34.0151,lng:71.5249},islamabad:{lat:33.6844,lng:73.0479},
  rawalpindi:{lat:33.5651,lng:73.0169},lahore:{lat:31.5497,lng:74.3436},
  karachi:{lat:24.8607,lng:67.0011},quetta:{lat:30.1798,lng:66.9750},
  multan:{lat:30.1575,lng:71.5249},faisalabad:{lat:31.4180,lng:73.0790},
  hunza:{lat:36.3167,lng:74.6500},swat:{lat:34.7733,lng:72.3600},
  london:{lat:51.5074,lng:-0.1278},paris:{lat:48.8566,lng:2.3522},
  newyork:{lat:40.7128,lng:-74.006},'new york':{lat:40.7128,lng:-74.006},
  dubai:{lat:25.2048,lng:55.2708},tokyo:{lat:35.6762,lng:139.650},
  sydney:{lat:-33.868,lng:151.209},berlin:{lat:52.5200,lng:13.4050},
  toronto:{lat:43.6532,lng:-79.383},singapore:{lat:1.3521,lng:103.819},
  istanbul:{lat:41.0082,lng:28.9784},cairo:{lat:30.0444,lng:31.2357},
  mumbai:{lat:19.0760,lng:72.8777},delhi:{lat:28.6139,lng:77.2090},
  bangkok:{lat:13.7563,lng:100.501},riyadh:{lat:24.7136,lng:46.6753},
  rome:{lat:41.9028,lng:12.4964},barcelona:{lat:41.3851,lng:2.1734},
  amsterdam:{lat:52.3676,lng:4.9041},vienna:{lat:48.2082,lng:16.3738},
  moscow:{lat:55.7558,lng:37.6173},beijing:{lat:39.9042,lng:116.407},
  seoul:{lat:37.5665,lng:126.978},
};

// ── LEAFLET ────────────────────────────────────────────────────
const DefaultIcon = L.icon({
  iconUrl:'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl:'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize:[25,41],iconAnchor:[12,41],
});
const SelectedIcon = L.icon({
  iconUrl:'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl:'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize:[32,52],iconAnchor:[16,52],className:'selected-marker',
});
L.Marker.prototype.options.icon = DefaultIcon;

function MapController({flyTarget}){
  const map=useMap();
  useEffect(()=>{
    if(!flyTarget?.lat||!flyTarget?.lng)return;
    try{
      if(map&&map.getContainer&&map.getContainer()){
        map.flyTo([flyTarget.lat,flyTarget.lng],16,{animate:true,duration:1.0});
      }
    }catch(e){
      try{ map.setView([flyTarget.lat,flyTarget.lng],16); }catch{}
    }
  },[flyTarget,map]); // fires every time flyTarget changes including ts
  return null;
}

// ── CATEGORY META ──────────────────────────────────────────────
const CAT_META = {
  cafe:      {icon:'☕', color:'#f97316', bg:'rgba(249,115,22,0.12)',  label:'Cafes',     desc:'Coffee & tea culture'},
  restaurant:{icon:'🍽️', color:'#ef4444', bg:'rgba(239,68,68,0.12)',   label:'Dining',    desc:'Culinary experiences'},
  landmark:  {icon:'🗿', color:'#f59e0b', bg:'rgba(245,158,11,0.12)', label:'Landmarks', desc:'Iconic destinations'},
  museum:    {icon:'🏛️', color:'#8b5cf6', bg:'rgba(139,92,246,0.12)', label:'Museums',   desc:'Art & history'},
  park:      {icon:'🌳', color:'#10b981', bg:'rgba(16,185,129,0.12)', label:'Parks',     desc:'Nature & outdoors'},
  beach:     {icon:'🏖️', color:'#06b6d4', bg:'rgba(6,182,212,0.12)',  label:'Beaches',   desc:'Coastal paradise'},
  hotel:     {icon:'🏨', color:'#3b82f6', bg:'rgba(59,130,246,0.12)', label:'Hotels',    desc:'Stays & resorts'},
  shop:      {icon:'🛍️', color:'#ec4899', bg:'rgba(236,72,153,0.12)', label:'Shopping',  desc:'Markets & boutiques'},
};
const CAT_ICONS = {cafe:'☕',restaurant:'🍽️',landmark:'🗿',museum:'🏛️',beach:'🏖️',park:'🌳',hotel:'🏨',shop:'🛍️'};
const PIE_COLORS=['#f59e0b','#ef4444','#10b981','#3b82f6','#8b5cf6','#f97316','#06b6d4','#ec4899'];

// ══════════════════════════════════════════════════════════════
// REVIEW MODAL
// ══════════════════════════════════════════════════════════════
function ReviewModal({place,onClose,onSubmit}){
  const [rating,setRating]=useState(0);
  const [hovered,setHovered]=useState(0);
  const [author,setAuthor]=useState('');
  const [text,setText]=useState('');
  const [submitting,setSub]=useState(false);
  const [done,setDone]=useState(false);
  const handleSubmit=async()=>{
    if(!rating||!text.trim())return;
    setSub(true);
    try{await axios.post('/api/reviews',{placeId:place._id,author:author.trim()||'Anonymous',rating,text:text.trim()});}catch{}
    setDone(true);setTimeout(()=>{onSubmit();onClose();},1500);setSub(false);
  };
  return(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-header"><h2>✍️ Write a Review</h2><button className="modal-close" onClick={onClose}><X size={20}/></button></div>
        <div className="modal-place-name"><MapPin size={14}/> {place.name}</div>
        {done?(<div className="modal-success"><CheckCircle size={48}/><p>Review submitted! Thank you.</p></div>):(
          <>
            <div className="modal-section">
              <label>Your Rating *</label>
              <div className="star-picker">
                {[1,2,3,4,5].map(n=>(<button key={n} className={`star-btn ${n<=(hovered||rating)?'active':''}`} onMouseEnter={()=>setHovered(n)} onMouseLeave={()=>setHovered(0)} onClick={()=>setRating(n)}>★</button>))}
                <span className="star-label">{['','Terrible','Poor','OK','Good','Excellent'][hovered||rating]||'Click to rate'}</span>
              </div>
            </div>
            <div className="modal-section"><label>Your Name (optional)</label><input className="modal-input" placeholder="Anonymous" value={author} onChange={e=>setAuthor(e.target.value)}/></div>
            <div className="modal-section"><label>Your Review *</label><textarea className="modal-textarea" rows={4} placeholder="Share your experience…" value={text} onChange={e=>setText(e.target.value)}/><span className="char-count">{text.length}/500</span></div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={onClose}>Cancel</button>
              <button className="modal-submit" disabled={!rating||!text.trim()||submitting} onClick={handleSubmit}>
                {submitting?<span className="btn-spinner"/>:<Send size={15}/>}{submitting?'Submitting…':'Submit Review'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PLACE DETAIL PANEL — REDESIGNED
// ══════════════════════════════════════════════════════════════
function PlaceDetailPanel({place,favorites,onFavorite,onRoute,inRoute,onReview,onClose,onDirections}){
  const isFav=favorites.includes(place._id);
  const cat=(place.category||'').toLowerCase();
  const meta=CAT_META[cat]||{icon:'📍',color:'#64748b',bg:'rgba(100,116,139,0.1)'};
  return(
    <div className="place-detail-pro">
      {/* Hero banner */}
      <div className="pdp-hero" style={{background:`linear-gradient(135deg, ${meta.color}22, #0f172a)`}}>
        <div className="pdp-hero-accent" style={{background:meta.color}}/>
        <button onClick={onClose} className="pdp-close"><X size={16}/></button>
        <div className="pdp-cat-badge" style={{background:meta.bg,border:`1px solid ${meta.color}44`,color:meta.color}}>
          {meta.icon} {place.category}
        </div>
        <h2 className="pdp-name">{place.name}</h2>
        <p className="pdp-addr"><MapPin size={11}/> {place.location?.address||`${place.location?.city||''}, ${place.location?.country||''}`}</p>
      </div>

      {/* Stats strip */}
      <div className="pdp-stats">
        <div className="pdp-stat">
          <Star size={14} fill="#f59e0b" color="#f59e0b"/>
          <strong>{place.rating||'—'}</strong>
          <span>({place.reviewCount||0} reviews)</span>
        </div>
        {place.priceLevel&&<div className="pdp-stat"><DollarSign size={13}/><span>{place.priceLevel}</span></div>}
        {place.hours&&<div className="pdp-stat"><Clock size={13}/><span>{place.hours}</span></div>}
      </div>

      {/* Description */}
      <p className="pdp-desc">{place.description||'A wonderful place to visit with excellent atmosphere and great service.'}</p>

      {/* Contact */}
      {(place.phone||place.website)&&(
        <div className="pdp-contact">
          {place.phone&&<a href={`tel:${place.phone}`} className="pdp-contact-link"><Phone size={12}/>{place.phone}</a>}
          {place.website&&<a href={place.website} target="_blank" rel="noreferrer" className="pdp-contact-link"><Globe size={12}/>Website</a>}
        </div>
      )}

      {/* Action buttons */}
      <div className="pdp-actions">
        <button className="pdp-btn-primary" onClick={onDirections} style={{background:meta.color}}>
          <Navigation size={14}/> Directions
        </button>
        <button className={`pdp-btn-ghost ${isFav?'pdp-btn-fav':''}`} onClick={onFavorite}>
          <Heart size={14} fill={isFav?'#ef4444':'none'} color={isFav?'#ef4444':'currentColor'}/>
          {isFav?'Saved':'Save'}
        </button>
        <button className={`pdp-btn-ghost ${inRoute?'pdp-btn-route':''}`} onClick={onRoute}>
          <Route size={14}/>{inRoute?'In Route':'+ Route'}
        </button>
        <button className="pdp-btn-ghost" onClick={onReview}>
          <Plus size={14}/> Review
        </button>
      </div>
    </div>
  );
}




// ══════════════════════════════════════════════════════════════
// AI PICKS TAB — FULLY REDESIGNED
// ══════════════════════════════════════════════════════════════
function AIPicksTab({filteredPlaces,searchQuery,mapCenter,onExplore}){
  const [activeCategory,setActiveCategory]=useState(null);
  const [loadingCat,setLoadingCat]=useState(null);
  const [selectedPlace,setSelectedPlace]=useState(null);

  // Build category breakdown from real data
  const catBreakdown=Object.entries(
    filteredPlaces.reduce((acc,p)=>{
      const k=(p.category||'landmark').toLowerCase();
      if(!acc[k])acc[k]={count:0,totalRating:0,places:[]};
      acc[k].count++;acc[k].totalRating+=(parseFloat(p.rating)||0);acc[k].places.push(p);
      return acc;
    },{})
  ).map(([key,val])=>({
    key,meta:CAT_META[key]||{icon:'📍',color:'#64748b',bg:'rgba(100,116,139,0.1)',label:key,desc:''},
    count:val.count,
    avgRating:val.count?(val.totalRating/val.count).toFixed(1):0,
    topPlaces:val.places.sort((a,b)=>(b.rating||0)-(a.rating||0)).slice(0,5),
  })).sort((a,b)=>b.count-a.count);

  const activeData=catBreakdown.find(c=>c.key===activeCategory)||catBreakdown[0];

  const handleExplore=async(cat)=>{
    setLoadingCat(cat.key);
    try{
      const res=await axios.post('/api/ai/recommend',{lat:mapCenter.lat,lng:mapCenter.lng,category:cat.key},{timeout:8000});
      if(res.data?.success&&Array.isArray(res.data.data)&&res.data.data.length>0){
        onExplore&&onExplore(cat.key,res.data.data,null);
      }else{
        onExplore&&onExplore(cat.key,null,null);
      }
    }catch{onExplore&&onExplore(cat.key,null,null);}
    finally{setLoadingCat(null);}
  };

  // Navigate to a specific place on the map
  const goToPlace=(place)=>{
    onExplore&&onExplore((place.category||'').toLowerCase(),null,place);
  };

  // Top picks across all categories
  const topPicks=[...filteredPlaces].sort((a,b)=>(b.rating||0)-(a.rating||0)).slice(0,8);

  return(
    <div className="aipicks-container">
      {/* Header */}
      <div className="aipicks-header">
        <div className="aipicks-header-left">
          <div className="aipicks-badge"><Zap size={12}/>AI Powered</div>
          <h2>Smart Recommendations</h2>
          <p>{searchQuery?`Results for "${searchQuery}"`:`${filteredPlaces.length} places · ${catBreakdown.length} categories`}</p>
        </div>
        <div className="aipicks-header-right">
          <div className="aipicks-pulse-dot"/>
          <span>Live Data</span>
        </div>
      </div>

      {/* Category selector grid */}
      <div className="aipicks-cats">
        {catBreakdown.slice(0,8).map((cat,i)=>(
          <button key={cat.key}
            className={`aipicks-cat-btn ${activeCategory===cat.key?'aipicks-cat-active':''}`}
            style={{'--cc':cat.meta.color,'--cb':cat.meta.bg,animationDelay:`${i*0.05}s`}}
            onClick={()=>setActiveCategory(activeCategory===cat.key?null:cat.key)}
          >
            <span className="aipicks-cat-icon">{cat.meta.icon}</span>
            <span className="aipicks-cat-label">{cat.meta.label}</span>
            <span className="aipicks-cat-count">{cat.count}</span>
            <div className="aipicks-cat-bar">
              <div style={{width:`${Math.min((cat.count/Math.max(...catBreakdown.map(c=>c.count)))*100,100)}%`,background:cat.meta.color,height:'100%',borderRadius:'999px',transition:'width 0.6s ease'}}/>
            </div>
          </button>
        ))}
      </div>

      {/* Active category detail */}
      {activeData&&(
        <div className="aipicks-detail" style={{'--cc':activeData.meta.color}}>
          <div className="aipicks-detail-header">
            <div className="aipicks-detail-title">
              <span className="aipicks-detail-icon">{activeData.meta.icon}</span>
              <div>
                <h3>{activeData.meta.label}</h3>
                <p>{activeData.meta.desc} · {activeData.count} places · ⭐ {activeData.avgRating} avg</p>
              </div>
            </div>
            <button className="aipicks-explore-btn"
              onClick={()=>handleExplore(activeData)}
              disabled={loadingCat===activeData.key}
              style={{background:activeData.meta.color}}
            >
              {loadingCat===activeData.key?<><span className="btn-spinner-sm"/>Loading…</>:<><ArrowRight size={13}/>Explore All</>}
            </button>
          </div>

          {/* Top 5 in this category */}
          <div className="aipicks-place-list">
            {activeData.topPlaces.map((p,i)=>(
              <div key={p._id} className={`aipicks-place-row ${selectedPlace?._id===p._id?'aipicks-place-selected':''}`}
                onClick={()=>setSelectedPlace(selectedPlace?._id===p._id?null:p)}>
                <span className="aipicks-place-rank" style={{color:activeData.meta.color}}>#{i+1}</span>
                <div className="aipicks-place-info">
                  <span className="aipicks-place-name">{p.name}</span>
                  <span className="aipicks-place-loc"><MapPin size={10}/>{p.location?.city}, {p.location?.country}</span>
                </div>
                <div className="aipicks-place-right">
                  <span className="aipicks-place-rating">⭐ {p.rating||'—'}</span>
                  <button className="aipicks-go-btn" style={{background:activeData.meta.color}}
                    onClick={e=>{e.stopPropagation();goToPlace(p);}}>
                    Go
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Expanded place details */}
          {selectedPlace&&(
            <div className="aipicks-expanded" style={{borderColor:`${activeData.meta.color}44`}}>
              <p className="aipicks-expanded-desc">{selectedPlace.description||'A wonderful place to visit.'}</p>
              <div className="aipicks-expanded-actions">
                <button className="aipicks-action-btn" style={{background:activeData.meta.color}}
                  onClick={()=>goToPlace(selectedPlace)}>
                  <Navigation size={12}/> View on Map
                </button>
                {selectedPlace.priceLevel&&<span className="aipicks-price-chip">{selectedPlace.priceLevel}</span>}
                <span className="aipicks-review-chip">💬 {selectedPlace.reviewCount||0} reviews</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Top Picks globally */}
      <div className="aipicks-top-section">
        <div className="aipicks-section-label">
          <Target size={14}/> Best Rated Right Now
        </div>
        <div className="aipicks-top-grid">
          {topPicks.map((p,i)=>{
            const m=CAT_META[(p.category||'').toLowerCase()]||{icon:'📍',color:'#64748b',bg:'rgba(100,116,139,0.1)'};
            return(
              <div key={p._id} className="aipicks-top-card" style={{'--mc':m.color,'--mb':m.bg}}>
                <div className="aipicks-top-card-header">
                  <span className="aipicks-top-icon">{m.icon}</span>
                  <span className="aipicks-top-rating">⭐ {p.rating||'—'}</span>
                </div>
                <h4 className="aipicks-top-name">{p.name}</h4>
                <p className="aipicks-top-loc"><MapPin size={9}/>{p.location?.city}</p>
                <button className="aipicks-top-btn" style={{background:m.color}}
                  onClick={()=>goToPlace(p)}>
                  Explore
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// ANALYTICS TAB
// ══════════════════════════════════════════════════════════════
function AnalyticsTab({filteredPlaces,onSelectPlace}){
  const [animReady,setAnimReady]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setAnimReady(true),100);return()=>clearTimeout(t);},[]);

  const totalPlaces=filteredPlaces.length;
  const avgRating=totalPlaces?(filteredPlaces.reduce((s,p)=>s+(parseFloat(p.rating)||0),0)/totalPlaces):0;
  const totalReviews=filteredPlaces.reduce((s,p)=>s+(p.reviewCount||0),0);
  const topRating=totalPlaces?Math.max(...filteredPlaces.map(p=>parseFloat(p.rating)||0)):0;
  const top10=[...filteredPlaces].sort((a,b)=>(b.rating||0)-(a.rating||0)).slice(0,10);

  const catMap=filteredPlaces.reduce((acc,p)=>{
    const k=(p.category||'other').toLowerCase();
    if(!acc[k])acc[k]={count:0,totalRating:0,totalReviews:0};
    acc[k].count++;acc[k].totalRating+=(parseFloat(p.rating)||0);acc[k].totalReviews+=(p.reviewCount||0);
    return acc;
  },{});
  const categoryData=Object.entries(catMap).map(([name,d])=>({name:name.charAt(0).toUpperCase()+name.slice(1),key:name,count:d.count,avgRating:d.count?parseFloat((d.totalRating/d.count).toFixed(1)):0,reviews:d.totalReviews})).sort((a,b)=>b.count-a.count);

  const countryMap=filteredPlaces.reduce((acc,p)=>{const k=p.location?.country||'Unknown';acc[k]=(acc[k]||0)+1;return acc;},{});
  const countryData=Object.entries(countryMap).map(([name,count])=>({name,count})).sort((a,b)=>b.count-a.count).slice(0,8);

  const ratingBuckets=[
    {label:'5 ★',min:4.8,max:5.1,color:'#10b981'},
    {label:'4–5 ★',min:4.0,max:4.8,color:'#3b82f6'},
    {label:'3–4 ★',min:3.0,max:4.0,color:'#f59e0b'},
    {label:'< 3 ★',min:0,max:3.0,color:'#ef4444'},
  ].map(b=>({...b,count:filteredPlaces.filter(p=>{const r=parseFloat(p.rating)||0;return r>=b.min&&r<b.max;}).length}));
  const maxBucket=Math.max(...ratingBuckets.map(b=>b.count),1);

  const priceMap=filteredPlaces.reduce((acc,p)=>{const k=p.priceLevel||'$$';acc[k]=(acc[k]||0)+1;return acc;},{});
  const priceData=Object.entries(priceMap).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value);

  const CustomTooltip=({active,payload,label})=>{
    if(!active||!payload?.length)return null;
    return(<div style={{background:'#1e293b',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'10px',padding:'10px 14px',fontSize:'12px',color:'#e2e8f0',boxShadow:'0 8px 24px rgba(0,0,0,0.4)'}}>
      {label&&<p style={{fontWeight:700,marginBottom:4,color:'#f59e0b'}}>{label}</p>}
      {payload.map((p,i)=>(<p key={i} style={{color:p.color||'#94a3b8',margin:'2px 0'}}>{p.name}: <strong style={{color:'#e2e8f0'}}>{typeof p.value==='number'&&p.value%1!==0?p.value.toFixed(1):p.value?.toLocaleString?.()}</strong></p>))}
    </div>);
  };

  if(totalPlaces===0)return(<div className="analytics-empty"><BarChart2 size={52}/><h3>No data yet</h3><p>Search for a city or category to see live analytics</p></div>);

  return(
    <div className="analytics-pro">
      <div className="analytics-pro-header">
        <div><h2>Analytics Dashboard</h2><p className="analytics-pro-sub">Live insights from <strong>{totalPlaces}</strong> places</p></div>
        <button className="refresh-btn" onClick={()=>setAnimReady(false)||setTimeout(()=>setAnimReady(true),100)}><RefreshCw size={15}/></button>
      </div>
      <div className="kpi-grid">
        {[
          {icon:<MapPin size={20}/>,label:'Total Places',value:totalPlaces.toLocaleString(),color:'#f59e0b',sub:`${categoryData.length} categories`},
          {icon:<Star size={20}/>,label:'Average Rating',value:avgRating.toFixed(2),color:'#10b981',sub:`Best: ${topRating.toFixed(1)} ★`},
          {icon:<Users size={20}/>,label:'Total Reviews',value:totalReviews.toLocaleString(),color:'#3b82f6',sub:'Across all places'},
          {icon:<Award size={20}/>,label:'Top Rated',value:top10[0]?.name?.split(' ').slice(0,2).join(' ')||'—',color:'#8b5cf6',sub:`${top10[0]?.rating||'—'} ★`},
        ].map((k,i)=>(
          <div key={k.label} className="kpi-card-pro" style={{'--kc':k.color,animationDelay:`${i*0.08}s`}}>
            <div className="kpi-icon-pro">{k.icon}</div>
            <div className="kpi-body-pro"><span className="kpi-label-pro">{k.label}</span><span className="kpi-value-pro">{k.value}</span><span className="kpi-sub-pro">{k.sub}</span></div>
          </div>
        ))}
      </div>
      <div className="analytics-row">
        <div className="an-card an-card-wide">
          <div className="an-card-header"><h3><BarChart2 size={15}/> Places by Category</h3><span className="an-badge">{categoryData.length} types</span></div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryData} margin={{top:5,right:10,left:-15,bottom:5}}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
              <XAxis dataKey="name" stroke="#475569" tick={{fontSize:11}}/>
              <YAxis stroke="#475569" tick={{fontSize:11}}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Bar dataKey="count" radius={[5,5,0,0]} name="Places">{categoryData.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="an-card an-card-narrow">
          <div className="an-card-header"><h3><Activity size={15}/> Distribution</h3></div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart><Pie data={categoryData} cx="50%" cy="50%" innerRadius={42} outerRadius={70} paddingAngle={3} dataKey="count">{categoryData.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}</Pie><Tooltip contentStyle={{background:'#1e293b',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'8px',fontSize:'12px'}} formatter={(v,n)=>[`${v} places`,n]}/></PieChart>
          </ResponsiveContainer>
          <div className="pie-legend-pro">{categoryData.slice(0,6).map((c,i)=>(<div key={c.name} className="pie-legend-row"><span className="pie-dot-pro" style={{background:PIE_COLORS[i%PIE_COLORS.length]}}/><span className="pie-name-pro">{CAT_ICONS[c.key]||'📍'} {c.name}</span><span className="pie-val-pro">{c.count}</span></div>))}</div>
        </div>
      </div>
      <div className="analytics-row">
        <div className="an-card">
          <div className="an-card-header"><h3><Star size={15}/> Rating Distribution</h3></div>
          <div className="rating-dist-pro">{ratingBuckets.map(b=>(<div key={b.label} className="rd-row"><span className="rd-label">{b.label}</span><div className="rd-bar-bg"><div className="rd-bar-fill" style={{width:`${animReady?(b.count/maxBucket)*100:0}%`,background:b.color}}/></div><span className="rd-count">{b.count}</span></div>))}</div>
          <div className="rating-big-row"><div className="rating-big-num">{avgRating.toFixed(1)}</div><div><div className="rating-stars-row">{[1,2,3,4,5].map(n=>(<span key={n} style={{color:n<=Math.round(avgRating)?'#f59e0b':'#1e293b',fontSize:'20px'}}>★</span>))}</div><p className="rating-based-on">Based on {totalReviews.toLocaleString()} reviews</p></div></div>
        </div>
        <div className="an-card">
          <div className="an-card-header"><h3><Zap size={15}/> Avg Rating by Category</h3></div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryData} layout="vertical" margin={{top:0,right:30,left:10,bottom:0}}>
              <XAxis type="number" domain={[0,5]} stroke="#475569" tick={{fontSize:10}}/><YAxis type="category" dataKey="name" stroke="#475569" tick={{fontSize:11}} width={75}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Bar dataKey="avgRating" radius={[0,5,5,0]} name="Avg Rating">{categoryData.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="an-card">
          <div className="an-card-header"><h3><MapPin size={15}/> Top Countries</h3><span className="an-badge">{Object.keys(countryMap).length} total</span></div>
          <div className="country-list">{countryData.map((c,i)=>(<div key={c.name} className="country-row"><span className="country-rank">{i+1}</span><span className="country-name">{c.name}</span><div className="country-bar-bg"><div className="country-bar-fill" style={{width:`${animReady?(c.count/countryData[0].count)*100:0}%`,background:PIE_COLORS[i%PIE_COLORS.length]}}/></div><span className="country-count">{c.count}</span></div>))}</div>
        </div>
      </div>
      <div className="analytics-row">
        <div className="an-card an-card-narrow">
          <div className="an-card-header"><h3><DollarSign size={15}/> Price Levels</h3></div>
          <ResponsiveContainer width="100%" height={150}><PieChart><Pie data={priceData} cx="50%" cy="50%" innerRadius={38} outerRadius={65} paddingAngle={4} dataKey="value">{priceData.map((_,i)=><Cell key={i} fill={['#10b981','#3b82f6','#f59e0b','#ef4444'][i%4]}/>)}</Pie><Tooltip contentStyle={{background:'#1e293b',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'8px',fontSize:'12px'}} formatter={(v,n)=>[`${v} places`,n]}/></PieChart></ResponsiveContainer>
          <div className="pie-legend-pro" style={{marginTop:0}}>{priceData.map((p,i)=>(<div key={p.name} className="pie-legend-row"><span className="pie-dot-pro" style={{background:['#10b981','#3b82f6','#f59e0b','#ef4444'][i%4]}}/><span className="pie-name-pro">{p.name}</span><span className="pie-val-pro">{p.value}</span></div>))}</div>
        </div>
        <div className="an-card an-card-wide">
          <div className="an-card-header"><h3><Award size={15}/> Top 10 Rated Places</h3><span className="an-badge">click to view</span></div>
          <div className="top-table-pro">
            <div className="top-table-head-pro"><span>#</span><span>Place</span><span>Category</span><span>City</span><span>Rating</span><span>Reviews</span></div>
            {top10.map((place,idx)=>{const meta=CAT_ICONS[(place.category||'').toLowerCase()]||'📍';return(
              <div key={place._id} className="top-table-row-pro" onClick={()=>onSelectPlace(place)}>
                <span className="tt-rank-pro" style={{color:idx<3?['#f59e0b','#94a3b8','#cd7f32'][idx]:'#475569'}}>{idx<3?['🥇','🥈','🥉'][idx]:`${idx+1}`}</span>
                <span className="tt-name-pro">{place.name}</span>
                <span className="tt-cat-pro">{meta} {place.category}</span>
                <span className="tt-city-pro"><MapPin size={10}/>{place.location?.city||'—'}</span>
                <span className="tt-rating-pro"><Star size={11} fill="#f59e0b" color="#f59e0b"/> <strong>{place.rating||'—'}</strong></span>
                <span className="tt-rev-pro">{(place.reviewCount||0).toLocaleString()}</span>
              </div>
            );})}
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════
export default function App(){
  const [activeTab,setActiveTab]=useState('map');
  const [searchQuery,setSearchQuery]=useState('');
  const [sidebarOpen,setSidebarOpen]=useState(true);
  const [showFilters,setShowFilters]=useState(false);
  const [selectedPlace,setSelectedPlace]=useState(null);
  const [reviewPlace,setReviewPlace]=useState(null);
  const [mapCenter,setMapCenter]=useState({lat:34.0151,lng:71.5249});
  const [flyTarget,setFlyTarget]=useState(null); // separate from mapCenter so flyTo always fires
  const [places,setPlaces]=useState([]);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);
  const [notification,setNotification]=useState(null);
  const [selectedRoutePlaces,setSelectedRoutePlaces]=useState([]);
  const [routeOptimizing,setRouteOptimizing]=useState(false);
  const [optimizedRoute,setOptimizedRoute]=useState(null);
  const [favorites,setFavorites]=useState(()=>{try{return JSON.parse(localStorage.getItem('smartmap_favorites')||'[]');}catch{return[];}});
  const [showOnlyFavorites,setShowOnlyFavorites]=useState(false);
  const [filters,setFilters]=useState({category:'all',rating:0});
  const [hasSearched,setHasSearched]=useState(false);
  const searchInputRef=useRef(null);

  const getLatLng=useCallback((place)=>{
    if(!place?.location?.coordinates||place.location.coordinates.length!==2)return null;
    const[lng,lat]=place.location.coordinates;
    if(typeof lat!=='number'||typeof lng!=='number')return null;
    return{lat,lng};
  },[]);

  const showNotification=useCallback((message,type='info',duration=3000)=>{
    setNotification({message,type});
    setTimeout(()=>setNotification(null),duration);
  },[]);

  const getCategoryIcon=(cat)=>{
    return CAT_ICONS[(cat||'').toLowerCase()]||'📍';
  };

  const fetchPlaces=useCallback(async()=>{
    setLoading(true);setError(null);
    try{
      const res=await axios.get('/api/places',{params:{limit:2000},timeout:8000});
      if(res.data?.success&&Array.isArray(res.data.data)){setPlaces(res.data.data);}
      else throw new Error();
    }catch{
      try{
       const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const fb = await axios.get(`${API_BASE}/api/places`, { params:{limit:200}, timeout:5000 });

const fb = await axios.get(`${API_BASE}/api/places`, { params:{limit:200}, timeout:5000 });
        if(fb.data?.success&&Array.isArray(fb.data.data)){setPlaces(fb.data.data);showNotification('✅ Connected to backend','success',2000);}
        else throw new Error();
      }catch{
        setError('⚠️ Cannot connect to backend at http://localhost:5000');
        showNotification('Failed to load places','error',4000);
        setPlaces([]);
      }
    }finally{setLoading(false);}
  },[showNotification]);

  const handleSearch=useCallback(async(query)=>{
    const q=query.trim();
    setSearchQuery(q);
    if(!q){setHasSearched(false);fetchPlaces();setSelectedPlace(null);return;}
    setHasSearched(true);
    const cityCoords=CITY_COORDINATES[q.toLowerCase()];
    let lat=mapCenter.lat,lng=mapCenter.lng;
    if(cityCoords){
      setMapCenter(cityCoords);
      setFlyTarget({lat:cityCoords.lat,lng:cityCoords.lng,ts:Date.now()});
      lat=cityCoords.lat;lng=cityCoords.lng;
      showNotification(`📍 ${q.charAt(0).toUpperCase()+q.slice(1)}`,'success',2000);
    }
    setLoading(true);setError(null);
    try{
      const res=await axios.get('/api/places/search',{params:{q,lat,lng},timeout:8000});
      if(res.data?.success&&Array.isArray(res.data.data)){
        setPlaces(res.data.data);
        if(!res.data.data.length)showNotification('No places found','info');
        else showNotification(`Found ${res.data.data.length} places`,'success',2000);
      }
    }catch{}
    finally{setLoading(false);}
  },[mapCenter,fetchPlaces,showNotification]);

  useEffect(()=>{fetchPlaces();},[fetchPlaces]);
  useEffect(()=>{localStorage.setItem('smartmap_favorites',JSON.stringify(favorites));},[favorites]);

  const filteredPlaces=places.filter(place=>{
    if(!place?.name)return false;
    // If only one place in array (AI pick), always show it regardless of filters
    if(places.length===1)return true;
    if(showOnlyFavorites&&!favorites.includes(place._id))return false;
    const matchCat=filters.category==='all'||(place.category?.toLowerCase()||'').includes(filters.category.toLowerCase());
    const matchRating=(parseFloat(place.rating)||0)>=filters.rating;
    const q=searchQuery.toLowerCase().trim();
    const matchSearch=!q||place.name?.toLowerCase().includes(q)||place.category?.toLowerCase().includes(q)||place.location?.city?.toLowerCase().includes(q)||place.location?.country?.toLowerCase().includes(q)||place.location?.address?.toLowerCase().includes(q);
    return matchCat&&matchRating&&matchSearch;
  });

  // Show markers when: user searched, filters active, favorites, or places were explicitly set by AI picks
  const showMarkers=hasSearched||filters.category!=='all'||filters.rating>0||showOnlyFavorites||places.length===1;

  const toggleFavorite=(id)=>setFavorites(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
  const toggleRoutePlace=(place)=>{setSelectedRoutePlaces(prev=>{const e=prev.find(p=>p._id===place._id);return e?prev.filter(p=>p._id!==place._id):[...prev,place]});setOptimizedRoute(null);};
  const clearRoute=()=>{setSelectedRoutePlaces([]);setOptimizedRoute(null);};

  const startNavigation=async()=>{
    if(selectedRoutePlaces.length<2)return;
    setRouteOptimizing(true);
    try{
      const res=await axios.post('/api/routes/optimize',{waypoints:selectedRoutePlaces.map(p=>({id:p._id,name:p.name,lat:getLatLng(p)?.lat,lng:getLatLng(p)?.lng}))},{timeout:10000});
      if(res.data?.success){setOptimizedRoute(res.data.route);showNotification('🗺️ Route ready!','success');}
      else throw new Error();
    }catch{
      const coords=selectedRoutePlaces.map(p=>{const c=getLatLng(p);return c?`${c.lat},${c.lng}`:null;}).filter(Boolean);
      if(coords.length>=2)window.open(`https://www.google.com/maps/dir/${coords[0]}/${coords.slice(1,-1).join('/')}/${coords[coords.length-1]}`,'_blank');
      setOptimizedRoute(selectedRoutePlaces.map(p=>p.name));
      showNotification('🗺️ Opened in Google Maps','success');
    }finally{setRouteOptimizing(false);}
  };

  const getDirections=(place)=>{
    const c=getLatLng(place);
    if(c)window.open(`https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}`,'_blank');
    else window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name+' '+(place.location?.city||''))}`,'_blank');
    showNotification(`📍 Directions to ${place.name}`,'success');
  };

  const handleAIExplore=(category,newPlaces,specificPlace)=>{
    // ✅ Go / single place: show ONLY this one marker and fly to it
    if(specificPlace){
      const c=getLatLng(specificPlace);
      setPlaces([specificPlace]);
      setSelectedPlace(specificPlace);
      setHasSearched(true);
      setSearchQuery(specificPlace.name);
      if(searchInputRef.current) searchInputRef.current.value=specificPlace.name;
      if(c){ setMapCenter(c); setFlyTarget({lat:c.lat,lng:c.lng,ts:Date.now()}); }
      showNotification(`📍 ${specificPlace.name}`,'success',2000);
      setActiveTab('map');
      return;
    }
    // Explore All category
    if(newPlaces?.length>0){
      setPlaces(newPlaces);
      const first=newPlaces[0];
      const c=getLatLng(first);
      if(c){ setMapCenter(c); setFlyTarget({lat:c.lat,lng:c.lng,ts:Date.now()}); }
      setSelectedPlace(null);
      showNotification(`✨ ${newPlaces.length} ${category} places loaded`,'success');
    }else{
      setFilters(prev=>({...prev,category}));
      setSelectedPlace(null);
      showNotification(`🔍 Showing ${category} places`,'info');
    }
    setHasSearched(true);
    setActiveTab('map');
  };

  const selectPlace=(place)=>{
    setSelectedPlace(place);
    setHasSearched(true); // ✅ ensure marker shows
    const c=getLatLng(place);
    if(c){
      setMapCenter(c);
      setFlyTarget({lat:c.lat,lng:c.lng,ts:Date.now()});
    }
    setActiveTab('map');
  };

  return(
    <div className="app">
      {notification&&(
        <div className={`notification notification-${notification.type}`}>
          <div className="notification-content">
            {notification.type==='success'&&<CheckCircle size={15}/>}
            {notification.type==='error'&&<AlertCircle size={15}/>}
            <span>{notification.message}</span>
          </div>
        </div>
      )}
      {reviewPlace&&(
        <ReviewModal place={reviewPlace} onClose={()=>setReviewPlace(null)}
          onSubmit={()=>{showNotification('✅ Review posted!','success');fetchPlaces();}}/>
      )}

      {/* HEADER */}
      <header className="header">
        <div className="header-left">
          <button onClick={()=>setSidebarOpen(!sidebarOpen)} className="menu-btn">{sidebarOpen?<X size={20}/>:<Menu size={20}/>}</button>
          <div className="logo"><div className="logo-icon"><MapPin size={22}/></div><h1>SmartMap AI</h1></div>
        </div>
        <div className="header-search">
          <Search size={15} className="header-search-icon"/>
          <input ref={searchInputRef} type="text" placeholder="Search city, place, or category…"
            defaultValue={searchQuery} onKeyDown={e=>{if(e.key==='Enter')handleSearch(e.target.value);}}/>
          <button className="header-search-btn" onClick={()=>handleSearch(searchInputRef.current?.value||'')}>Go</button>
        </div>
        <div className="header-right">
          {selectedRoutePlaces.length>0&&(
            <button className="icon-btn route-badge-btn" onClick={()=>setActiveTab('map')}>
              <Route size={17}/><span className="badge-count">{selectedRoutePlaces.length}</span>
            </button>
          )}
          <button className={`icon-btn ${showOnlyFavorites?'icon-btn-active':''}`}
            onClick={()=>{setShowOnlyFavorites(p=>!p);showNotification(showOnlyFavorites?'📍 All places':'❤️ Favorites only','info',2000);}}>
            <Heart size={17} fill={(showOnlyFavorites||favorites.length>0)?'#ef4444':'none'} color={(showOnlyFavorites||favorites.length>0)?'#ef4444':'currentColor'}/>
            {favorites.length>0&&<span className="badge-count">{favorites.length}</span>}
          </button>
          <div className="avatar">👤</div>
        </div>
      </header>

      <div className="main-container">
        {sidebarOpen&&(
          <aside className="sidebar">
            <button className="filter-toggle" onClick={()=>setShowFilters(!showFilters)}>
              <div className="filter-toggle-left"><Filter size={17}/><span>Filters</span>{showOnlyFavorites&&<span className="filter-badge">❤️</span>}</div>
              <ChevronDown size={17} className={showFilters?'rotate-180':''}/>
            </button>
            {showFilters&&(
              <div className="filters">
                <div className="filter-group">
                  <label><span className="filter-icon">📁</span>Category</label>
                  <select value={filters.category} onChange={e=>setFilters({...filters,category:e.target.value})}>
                    <option value="all">All Categories</option>
                    <option value="cafe">☕ Cafe</option><option value="restaurant">🍽️ Restaurant</option>
                    <option value="landmark">🗿 Landmark</option><option value="museum">🏛️ Museum</option>
                    <option value="beach">🏖️ Beach</option><option value="park">🌳 Park</option>
                    <option value="hotel">🏨 Hotel</option><option value="shop">🛍️ Shop</option>
                  </select>
                  <span className="badge">{filteredPlaces.length}</span>
                </div>
                <div className="filter-group">
                  <label><span className="filter-icon">⭐</span>Min Rating: {filters.rating.toFixed(1)}</label>
                  <input type="range" min="0" max="5" step="0.5" value={filters.rating} onChange={e=>setFilters({...filters,rating:parseFloat(e.target.value)})}/>
                </div>
                <div className="filter-group">
                  <label><span className="filter-icon">❤️</span>Favorites Only</label>
                  <label className="toggle-switch"><input type="checkbox" checked={showOnlyFavorites} onChange={()=>setShowOnlyFavorites(p=>!p)}/><span className="toggle-slider"/></label>
                </div>
              </div>
            )}
            <div className="location-indicator">
              <div className="location-pulse"/><MapPin size={14}/>
              <span>{filteredPlaces.length} Places</span>
              {showOnlyFavorites&&<span style={{color:'#ef4444',fontSize:'11px'}}> · ❤️</span>}
            </div>

            {selectedRoutePlaces.length>0&&(
              <div className="route-panel">
                <div className="route-panel-header"><Route size={15}/><span>{selectedRoutePlaces.length} stop{selectedRoutePlaces.length>1?'s':''}</span><button className="clear-route-btn" onClick={clearRoute}><Trash2 size={13}/></button></div>
                <div className="route-stops">
                  {selectedRoutePlaces.map((p,i)=>(
                    <div key={p._id} className="route-stop">
                      <span className="stop-num">{i+1}</span><span className="stop-name">{p.name}</span>
                      <button onClick={()=>toggleRoutePlace(p)} className="remove-stop">×</button>
                    </div>
                  ))}
                </div>
                <button className={`nav-btn ${routeOptimizing?'loading-btn':''}`} disabled={selectedRoutePlaces.length<2||routeOptimizing} onClick={startNavigation}>
                  {routeOptimizing?<><span className="btn-spinner"/> Optimizing…</>:<><Navigation size={14}/> Start Navigation</>}
                </button>
                {optimizedRoute&&(
                  <div className="optimized-route">
                    <p className="route-result-label">✅ Route order:</p>
                    {optimizedRoute.map((s,i)=><div key={i} className="route-stop-result">{i+1}. {typeof s==='string'?s:s.name}</div>)}
                  </div>
                )}
              </div>
            )}

            <div className="nearby-section">
              <div className="section-header"><h3>{showOnlyFavorites?'❤️ Favorites':'All Places'}</h3><span className="badge-gold">{filteredPlaces.length}</span></div>
              <div className="place-list">
                {loading?(<div className="loading"><div className="spinner"/><p>Finding places…</p></div>)
                :error?(<div className="error-state"><AlertCircle size={36}/><p>{error}</p><button className="primary-btn" onClick={fetchPlaces}>Retry</button></div>)
                :filteredPlaces.length>0?filteredPlaces.map(place=>{
                  const inRoute=selectedRoutePlaces.some(p=>p._id===place._id);
                  const isFav=favorites.includes(place._id);
                  return(
                    <div key={place._id} className={`place-card ${selectedPlace?._id===place._id?'active':''} ${inRoute?'in-route':''}`} onClick={()=>selectPlace(place)}>
                      <div className="place-card-top">
                        <h4>{place.name}</h4>
                        <div className="place-card-actions">
                          <button className={`card-action-btn ${inRoute?'active-route-btn':''}`} title={inRoute?'Remove':'Add to route'} onClick={e=>{e.stopPropagation();toggleRoutePlace(place);}}><Route size={12}/></button>
                          <button className={`card-action-btn ${isFav?'active-fav-btn':''}`} onClick={e=>{e.stopPropagation();toggleFavorite(place._id);showNotification(isFav?'Removed':'❤️ Saved!','success',1500);}}>
                            <Heart size={12} fill={isFav?'#ef4444':'none'} color={isFav?'#ef4444':'currentColor'}/>
                          </button>
                          <span className="place-category">{getCategoryIcon(place.category)}</span>
                        </div>
                      </div>
                      <div className="place-card-mid">
                        <div className="rating"><Star size={12} fill="#f59e0b" color="#f59e0b"/><span>{place.rating||'0.0'}</span><span className="reviews">({place.reviewCount||0})</span></div>
                        <span className="price">{place.priceLevel||'$$'}</span>
                      </div>
                      {place.location?.city&&<div className="place-card-bottom"><MapPin size={11}/><span>{place.location.city}, {place.location.country}</span></div>}
                    </div>
                  );
                }):(
                  <div className="empty-state">
                    <Search size={36}/>
                    <p>{showOnlyFavorites?'No favorites saved':'Search to find places'}</p>
                    <small>{showOnlyFavorites?'Heart a place to save it':'Try "Islamabad", "Cafe", or "London"'}</small>
                    {showOnlyFavorites&&<button className="secondary-btn" style={{marginTop:'8px'}} onClick={()=>setShowOnlyFavorites(false)}>Show all</button>}
                  </div>
                )}
              </div>
            </div>
          </aside>
        )}

        <main className="content">
          <div className="tabs">
            <button className={`tab ${activeTab==='map'?'active':''}`} onClick={()=>setActiveTab('map')}><Map size={14}/> Map View</button>
            <button className={`tab ${activeTab==='ai'?'active':''}`} onClick={()=>setActiveTab('ai')}><Sparkles size={14}/> AI Picks</button>
            <button className={`tab ${activeTab==='analytics'?'active':''}`} onClick={()=>setActiveTab('analytics')}><TrendingUp size={14}/> Analytics</button>
          </div>

          <div className="tab-content">

            {/* ── MAP VIEW ── */}
            {activeTab==='map'&&(
              <div style={{position:'relative',height:'100%',width:'100%',minHeight:'500px'}}>
                <MapErrorBoundary>
                <MapContainer
                  key="smartmap-leaflet"
                  center={[mapCenter.lat,mapCenter.lng]}
                  zoom={12}
                  style={{height:'100%',width:'100%',borderRadius:'12px'}}
                  zoomAnimation={true}
                  markerZoomAnimation={true}
                  preferCanvas={false}
                >
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution="&copy; OpenStreetMap contributors"/>
                  <MapController flyTarget={flyTarget}/>
                  {showMarkers&&filteredPlaces.map(place=>{
                    const coords=getLatLng(place);
                    if(!coords)return null;
                    const inRoute=selectedRoutePlaces.some(p=>p._id===place._id);
                    return(
                      <Marker key={place._id} position={[coords.lat,coords.lng]} icon={inRoute?SelectedIcon:DefaultIcon} eventHandlers={{click:()=>selectPlace(place)}}>
                        <Popup>
                          <div style={{color:'#0f172a',minWidth:'180px',fontFamily:'sans-serif'}}>
                            <strong style={{fontSize:'13px',display:'block',marginBottom:3}}>{place.name}</strong>
                            <div style={{color:'#64748b',fontSize:'12px',marginBottom:4}}>{getCategoryIcon(place.category)} {place.category}</div>
                            <div style={{fontSize:'12px',marginBottom:2}}>⭐ {place.rating||'N/A'} · {place.reviewCount||0} reviews</div>
                            <div style={{fontSize:'11px',color:'#64748b',marginBottom:8}}>📍 {place.location?.city}, {place.location?.country}</div>
                            <div style={{display:'flex',gap:'4px',flexWrap:'wrap'}}>
                              <button style={{fontSize:'11px',background:'#3b82f6',color:'#fff',border:'none',borderRadius:'4px',padding:'4px 8px',cursor:'pointer',fontWeight:600}} onClick={()=>getDirections(place)}>🗺️ Directions</button>
                              <button style={{fontSize:'11px',background:inRoute?'#ef4444':'#10b981',color:'#fff',border:'none',borderRadius:'4px',padding:'4px 8px',cursor:'pointer',fontWeight:600}} onClick={()=>toggleRoutePlace(place)}>{inRoute?'− Route':'+ Route'}</button>
                              <button style={{fontSize:'11px',background:'#f59e0b',color:'#fff',border:'none',borderRadius:'4px',padding:'4px 8px',cursor:'pointer',fontWeight:600}} onClick={()=>setReviewPlace(place)}>✍️ Review</button>
                              <button style={{fontSize:'11px',background:favorites.includes(place._id)?'#ef4444':'#8b5cf6',color:'#fff',border:'none',borderRadius:'4px',padding:'4px 8px',cursor:'pointer',fontWeight:600}} onClick={()=>{toggleFavorite(place._id);showNotification(favorites.includes(place._id)?'Removed':'❤️ Saved!','success',1500);}}>
                                {favorites.includes(place._id)?'♥ Saved':'♡ Save'}
                              </button>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
                </MapErrorBoundary>




                {/* Place detail panel overlay on map */}
                {selectedPlace&&(
                  <div className="map-detail-overlay">
                    <PlaceDetailPanel
                      place={selectedPlace} favorites={favorites}
                      onFavorite={()=>{toggleFavorite(selectedPlace._id);showNotification(favorites.includes(selectedPlace._id)?'Removed':'❤️ Saved!','success',1500);}}
                      onRoute={()=>{toggleRoutePlace(selectedPlace);showNotification(selectedRoutePlaces.some(p=>p._id===selectedPlace._id)?'Removed from route':'🗺️ Added to route','info',1500);}}
                      inRoute={selectedRoutePlaces.some(p=>p._id===selectedPlace._id)}
                      onReview={()=>setReviewPlace(selectedPlace)}
                      onClose={()=>setSelectedPlace(null)}
                      onDirections={()=>getDirections(selectedPlace)}
                    />
                  </div>
                )}
              </div>
            )}

            {/* ── AI PICKS ── */}
            {activeTab==='ai'&&(
              <div style={{height:'100%',overflowY:'auto'}}>
                <AIPicksTab filteredPlaces={filteredPlaces} searchQuery={searchQuery} mapCenter={mapCenter} onExplore={handleAIExplore}/>
              </div>
            )}

            {/* ── ANALYTICS ── */}
            {activeTab==='analytics'&&(
              <AnalyticsTab filteredPlaces={filteredPlaces} onSelectPlace={selectPlace}/>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}