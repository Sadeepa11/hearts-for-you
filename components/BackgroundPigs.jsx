'use client';
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const BackgroundPigs = () => {
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  const pigPositions = useMemo(() => {
    if (!hasMounted) return [];
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${(i % 5) * 20 + Math.random() * 10}%`,
      top: `${Math.floor(i / 5) * 30 + Math.random() * 15}%`,
      rotate: Math.random() * 360,
      size: 80 + Math.random() * 60,
      speed: 10 + Math.random() * 20
    }));
  }, [hasMounted]);

  if (!hasMounted) return null;

  return (
    <div className="bg-pigs">
      {pigPositions.map((pig) => (
        <motion.img
          key={pig.id}
          src="/pig.png"
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
  );
};

export default BackgroundPigs;
