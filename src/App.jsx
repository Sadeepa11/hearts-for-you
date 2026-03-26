import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Volume2, VolumeX, Sparkles } from 'lucide-react';
import pigImg from './assets/pig.png';
import perfectMusic from './assets/Perfect.mp3';

const HeartCanvas = ({ active }) => {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const requestRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const createParticle = (emitterX) => {
      return {
        x: emitterX,
        y: canvas.height,
        vx: (Math.random() - 0.5) * 15,
        vy: -Math.random() * 25 - 10,
        size: Math.random() * 15 + 5,
        color: `hsl(${Math.random() * 30 + 330}, 100%, 70%)`,
        opacity: 1,
        friction: 0.98,
        gravity: 0.15,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1
      };
    };

    const drawHeart = (ctx, x, y, size, color, opacity, rotation) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-size / 2, -size / 2, -size, 0, 0, size);
      ctx.bezierCurveTo(size, 0, size / 2, -size / 2, 0, 0);
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity;
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (active && particles.current.length < 1000) {
        // Emitter Left (approx 18% width based on image markings)
        for (let i = 0; i < 10; i++) {
          particles.current.push(createParticle(canvas.width * 0.18));
        }
        // Emitter Right (approx 82% width based on image markings)
        for (let i = 0; i < 10; i++) {
          particles.current.push(createParticle(canvas.width * 0.82));
        }
      }

      particles.current = particles.current.filter(p => p.opacity > 0);

      particles.current.forEach(p => {
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        
        if (p.vy > 0) {
          p.opacity -= 0.01;
        }

        drawHeart(ctx, p.x, p.y, p.size, p.color, Math.max(0, p.opacity), p.rotation);
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 100,
        width: '100vw',
        height: '100vh'
      }}
    />
  );
};

const SecretDashboard = () => {
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
        <h1 className="title" style={{ fontSize: '2.5rem' }}>Secret Love Tracker 🐷💖</h1>
        <p className="subtitle">Every time Semi chooses love over anger...</p>

        {loading ? (
          <p>Loading the magic...</p>
        ) : data.length === 0 ? (
          <p style={{ opacity: 0.6 }}>No records yet. Better start being extra nice! 😉</p>
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
                <div>
                  <div style={{ fontWeight: '600', color: 'var(--pink-deep)' }}>{item.message}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>{new Date(item.timestamp).toLocaleString()}</div>
                </div>
                <div style={{ color: 'var(--pink-accent)' }}><Heart size={16} fill="currentColor" /></div>
              </div>
            ))}
          </div>
        )}

        <button 
          className="music-btn" 
          onClick={() => window.location.href = '/'}
          style={{ marginTop: '2rem' }}
        >
          Back to Home
        </button>
      </motion.div>
    </div>
  );
};

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [hearts, setHearts] = useState([]);

  // Simple Routing
  const currentPath = window.location.pathname;
  if (currentPath === '/secret-love-tracker') {
    return <SecretDashboard />;
  }

  // Using "Perfect" by Ed Sheeran as requested.
  const [audio] = useState(new Audio(perfectMusic));

  useEffect(() => {
    audio.loop = true;
    return () => {
      audio.pause();
    };
  }, [audio]);

  const toggleMusic = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(e => console.log("Audio play blocked", e));
    }
    setIsPlaying(!isPlaying);
  };

  // Generate background pig positions (stationary but rotating)
  const pigPositions = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${(i % 5) * 20 + Math.random() * 10}%`,
      top: `${Math.floor(i / 5) * 30 + Math.random() * 15}%`,
      rotate: Math.random() * 360,
      size: 80 + Math.random() * 60,
      speed: 10 + Math.random() * 20
    }));
  }, []);

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
    
    // Save to Backend
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
      <div className="bg-pigs">
        {pigPositions.map((pig) => (
          <motion.img
            key={pig.id}
            src={pigImg}
            alt="Cute Pig"
            className="pig-item"
            initial={{ rotate: pig.rotate }}
            animate={{ rotate: pig.rotate + 360 }}
            transition={{
              duration: pig.speed,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ 
              position: 'absolute',
              left: pig.left,
              top: pig.top,
              width: `${pig.size}px`,
              opacity: 0.3,
              pointerEvents: 'none'
            }}
          />
        ))}
      </div>

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
        <h1 className="title">{showCelebration ? "To My Princes," : "Hey Semi......,"}</h1>
        <p className="subtitle">
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
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', lineHeight: '1.6' }}>
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
              zIndex: 110 // Ensure buttons are above the canvas
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
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              YAY! I LOVE YOU! ❤️🎉
            </h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
