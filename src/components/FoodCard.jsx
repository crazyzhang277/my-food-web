import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Tag, Calendar, Trash2 } from 'lucide-react';

export function FoodCard({ log, onDelete }) {
  const imageUrl = log.image_urls?.[0] || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
        position: 'relative',
        display: 'flex', flexDirection: 'column'
      }}
    >
      <div style={{ height: '190px', width: '100%', position: 'relative', overflow: 'hidden' }}>
        <img src={imageUrl} alt={log.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{
          position: 'absolute', top: '12px', right: '12px',
          background: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          borderRadius: 'var(--radius-full)', padding: '4px 10px',
          display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-primary)', fontSize: '0.85rem'
        }}>
          <Star size={14} fill="var(--accent-amber)" color="var(--accent-amber)" />
          <span style={{ fontWeight: 700 }}>{log.rating}.0</span>
        </div>
        <div style={{
          position: 'absolute', bottom: '12px', left: '12px',
          background: 'var(--accent-gradient)', color: '#fff',
          borderRadius: 'var(--radius-full)', padding: '3px 12px', fontSize: '0.75rem', fontWeight: 600,
          boxShadow: '0 4px 12px rgba(255, 111, 67, 0.3)'
        }}>
          📍 {log.city}
        </div>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{log.title}</h3>
          {log.price_per_person && (
            <span style={{ color: 'var(--accent-orange)', fontWeight: 700, fontSize: '0.95rem' }}>
              ￥{log.price_per_person}/人
            </span>
          )}
        </div>

        {log.address && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={12} /> {log.address}
          </p>
        )}

        {log.recommended_dishes && log.recommended_dishes.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
            {log.recommended_dishes.map((dish, i) => (
              <span key={i} style={{
                background: 'rgba(255, 111, 67, 0.1)', color: 'var(--accent-orange)',
                padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 500
              }}>
                👍 {dish}
              </span>
            ))}
          </div>
        )}

        {log.notes && (
          <p style={{
            color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '10px',
            lineHeight: '1.4', background: 'var(--bg-secondary)', padding: '8px 10px', borderRadius: '8px'
          }}>
            "{log.notes}"
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--glass-border)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={12} /> {log.dining_date}
          </span>
          {onDelete && (
            <button onClick={() => onDelete(log.id)} style={{ background: 'none', color: 'var(--text-muted)' }}>
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
