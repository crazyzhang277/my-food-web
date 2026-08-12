import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UtensilsCrossed, Sparkles } from 'lucide-react';

export function SplashScreen({ onFinish }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 600); // Wait for exit animation
    }, 1800);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'linear-gradient(135deg, #FAF6F0 0%, #F3ECE2 50%, #FAF6F0 100%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '20px'
          }}
        >
          {/* Central Animated Icon Badge */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            style={{ position: 'relative', marginBottom: '24px' }}
          >
            {/* Glowing Backdrop Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
              style={{
                position: 'absolute', inset: '-12px',
                borderRadius: '50%',
                border: '2px dashed rgba(255, 111, 67, 0.3)'
              }}
            />

            <div style={{
              width: '80px', height: '80px', borderRadius: '24px',
              background: 'var(--accent-gradient)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: '#fff',
              boxShadow: '0 16px 36px rgba(255, 111, 67, 0.35)',
              position: 'relative'
            }}>
              <UtensilsCrossed size={40} />
            </div>

            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ position: 'absolute', top: '-6px', right: '-6px', color: 'var(--accent-amber)' }}
            >
              <Sparkles size={20} />
            </motion.div>
          </motion.div>

          {/* Brand Name Animation */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800,
              color: 'var(--text-primary)', letterSpacing: '-0.02em', textAlign: 'center'
            }}
          >
            Gourmet<span style={{ color: 'var(--accent-orange)' }}>Log</span>
          </motion.h1>

          {/* Slogan */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={{
              color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '8px',
              letterSpacing: '0.08em', fontWeight: 500
            }}
          >
            “ 记录每一餐的仪式感与好滋味 ”
          </motion.p>

          {/* Golden Loading Progress Line */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '140px' }}
            transition={{ delay: 0.3, duration: 1.3, ease: 'easeInOut' }}
            style={{
              height: '3px', borderRadius: 'var(--radius-full)',
              background: 'var(--accent-gradient)', marginTop: '32px',
              boxShadow: '0 2px 10px rgba(255, 111, 67, 0.4)'
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
