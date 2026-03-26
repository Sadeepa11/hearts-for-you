'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Volume2, VolumeX, Sparkles } from 'lucide-react';
import HeartCanvas from '@/components/HeartCanvas';
import BackgroundPigs from '@/components/BackgroundPigs';

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    setAudio(new Audio('/Perfect.mp3'));
  }, []);

  useEffect(() => {
    if (audio) {
      audio.loop = true;
      return () => {
        audio.pause();
      };
    }
  }, [audio]);

  const toggleMusic = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(e => console.log("Audio play blocked", e));
    }
    setIsPlaying(!isPlaying);
  };

  // Generate floating hearts (background)
  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now();
      setHearts((prev) => [...prev, { id, left: Math.random() * 100, size: Math.random() * 20 + 20 }]);
      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== id));
      }, 10000);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleForgive = () => {
    setShowCelebration(true);
    
    // Save to Backend API
    fetch('/api/forgive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "Semi Forgave You! ❤️" })
    }).catch(err => console.error("Failed to sync with backend:", err));
  };

  return (
    <div className="app-container">
      {/* 1000 Hearts Celebration Layer */}
      <HeartCanvas active={showCelebration} />

      {/* Background Stationary Rotating Pigs */}
      <BackgroundPigs />

      {/* Floating Hearts (Background) */}
      <div className="hearts-container">
        <AnimatePresence>
          {hearts.map((heart) => (
            <motion.div
              key={heart.id}
              className="heart"
              initial={{ y: "110vh", opacity: 0, x: `${heart.left}vw` }}
              animate={{ y: "-20vh", opacity: [0, 0.8, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 10, ease: "linear" }}
              style={{ left: `${heart.left}vw` }}
            >
              <Heart size={heart.size} fill="currentColor" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Main Content Card */}
      <motion.div 
        className="glass-card"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="title" style={{ fontFamily: 'var(--font-playfair)' }}>
          {showCelebration ? "To My Princess," : "Hey Semi......,"}
        </h1>
        <p className="subtitle" style={{ fontFamily: 'var(--font-outfit)' }}>
          {showCelebration ? (
            <>Thank you for your infinite grace and love. 💖<br/>You are my everything, now and forever.</>
          ) : (
            <>I didn't mean to hurt you, baby 🐷<br/>I'm so incredibly sorry for my mistakes my little princess ❤️🥺.</>
          )}
        </p>
        
        <motion.div
          animate={showCelebration ? { scale: [1, 1.1, 1], y: [0, -5, 0] } : {}}
          transition={{ duration: 0.5, repeat: showCelebration ? Infinity : 0 }}
        >
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', lineHeight: '1.6', fontFamily: 'var(--font-outfit)' }}>
            {showCelebration ? (
              <>I love you more than words can express. ❤️<br/>Thank you for forgiving your piggy. 🐷✨</>
            ) : (
              <>You make my world beautiful. <br/> Will you please forgive me? ❤️</>
            )}
          </p>
        </motion.div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <motion.button
            className="music-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleForgive}
            style={{ 
              background: showCelebration ? '#ffd700' : 'var(--pink-deep)', 
              color: showCelebration ? '#000' : '#fff',
              boxShadow: showCelebration ? '0 0 20px #ffd700' : 'none',
              zIndex: 110 
            }}
          >
            {showCelebration ? <Sparkles size={20} /> : <Heart size={20} />}
            {showCelebration ? "You're My World!" : "I Forgive You"}
          </motion.button>

          <button 
            className={`music-btn ${isPlaying ? 'playing' : ''}`}
            onClick={toggleMusic}
            style={{ zIndex: 110 }}
          >
            {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
            {isPlaying ? "Music Playing" : "Play Music"}
          </button>
        </div>
      </motion.div>

      {/* Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              position: 'absolute',
              top: '15%',
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center',
              zIndex: 120,
              pointerEvents: 'none'
            }}
          >
            <h2 style={{ 
              color: 'var(--pink-deep)', 
              fontSize: '2.5rem', 
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              background: 'white',
              padding: '1rem 2rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              fontFamily: 'var(--font-playfair)'
            }}>
              YAY! I LOVE YOU! ❤️🎉
            </h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
