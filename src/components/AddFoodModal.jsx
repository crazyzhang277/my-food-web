import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Star, Upload, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getCurrentLocationWithCity } from '../services/geoService';
import { uploadFoodImage, createFoodLog } from '../services/foodService';

export function AddFoodModal({ isOpen, onClose, onSuccess }) {
  const { user, openAuthModal } = useAuth();
  
  const [restaurantName, setRestaurantName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [rating, setRating] = useState(5);
  const [price, setPrice] = useState('');
  const [dishesInput, setDishesInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [notes, setNotes] = useState('');
  const [diningDate, setDiningDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleFetchLocation = async () => {
    setLocating(true);
    try {
      const loc = await getCurrentLocationWithCity();
      setLatitude(loc.lat);
      setLongitude(loc.lng);
      setCity(loc.city);
      if (loc.address) setAddress(loc.address);
    } catch (err) {
      setErrorMsg(err.message || '获取定位失败');
    } finally {
      setLocating(false);
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setSelectedFiles(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      onClose();
      openAuthModal();
      return;
    }

    if (!restaurantName.trim()) {
      setErrorMsg('请输入餐厅或菜品名称');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      // 1. Upload images to Supabase Storage if user selected any
      const uploadedUrls = [];
      for (const file of selectedFiles) {
        const url = await uploadFoodImage(file, user.id);
        uploadedUrls.push(url);
      }

      // 2. Format tags and recommended dishes
      const recommended_dishes = dishesInput ? dishesInput.split(/[,，\s]+/).filter(Boolean) : [];
      const tags = tagsInput ? tagsInput.split(/[,，\s]+/).filter(Boolean) : [];

      // 3. Create food log row
      await createFoodLog({
        user_id: user.id,
        title: restaurantName,
        restaurant_name: restaurantName,
        city: city || '未指定城市',
        address: address,
        latitude: latitude,
        longitude: longitude,
        rating: Number(rating),
        price_per_person: price ? Number(price) : null,
        recommended_dishes,
        tags,
        image_urls: uploadedUrls, // Only store user uploaded images
        notes: notes,
        dining_date: diningDate
      });

      onSuccess();
      onClose();
    } catch (err) {
      setErrorMsg(err.message || '保存日志失败，请检查网络');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="modal-overlay" style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        backgroundColor: 'rgba(45, 37, 34, 0.45)', backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
      }}>
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          style={{
            background: 'var(--card-bg)',
            borderTopLeftRadius: 'var(--radius-lg)',
            borderTopRightRadius: 'var(--radius-lg)',
            width: '100%', maxWidth: '600px', maxHeight: '90vh',
            overflowY: 'auto', padding: '24px', position: 'relative'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--text-primary)' }}>🍜 记录一份美食</h2>
            <button onClick={onClose} style={{ background: 'none', color: 'var(--text-muted)' }}><X size={24} /></button>
          </div>

          {errorMsg && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#dc2626', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px'
            }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Photo Upload Zone */}
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
                美食照片 (支持多张全套大图上传)
              </label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {previewUrls.map((url, idx) => (
                  <div key={idx} style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
                    <img src={url} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button type="button" onClick={() => removeImage(idx)} style={{
                      position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.6)',
                      color: '#fff', borderRadius: '50%', padding: '2px'
                    }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <label style={{
                  width: '80px', height: '80px', borderRadius: '12px',
                  border: '2px dashed var(--glass-border)', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)',
                  background: 'var(--bg-primary)'
                }}>
                  <Upload size={20} />
                  <span style={{ fontSize: '0.7rem', marginTop: '4px' }}>添加照片</span>
                  <input type="file" accept="image/*" multiple onChange={handleImageSelect} style={{ display: 'none' }} />
                </label>
              </div>
            </div>

            {/* Restaurant Name */}
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>餐厅 / 美食名称 *</label>
              <input
                type="text" required placeholder="如：蜀大侠老火锅 / 抹茶芭菲"
                value={restaurantName} onChange={e => setRestaurantName(e.target.value)}
                style={{
                  width: '100%', padding: '12px', background: 'var(--bg-primary)',
                  border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)'
                }}
              />
            </div>

            {/* GPS City & Address */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>城市与定位</label>
                <button type="button" onClick={handleFetchLocation} disabled={locating} style={{
                  background: 'none', color: 'var(--accent-orange)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                  {locating ? <Loader2 size={14} className="animate-spin" /> : <MapPin size={14} />}
                  {locating ? '自动解析中...' : 'GPS 自动定位'}
                </button>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text" placeholder="城市（如：广州市）" value={city} onChange={e => setCity(e.target.value)}
                  style={{
                    width: '140px', padding: '10px', background: 'var(--bg-primary)',
                    border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)'
                  }}
                />
                <input
                  type="text" placeholder="详细地址 / 地标" value={address} onChange={e => setAddress(e.target.value)}
                  style={{
                    flex: 1, padding: '10px', background: 'var(--bg-primary)',
                    border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)'
                  }}
                />
              </div>
            </div>

            {/* Rating & Price */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>星级评分</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <motion.button
                      key={star} type="button" whileTap={{ scale: 1.3 }}
                      onClick={() => setRating(star)}
                      style={{ background: 'none', color: star <= rating ? 'var(--accent-amber)' : 'var(--text-muted)' }}
                    >
                      <Star size={24} fill={star <= rating ? 'var(--accent-amber)' : 'none'} />
                    </motion.button>
                  ))}
                </div>
              </div>
              <div style={{ width: '130px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>人均消费 (￥)</label>
                <input
                  type="number" placeholder="88" value={price} onChange={e => setPrice(e.target.value)}
                  style={{
                    width: '100%', padding: '10px', background: 'var(--bg-primary)',
                    border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)'
                  }}
                />
              </div>
            </div>

            {/* Dishes & Tags */}
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>推荐菜品 (用逗号分隔)</label>
              <input
                type="text" placeholder="毛肚, 鸭肠, 冰粉" value={dishesInput} onChange={e => setDishesInput(e.target.value)}
                style={{
                  width: '100%', padding: '10px', background: 'var(--bg-primary)',
                  border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)'
                }}
              />
            </div>

            {/* Notes */}
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>食记与心得</label>
              <textarea
                rows={3} placeholder="环境优雅，味道正宗..." value={notes} onChange={e => setNotes(e.target.value)}
                style={{
                  width: '100%', padding: '10px', background: 'var(--bg-primary)',
                  border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', resize: 'none'
                }}
              />
            </div>

            <button
              type="submit" disabled={submitting}
              style={{
                width: '100%', padding: '14px', marginTop: '8px',
                background: 'var(--accent-gradient)', color: '#fff', fontWeight: 700,
                borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-glow)'
              }}
            >
              {submitting ? '保存云端中...' : '发布美食记录'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
