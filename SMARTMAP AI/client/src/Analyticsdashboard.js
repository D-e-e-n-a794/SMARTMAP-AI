// File: client/src/AnalyticsDashboard.js
// New separate component for analytics

import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import { TrendingUp, Activity, MapPin, MessageSquare, Heart, Navigation, AlertCircle } from 'lucide-react';

export default function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [trendsData, setTrendsData] = useState(null);
  const [topPlaces, setTopPlaces] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(30);

  const COLORS = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#06b6d4', '#ec4899', '#6366f1'];

  useEffect(() => {
    fetchAnalytics();
  }, [days]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch overview
      const overviewRes = await axios.get('/api/analytics/overview', { timeout: 5000 });
      
      // Fetch trends
      const trendsRes = await axios.get(`/api/analytics/trends?days=${days}`, { timeout: 5000 });
      
      // Fetch top places
      const topRes = await axios.get('/api/analytics/top-places?event=visit', { timeout: 5000 });

      if (overviewRes.data?.success) {
        setAnalyticsData(overviewRes.data.data);
      }
      if (trendsRes.data?.success) {
        setTrendsData(trendsRes.data.data);
      }
      if (topRes.data?.success) {
        setTopPlaces(topRes.data.data);
      }
    } catch (err) {
      console.error('Analytics fetch error:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #374151',
          borderTop: '4px solid #f59e0b',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }} />
        <p style={{ color: '#cbd5e1' }}>Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <AlertCircle size={48} style={{ color: '#ef4444', margin: '0 auto 16px' }} />
        <p style={{ color: '#ef4444' }}>{error}</p>
        <button 
          onClick={fetchAnalytics}
          style={{
            marginTop: '16px',
            padding: '8px 16px',
            background: '#f59e0b',
            color: '#000',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', overflowY: 'auto', height: '100%', background: '#0f172a' }}>
      {/* HEADER */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 8px', color: '#f0f9ff', fontSize: '32px', fontWeight: 700 }}>
          📊 Analytics Dashboard
        </h2>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '15px' }}>
          Real-time insights from your SmartMap data
        </p>
        <div style={{ marginTop: '12px' }}>
          <label style={{ color: '#cbd5e1', marginRight: '12px' }}>Time range:</label>
          <select 
            value={days} 
            onChange={(e) => setDays(parseInt(e.target.value))}
            style={{
              padding: '6px 12px',
              background: '#1f2937',
              color: '#e2e8f0',
              border: '1px solid #374151',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
      </div>

      {!analyticsData ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ color: '#9ca3af' }}>No data available</p>
        </div>
      ) : (
        <>
          {/* KEY METRICS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '30px'
          }}>
            {[
              { icon: '👁️', label: 'Total Visits', value: analyticsData.totalVisits, color: '#f59e0b' },
              { icon: '🔍', label: 'Total Searches', value: analyticsData.eventCounts?.search || 0, color: '#3b82f6' },
              { icon: '💬', label: 'Total Reviews', value: analyticsData.totalReviews, color: '#10b981' },
              { icon: '❤️', label: 'Saves', value: analyticsData.totalSaves, color: '#ef4444' }
            ].map(stat => (
              <div key={stat.label} style={{
                background: 'linear-gradient(135deg,#1f2937,#111827)',
                border: `2px solid ${stat.color}33`,
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span style={{ fontSize: '24px' }}>{stat.icon}</span>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: stat.color }}>
                    {stat.value.toLocaleString()}
                  </div>
                </div>
                <p style={{ margin: '0 0 4px', color: '#9ca3af', fontSize: '12px', fontWeight: 600 }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* TRENDS CHART */}
          {trendsData?.trends && (
            <div style={{
              background: 'linear-gradient(135deg,#1f2937,#111827)',
              border: '1px solid #374151',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '30px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}>
              <h3 style={{ margin: '0 0 20px', color: '#f0f9ff', fontSize: '18px', fontWeight: 600 }}>
                📈 Activity Trends
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendsData.trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '8px', color: '#e2e8f0' }} />
                  <Legend />
                  <Line type="monotone" dataKey="visits" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="searches" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="reviews" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* CHARTS GRID */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            {/* CATEGORIES */}
            {analyticsData.categories && (
              <div style={{
                background: 'linear-gradient(135deg,#1f2937,#111827)',
                border: '1px solid #374151',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
              }}>
                <h3 style={{ margin: '0 0 20px', color: '#f0f9ff', fontSize: '18px', fontWeight: 600 }}>
                  📂 Place Categories
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={analyticsData.categories}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={85}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name}(${value})`}
                    >
                      {analyticsData.categories.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '8px', color: '#e2e8f0' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* EVENT TYPES */}
            {analyticsData.eventCounts && (
              <div style={{
                background: 'linear-gradient(135deg,#1f2937,#111827)',
                border: '1px solid #374151',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
              }}>
                <h3 style={{ margin: '0 0 20px', color: '#f0f9ff', fontSize: '18px', fontWeight: 600 }}>
                  📊 Event Types
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={Object.entries(analyticsData.eventCounts).map(([key, value]) => ({
                    name: key.charAt(0).toUpperCase() + key.slice(1),
                    value
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '8px', color: '#e2e8f0' }} />
                    <Bar dataKey="value" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* TOP PLACES TABLE */}
          {topPlaces && topPlaces.length > 0 && (
            <div style={{
              background: 'linear-gradient(135deg,#1f2937,#111827)',
              border: '1px solid #374151',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}>
              <h3 style={{ margin: '0 0 20px', color: '#f0f9ff', fontSize: '18px', fontWeight: 600 }}>
                🏆 Most Visited Places
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '13px'
                }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #374151' }}>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#9ca3af', fontWeight: 600 }}>Rank</th>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#9ca3af', fontWeight: 600 }}>Place</th>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#9ca3af', fontWeight: 600 }}>Category</th>
                      <th style={{ textAlign: 'center', padding: '12px', color: '#9ca3af', fontWeight: 600 }}>Visits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topPlaces.slice(0, 10).map((place, idx) => (
                      <tr key={place.placeId} style={{ borderBottom: '1px solid #1f2937' }}>
                        <td style={{ padding: '12px', color: '#f0f9ff', fontWeight: 600 }}>#{idx + 1}</td>
                        <td style={{ padding: '12px', color: '#e2e8f0' }}>{place.name}</td>
                        <td style={{ padding: '12px', color: '#cbd5e1' }}>{place.category}</td>
                        <td style={{ padding: '12px', color: '#f59e0b', fontWeight: 600, textAlign: 'center' }}>
                          {place.count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}