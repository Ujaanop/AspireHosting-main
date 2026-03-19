"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface MeteorProps {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  size: number;
}

export function MeteorShower() {
  const [meteors, setMeteors] = useState<MeteorProps[]>([]);

  useEffect(() => {
    const generateMeteors = () => {
      const newMeteors: MeteorProps[] = [];
      
      for (let i = 0; i < 20; i++) {
        newMeteors.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 5,
          duration: 2 + Math.random() * 3,
          size: 1 + Math.random() * 3,
        });
      }
      
      setMeteors(newMeteors);
    };

    generateMeteors();
    
    // Regenerate meteors every 10 seconds
    const interval = setInterval(generateMeteors, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {meteors.map((meteor) => (
        <motion.div
          key={meteor.id}
          className="absolute"
          style={{
            left: `${meteor.x}%`,
            top: `${meteor.y}%`,
          }}
          initial={{
            opacity: 0,
            scale: 0,
            rotate: 0,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            rotate: [0, 180, 360],
            x: [0, 200, 400],
            y: [0, 100, 200],
          }}
          transition={{
            duration: meteor.duration,
            delay: meteor.delay,
            repeat: Infinity,
            repeatDelay: 5 + Math.random() * 10,
            ease: "easeOut",
          }}
        >
          <div
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 rounded-full blur-sm"
            style={{
              width: `${meteor.size}px`,
              height: `${meteor.size}px`,
              boxShadow: `0 0 ${meteor.size * 2}px rgba(59, 130, 246, 0.6)`,
            }}
          />
        </motion.div>
      ))}
      
      {/* Additional sparkle effects */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute w-1 h-1 bg-blue-300 dark:bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 1 + Math.random() * 2,
            delay: Math.random() * 5,
            repeat: Infinity,
            repeatDelay: 3 + Math.random() * 7,
          }}
        />
      ))}
    </div>
  );
}

export function MeteorShowerBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient background - different for light/dark mode */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-purple-800 to-slate-800 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900" />

      {/* Subtle grid overlay to blend with site background */}
      <div className="absolute inset-0 opacity-[0.08] dark:opacity-[0.08] mix-blend-screen"
        style={{ backgroundImage: "url('/patterns/grid.svg')", backgroundPosition: 'center' }}
      />

      {/* Animated stars - different colors for light/dark mode */}
      <div className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute w-1 h-1 bg-blue-200 dark:bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Meteor shower */}
      <MeteorShower />

      {/* Top-to-bottom vignette for depth - different for light/dark mode */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-slate-900/40 via-transparent to-transparent dark:from-black/30" />

      {/* Bottom fade to blend into page background - different for light/dark mode */}
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none bg-gradient-to-b from-transparent to-white dark:to-[rgba(10,11,15,1)]" />
    </div>
  );
}
