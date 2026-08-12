import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin, Calendar, Trash2, Map, ChevronLeft, ChevronRight, X, Images } from 'lucide-react';

export function FoodCard({ log, onDelete, onClickCard }) {
  const [showMap, setShowMap] = useState(false);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const images = log.image_urls || [];
  const hasImages = images.length > 0;
  const hasCoords = log.latitude && log.longitude;

  const handleNextImg = (e) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImg = (e) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ y: -6 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onClickCard && onClickCard(log)}
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-card)',
          position: 'relative',
          display: 'flex', flexDirection: 'column',
          cursor: 'pointer'
        }}
      >
        {/* Banner Zone */}
        {(hasImages || (showMap && hasCoords)) && (
          <div style={{ height: '200px', width: '100%', position: 'relative', overflow: 'hidden', background: '#000' }}>
            {showMap && hasCoords ? (
              <iframe
                title="Location Map"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${log.longitude - 0.008}%2C${log.latitude - 0.008}%2C${log.longitude + 0.008}%2C${log.latitude + 0.008}&layer=mapnik&marker=${log.latitude}%2C${log.longitude}`}
                style={{ border: 0 }}
              />
            ) : hasImages ? (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLightboxOpen(true);
                }}
                style={{ width: '100%', height: '100%', cursor: 'pointer', position: 'relative' }}
              >
                <img
                  src={images[activeImgIndex]}
                  alt={log.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                
                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImg}
                      style={{
                        position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)',
                        background: 'rgba(0,0,0,0.45)', color: '#fff', borderRadius: '50%',
                        width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={handleNextImg}
                      style={{
                        position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                        background: 'rgba(0,0,0,0.45)', color: '#fff', borderRadius: '50%',
                        width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >
                      <ChevronRight size={18} />
                    </button>
                    <div style={{
                      position: 'absolute', bottom: '12px', right: '12px',
                      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                      color: '#fff', borderRadius: 'var(--radius-full)', padding: '2px 8px', fontSize: '0.75rem'
                    }}>
                      <Images size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      {activeImgIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>
            ) : null}

            {/* Rating Badge */}
            <div style={{
              position: 'absolute', top: '12px', right: '12px', zIndex: 2,
              background: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              borderRadius: 'var(--radius-full)', padding: '4px 10px',
              display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-primary)', fontSize: '0.85rem'
            }}>
              <Star size={14} fill="var(--accent-amber)" color="var(--accent-amber)" />
              <span style={{ fontWeight: 700 }}>{log.rating}.0</span>
            </div>

            {/* Toggle Map Button */}
            {hasCoords && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMap(!showMap);
                }}
                style={{
                  position: 'absolute', top: '12px', left: '12px', zIndex: 2,
                  background: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(8px)',
                  borderRadius: 'var(--radius-full)', padding: '4px 10px',
                  display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-orange)', fontSize: '0.75rem', fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                <Map size={13} /> {showMap ? '查看照片' : '切换地图'}
              </button>
            )}

            {/* Location City Pill */}
            <div style={{
              position: 'absolute', bottom: '12px', left: '12px', zIndex: 2,
              background: 'var(--accent-gradient)', color: '#fff',
              borderRadius: 'var(--radius-full)', padding: '3px 12px', fontSize: '0.75rem', fontWeight: 600,
              boxShadow: '0 4px 12px rgba(255, 111, 67, 0.3)'
            }}>
              📍 {log.city}
            </div>
          </div>
        )}

        {/* Content Body */}
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          {!hasImages && !showMap && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{
                background: 'var(--accent-gradient)', color: '#fff',
                borderRadius: 'var(--radius-full)', padding: '2px 10px', fontSize: '0.75rem', fontWeight: 600
              }}>
                📍 {log.city}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-amber)', fontSize: '0.85rem' }}>
                <Star size={14} fill="var(--accent-amber)" color="var(--accent-amber)" />
                <span style={{ fontWeight: 700 }}>{log.rating}.0</span>
              </div>
            </div>
          )}

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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(log.id);
                }}
                style={{ background: 'none', color: 'var(--text-muted)' }}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Fullscreen High-Res Photo Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && hasImages && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            backgroundColor: 'rgba(0, 0, 0, 0.9)', backdropFilter: 'blur(16px)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
          }}>
            <button
              onClick={() => setIsLightboxOpen(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', color: '#fff', zIndex: 10 }}
            >
              <X size={28} />
            </button>

            <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={images[activeImgIndex]}
                alt="Fullscreen food log"
                style={{ maxWidth: '100%', maxHeight: '75vh', borderRadius: '12px', objectFit: 'contain' }}
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImg}
                    style={{
                      position: 'absolute', left: '-20px',
                      background: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: '50%',
                      width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={handleNextImg}
                    style={{
                      position: 'absolute', right: '-20px',
                      background: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: '50%',
                      width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '20px', overflowX: 'auto', padding: '10px' }}>
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="thumbnail"
                    onClick={() => setActiveImgIndex(idx)}
                    style={{
                      width: '54px', height: '54px', borderRadius: '8px', objectFit: 'cover', cursor: 'pointer',
                      border: idx === activeImgIndex ? '2px solid var(--accent-orange)' : '2px solid transparent',
                      opacity: idx === activeImgIndex ? 1 : 0.6
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
