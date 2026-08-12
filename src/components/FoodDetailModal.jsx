import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, MapPin, Calendar, Trash2, Map, ChevronLeft, ChevronRight, Images, UtensilsCrossed } from 'lucide-react';

export function FoodDetailModal({ log, isOpen, onClose, onDelete }) {
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [showMap, setShowMap] = useState(false);

  if (!isOpen || !log) return null;

  const images = log.image_urls || [];
  const hasImages = images.length > 0;
  const hasCoords = log.latitude && log.longitude;

  const handleNext = () => setActiveImgIdx((prev) => (prev + 1) % images.length);
  const handlePrev = () => setActiveImgIdx((prev) => (prev - 1 + images.length) % images.length);

  return (
    <AnimatePresence>
      <div className="modal-overlay" style={{
        position: 'fixed', inset: 0, zIndex: 1100,
        backgroundColor: 'rgba(45, 37, 34, 0.55)', backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-lg)',
            width: '100%', maxWidth: '640px', maxHeight: '90vh',
            overflowY: 'auto', boxShadow: 'var(--shadow-card)',
            position: 'relative', display: 'flex', flexDirection: 'column'
          }}
        >
          {/* Top Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '16px', right: '16px', zIndex: 20,
              background: 'rgba(0,0,0,0.5)', color: '#fff', borderRadius: '50%',
              width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(6px)'
            }}
          >
            <X size={18} />
          </button>

          {/* Media Header (Map or High-Res Photos) */}
          {(hasImages || (showMap && hasCoords)) && (
            <div style={{ height: '280px', width: '100%', position: 'relative', background: '#000' }}>
              {showMap && hasCoords ? (
                <iframe
                  title="Detail Map"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${log.longitude - 0.008}%2C${log.latitude - 0.008}%2C${log.longitude + 0.008}%2C${log.latitude + 0.008}&layer=mapnik&marker=${log.latitude}%2C${log.longitude}`}
                  style={{ border: 0 }}
                />
              ) : hasImages ? (
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                  <img
                    src={images[activeImgIdx]}
                    alt={log.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrev}
                        style={{
                          position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                          background: 'rgba(0,0,0,0.5)', color: '#fff', borderRadius: '50%',
                          width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                      >
                        <ChevronLeft size={22} />
                      </button>
                      <button
                        onClick={handleNext}
                        style={{
                          position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                          background: 'rgba(0,0,0,0.5)', color: '#fff', borderRadius: '50%',
                          width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                      >
                        <ChevronRight size={22} />
                      </button>
                      <div style={{
                        position: 'absolute', bottom: '12px', right: '12px',
                        background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
                        color: '#fff', borderRadius: 'var(--radius-full)', padding: '4px 12px', fontSize: '0.8rem'
                      }}>
                        <Images size={13} style={{ display: 'inline', marginRight: '4px' }} />
                        {activeImgIdx + 1} / {images.length}
                      </div>
                    </>
                  )}
                </div>
              ) : null}

              {hasCoords && (
                <button
                  onClick={() => setShowMap(!showMap)}
                  style={{
                    position: 'absolute', top: '16px', left: '16px', zIndex: 10,
                    background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)',
                    borderRadius: 'var(--radius-full)', padding: '6px 14px',
                    display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-orange)', fontSize: '0.8rem', fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                >
                  <Map size={14} /> {showMap ? '查看全套照片' : '查看实景地图'}
                </button>
              )}
            </div>
          )}

          {/* Detailed Content Body */}
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Title & Price Header */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{
                  background: 'var(--accent-gradient)', color: '#fff',
                  borderRadius: 'var(--radius-full)', padding: '3px 12px', fontSize: '0.75rem', fontWeight: 600
                }}>
                  📍 {log.city}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-amber)', fontSize: '0.95rem' }}>
                  <Star size={16} fill="var(--accent-amber)" color="var(--accent-amber)" />
                  <span style={{ fontWeight: 700 }}>{log.rating}.0 星级评定</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '6px' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {log.title}
                </h2>
                {log.price_per_person && (
                  <span style={{ color: 'var(--accent-orange)', fontWeight: 800, fontSize: '1.25rem' }}>
                    ￥{log.price_per_person}<span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}> /人均</span>
                  </span>
                )}
              </div>
            </div>

            {/* Address */}
            {log.address && (
              <div style={{
                background: 'var(--bg-primary)', padding: '12px 14px', borderRadius: 'var(--radius-md)',
                display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--glass-border)'
              }}>
                <MapPin size={18} style={{ color: 'var(--accent-orange)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{log.address}</span>
              </div>
            )}

            {/* Recommended Dishes */}
            {log.recommended_dishes && log.recommended_dishes.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <UtensilsCrossed size={14} /> 推荐招牌菜品
                </h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {log.recommended_dishes.map((dish, i) => (
                    <span key={i} style={{
                      background: 'rgba(255, 111, 67, 0.12)', color: 'var(--accent-orange)',
                      padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600,
                      border: '1px solid rgba(255, 111, 67, 0.2)'
                    }}>
                      👍 {dish}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes / Journal */}
            {log.notes && (
              <div>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  ✍️ 美食心得与评价
                </h4>
                <div style={{
                  background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: '1.6',
                  fontStyle: 'italic', borderLeft: '4px solid var(--accent-orange)'
                }}>
                  "{log.notes}"
                </div>
              </div>
            )}

            {/* Footer Information & Delete Button */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              paddingTop: '16px', borderTop: '1px solid var(--glass-border)', marginTop: '8px'
            }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} /> 用餐日期：{log.dining_date}
              </span>
              {onDelete && (
                <button
                  onClick={() => {
                    onDelete(log.id);
                    onClose();
                  }}
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)', color: '#dc2626',
                    padding: '6px 14px', borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px'
                  }}
                >
                  <Trash2 size={14} /> 删除本条食记
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
