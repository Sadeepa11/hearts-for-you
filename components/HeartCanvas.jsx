'use client';
import React, { useEffect, useRef } from 'react';

const HeartCanvas = ({ active }) => {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const requestRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
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
        for (let i = 0; i < 10; i++) {
          particles.current.push(createParticle(canvas.width * 0.18));
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
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', handleResize);
    };
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

export default HeartCanvas;
