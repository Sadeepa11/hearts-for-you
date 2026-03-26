'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function SecretDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/forgiveness')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error("Failed to fetch:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="app-container" style={{ overflowY: 'auto', padding: '2rem' }}>
      <motion.div 
        className="glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: '800px', width: '100%', textAlign: 'left' }}
      >
        <h1 className="title" style={{ fontSize: '2.5rem', fontFamily: 'var(--font-playfair)' }}>
          Secret Love Tracker 🐷💖
        </h1>
        <p className="subtitle" style={{ fontFamily: 'var(--font-outfit)' }}>
          Every time Semi chooses love over anger...
        </p>

        {loading ? (
          <p style={{ fontFamily: 'var(--font-outfit)' }}>Loading the magic...</p>
        ) : data.length === 0 ? (
          <p style={{ opacity: 0.6, fontFamily: 'var(--font-outfit)' }}>
            No records yet. Better start being extra nice! 😉
          </p>
        ) : (
          <div style={{ marginTop: '2rem' }}>
            {data.slice().reverse().map((item, i) => (
              <div key={i} style={{ 
                padding: '1rem', 
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ fontFamily: 'var(--font-outfit)' }}>
                  <div style={{ fontWeight: '600', color: 'var(--pink-deep)' }}>{item.message}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>{new Date(item.timestamp).toLocaleString()}</div>
                </div>
                <div style={{ color: 'var(--pink-accent)' }}><Heart size={16} fill="currentColor" /></div>
              </div>
            ))}
          </div>
        )}

        <Link href="/">
          <button 
            className="music-btn" 
            style={{ marginTop: '2rem' }}
          >
            Back to Home
          </button>
        </Link>
      </motion.div>
    </div>
  );
}
