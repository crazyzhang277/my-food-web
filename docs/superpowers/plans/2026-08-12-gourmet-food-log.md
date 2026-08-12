# Gourmet Food Log Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first, high-end responsive web application for logging personal gourmet food experiences with Supabase cloud database & image storage, mandatory user authentication, auto GPS reverse-geocoding city detection, and Framer Motion spring micro-animations.

**Architecture:** A Vite + React 18 frontend leveraging `@supabase/supabase-js` for authentication, cloud Postgres persistence, and image file storage. Geolocation is handled via HTML5 `navigator.geolocation` paired with OpenStreetMap Nominatim reverse geocoding. High-end visual design is implemented using CSS custom properties with glassmorphism effects and Framer Motion spring physics.

**Tech Stack:** React 18, Vite, Supabase Client (`@supabase/supabase-js`), Framer Motion (`framer-motion`), Lucide Icons (`lucide-react`), `browser-image-compression`, Vanilla CSS Modules.

## Global Constraints
- Target platform: Mobile-first responsive web application
- Color Palette: Amber Glow (`#FF6B35` -> `#F59E0B`), Charcoal Slate (`#0F1117`), Dark Card (`#181B24`), Glass Surface (`rgba(24,27,36,0.7)`)
- Mandatory Auth: Users MUST be logged in to create or edit food logs
- No TBD, TODO, or vague placeholders in any component or service

---

### Task 1: Project Setup & Design System Tokens

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.jsx`
- Create: `src/index.css`
- Create: `src/styles/theme.css`

**Interfaces:**
- Consumes: Google Fonts (`Outfit`, `Plus Jakarta Sans`, `Inter`, `Noto Sans SC`)
- Produces: Base CSS design tokens (`--bg-primary`, `--accent-primary`, `--glass-bg`, `--font-heading`, `--font-body`)

- [ ] **Step 1: Create package.json with exact dependencies**

```json
{
  "name": "gourmet-food-log",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.39.8",
    "browser-image-compression": "^2.0.2",
    "framer-motion": "^11.0.8",
    "lucide-react": "^0.344.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.1.4"
  }
}
```

- [ ] **Step 2: Create vite.config.js**

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  }
});
```

- [ ] **Step 3: Create index.html with Google Fonts link**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>Gourmet Food Log | 个人美食记忆库</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+SC:wght@300;400;500;700&family=Outfit:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@500;700;800&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 4: Create src/styles/theme.css design tokens**

```css
:root {
  --bg-primary: #0f1117;
  --bg-secondary: #161922;
  --card-bg: #181b24;
  --glass-bg: rgba(24, 27, 36, 0.75);
  --glass-border: rgba(255, 255, 255, 0.08);
  
  --accent-orange: #ff6b35;
  --accent-amber: #f59e0b;
  --accent-gradient: linear-gradient(135deg, #ff6b35 0%, #f59e0b 100%);
  --accent-glow: rgba(255, 107, 53, 0.25);

  --text-primary: #f9fafb;
  --text-secondary: #9ca3af;
  --text-muted: #6b7280;

  --font-heading: 'Outfit', 'Plus Jakarta Sans', 'Noto Sans SC', sans-serif;
  --font-body: 'Inter', 'Noto Sans SC', sans-serif;

  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-full: 9999px;

  --shadow-card: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
  --shadow-glow: 0 8px 25px rgba(255, 107, 53, 0.3);
}
```

- [ ] **Step 5: Create src/index.css global styles**

```css
@import './styles/theme.css';

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-body);
  min-height: 100vh;
  overflow-x: hidden;
}

button {
  font-family: inherit;
  border: none;
  outline: none;
  cursor: pointer;
}

input, textarea, select {
  font-family: inherit;
  outline: none;
}
```

- [ ] **Step 6: Install dependencies & test build scaffolding**

Run: `npm install`
Expected: Successful package resolution without errors.

- [ ] **Step 7: Commit Task 1**

```bash
git add package.json vite.config.js index.html src/
git commit -m "feat: initialize Vite project with high-end design system tokens"
```

---

### Task 2: Supabase Client & Auth State Management

**Files:**
- Create: `src/lib/supabase.js`
- Create: `src/context/AuthContext.jsx`
- Create: `src/components/AuthModal.jsx`

**Interfaces:**
- Consumes: Environment variables `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Produces: `useAuth()` hook delivering `{ user, session, loading, signUp, signIn, signOut, openAuthModal }`

- [ ] **Step 1: Create src/lib/supabase.js**

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

- [ ] **Step 2: Create src/context/AuthContext.jsx**

```javascript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } }
    });
    if (error) throw error;
    return data;
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      isAuthModalOpen,
      openAuthModal,
      closeAuthModal
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

- [ ] **Step 3: Create src/components/AuthModal.jsx**

```javascript
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, User, UtensilsCrossed } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    try {
      if (isSignUp) {
        await signUp(email, password, username);
      } else {
        await signIn(email, password);
      }
      closeAuthModal();
    } catch (err) {
      setErrorMsg(err.message || '操作失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="modal-overlay" style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-lg)',
            width: '100%', maxWidth: '400px', padding: '24px',
            boxShadow: 'var(--shadow-card)', position: 'relative'
          }}
        >
          <button onClick={closeAuthModal} style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'none', color: 'var(--text-muted)'
          }}>
            <X size={20} />
          </button>

          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: 'var(--accent-gradient)', display: 'inline-flex',
              alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '12px'
            }}>
              <UtensilsCrossed size={24} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem' }}>
              {isSignUp ? '注册 Gourmet Account' : '登录美食回忆库'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
              必须登录才能新增和储存你的专属食记
            </p>
          </div>

          {errorMsg && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px'
            }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {isSignUp && (
              <div className="input-group" style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                <input
                  type="text" required placeholder="用户昵称"
                  value={username} onChange={e => setUsername(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px 10px 40px',
                    background: 'var(--bg-primary)', border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-sm)', color: '#fff'
                  }}
                />
              </div>
            )}
            <div className="input-group" style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type="email" required placeholder="邮箱地址"
                value={email} onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%', padding: '10px 12px 10px 40px',
                  background: 'var(--bg-primary)', border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-sm)', color: '#fff'
                }}
              />
            </div>
            <div className="input-group" style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type="password" required placeholder="密码"
                value={password} onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%', padding: '10px 12px 10px 40px',
                  background: 'var(--bg-primary)', border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-sm)', color: '#fff'
                }}
              />
            </div>

            <button
              type="submit" disabled={submitting}
              style={{
                width: '100%', padding: '12px', marginTop: '6px',
                background: 'var(--accent-gradient)', color: '#fff', fontWeight: 600,
                borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-glow)'
              }}
            >
              {submitting ? '处理中...' : (isSignUp ? '立即注册' : '登录账户')}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {isSignUp ? '已有账号？' : '还没有账号？'}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              style={{ background: 'none', color: 'var(--accent-orange)', fontWeight: 600, marginLeft: '6px' }}
            >
              {isSignUp ? '直接登录' : '立即注册'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
```

- [ ] **Step 4: Commit Task 2**

```bash
git add src/lib/supabase.js src/context/AuthContext.jsx src/components/AuthModal.jsx
git commit -m "feat: implement Supabase Auth context and login/register modal"
```

---

### Task 3: Geolocation & Reverse-Geocoding Service

**Files:**
- Create: `src/services/geoService.js`

**Interfaces:**
- Produces: `getCurrentLocationWithCity()` returning `{ lat, lng, city, address, raw }`

- [ ] **Step 1: Create src/services/geoService.js**

```javascript
/**
 * Reverse-geocode latitude and longitude to city and detailed address using Nominatim API.
 */
export async function reverseGeocode(lat, lng) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=zh`,
      { headers: { 'User-Agent': 'GourmetFoodLogApp/1.0' } }
    );
    if (!response.ok) throw new Error('Failed to fetch address');
    const data = await response.json();
    const addressObj = data.address || {};
    
    // Extract city (handling Municipality vs Normal City)
    const city = addressObj.city || addressObj.town || addressObj.county || addressObj.state || '未知城市';
    const road = addressObj.road || addressObj.suburb || addressObj.neighbourhood || '';
    const fullAddress = `${city} ${road}`.trim();

    return { city, address: fullAddress, raw: data };
  } catch (err) {
    console.warn('Reverse geocoding error:', err);
    return { city: '未知城市', address: '', raw: null };
  }
}

/**
 * Capture browser GPS coordinates and auto-fetch city name.
 */
export function getCurrentLocationWithCity() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('您的浏览器不支持 GPS 地理定位'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const geoResult = await reverseGeocode(lat, lng);
        resolve({
          lat,
          lng,
          city: geoResult.city,
          address: geoResult.address
        });
      },
      (error) => {
        let msg = '定位获取失败';
        if (error.code === error.PERMISSION_DENIED) msg = '地理定位权限被拒绝';
        reject(new Error(msg));
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  });
}
```

- [ ] **Step 2: Commit Task 3**

```bash
git add src/services/geoService.js
git commit -m "feat: add GPS geolocation and reverse geocoding service"
```

---

### Task 4: Supabase Data & Storage Service Layer

**Files:**
- Create: `src/services/foodService.js`

**Interfaces:**
- Produces: `uploadImage(file, userId)`, `fetchFoodLogs(userId)`, `createFoodLog(logData)`, `deleteFoodLog(logId)`

- [ ] **Step 1: Create src/services/foodService.js**

```javascript
import { supabase } from '../lib/supabase';
import imageCompression from 'browser-image-compression';

/**
 * Compress image on client-side before uploading.
 */
export async function compressImage(file) {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1600,
    useWebWorker: true
  };
  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.warn('Image compression fallback:', error);
    return file;
  }
}

/**
 * Upload single image to Supabase Storage bucket 'food-images'
 */
export async function uploadFoodImage(file, userId) {
  const compressedFile = await compressImage(file);
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('food-images')
    .upload(fileName, compressedFile, { cacheControl: '3600', upsert: true });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('food-images')
    .getPublicUrl(data.path);

  return publicUrl;
}

/**
 * Fetch all food logs for current logged-in user
 */
export async function fetchFoodLogs() {
  const { data, error } = await supabase
    .from('food_logs')
    .select('*')
    .order('dining_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Create a new food log
 */
export async function createFoodLog(logData) {
  const { data, error } = await supabase
    .from('food_logs')
    .insert([logData])
    .select();

  if (error) throw error;
  return data[0];
}

/**
 * Delete a food log by ID
 */
export async function deleteFoodLog(id) {
  const { error } = await supabase
    .from('food_logs')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}
```

- [ ] **Step 2: Commit Task 4**

```bash
git add src/services/foodService.js
git commit -m "feat: implement food service CRUD and image compression upload pipeline"
```

---

### Task 5: Food Log Form Modal Component

**Files:**
- Create: `src/components/AddFoodModal.jsx`

**Interfaces:**
- Consumes: `useAuth()`, `getCurrentLocationWithCity()`, `uploadFoodImage()`, `createFoodLog()`
- Produces: Floating `+` action trigger and full-featured Add Food Record Drawer/Modal

- [ ] **Step 1: Create src/components/AddFoodModal.jsx**

```javascript
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Star, Upload, Plus, Trash2, Loader2, DollarSign, Calendar } from 'lucide-react';
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
      // 1. Upload images to Supabase Storage
      const uploadedUrls = [];
      for (const file of selectedFiles) {
        const url = await uploadFoodImage(file, user.id);
        uploadedUrls.push(url);
      }

      // Fallback demo image if no file uploaded
      if (uploadedUrls.length === 0) {
        uploadedUrls.push('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80');
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
        image_urls: uploadedUrls,
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
        backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(10px)',
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
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem' }}>🍜 记录一份美食</h2>
            <button onClick={onClose} style={{ background: 'none', color: 'var(--text-muted)' }}><X size={24} /></button>
          </div>

          {errorMsg && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px'
            }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Photo Upload Zone */}
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>美食照片</label>
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
                  alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)'
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
                  border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: '#fff'
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
                  type="text" placeholder="城市（如：成都）" value={city} onChange={e => setCity(e.target.value)}
                  style={{
                    width: '120px', padding: '10px', background: 'var(--bg-primary)',
                    border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', color: '#fff'
                  }}
                />
                <input
                  type="text" placeholder="详细地址 / 地标" value={address} onChange={e => setAddress(e.target.value)}
                  style={{
                    flex: 1, padding: '10px', background: 'var(--bg-primary)',
                    border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', color: '#fff'
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
                    border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', color: '#fff'
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
                  border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', color: '#fff'
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
                  border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', color: '#fff', resize: 'none'
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
```

- [ ] **Step 2: Commit Task 5**

```bash
git add src/components/AddFoodModal.jsx
git commit -m "feat: implement AddFoodModal drawer with GPS auto-location and image selector"
```

---

### Task 6: Food Feed Card Gallery & Filter Header

**Files:**
- Create: `src/components/FoodCard.jsx`
- Create: `src/components/FilterBar.jsx`

**Interfaces:**
- Produces: `FoodCard` component with spring animations, `FilterBar` component for city pills and search input

- [ ] **Step 1: Create src/components/FoodCard.jsx**

```javascript
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
      <div style={{ height: '180px', width: '100%', position: 'relative', overflow: 'hidden' }}>
        <img src={imageUrl} alt={log.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{
          position: 'absolute', top: '12px', right: '12px',
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
          borderRadius: 'var(--radius-full)', padding: '4px 10px',
          display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-amber)', fontSize: '0.85rem'
        }}>
          <Star size={14} fill="var(--accent-amber)" />
          <span style={{ fontWeight: 700 }}>{log.rating}.0</span>
        </div>
        <div style={{
          position: 'absolute', bottom: '12px', left: '12px',
          background: 'var(--accent-gradient)', color: '#fff',
          borderRadius: 'var(--radius-full)', padding: '2px 10px', fontSize: '0.75rem', fontWeight: 600
        }}>
          📍 {log.city}
        </div>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700 }}>{log.title}</h3>
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
                background: 'rgba(255, 107, 53, 0.12)', color: 'var(--accent-orange)',
                padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem'
              }}>
                👍 {dish}
              </span>
            ))}
          </div>
        )}

        {log.notes && (
          <p style={{
            color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '10px',
            lineHeight: '1.4', background: 'var(--bg-primary)', padding: '8px 10px', borderRadius: '8px'
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
```

- [ ] **Step 2: Create src/components/FilterBar.jsx**

```javascript
import React from 'react';
import { Search, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export function FilterBar({ cities, selectedCity, onSelectCity, searchQuery, onSearchChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
      {/* Search Input */}
      <div style={{ position: 'relative', width: '100%' }}>
        <Search size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
        <input
          type="text" placeholder="搜索餐厅、菜品、或心得..."
          value={searchQuery} onChange={e => onSearchChange(e.target.value)}
          style={{
            width: '100%', padding: '12px 14px 12px 42px',
            background: 'var(--card-bg)', border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-full)', color: '#fff', boxShadow: 'var(--shadow-card)'
          }}
        />
      </div>

      {/* City Pills Horizontal Scroll */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        <button
          onClick={() => onSelectCity('')}
          style={{
            padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem',
            background: selectedCity === '' ? 'var(--accent-gradient)' : 'var(--card-bg)',
            color: selectedCity === '' ? '#fff' : 'var(--text-secondary)',
            border: '1px solid var(--glass-border)', whiteSpace: 'nowrap'
          }}
        >
          全部城市
        </button>
        {cities.map(c => (
          <button
            key={c} onClick={() => onSelectCity(c)}
            style={{
              padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem',
              background: selectedCity === c ? 'var(--accent-gradient)' : 'var(--card-bg)',
              color: selectedCity === c ? '#fff' : 'var(--text-secondary)',
              border: '1px solid var(--glass-border)', whiteSpace: 'nowrap'
            }}
          >
            📍 {c}
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit Task 6**

```bash
git add src/components/FoodCard.jsx src/components/FilterBar.jsx
git commit -m "feat: add FoodCard gallery item and FilterBar city search component"
```

---

### Task 7: Main App Layout & Integration

**Files:**
- Create: `src/App.jsx`

**Interfaces:**
- Assembles: `AuthProvider`, `AuthModal`, `AddFoodModal`, `FoodCard`, `FilterBar`

- [ ] **Step 1: Create src/App.jsx**

```javascript
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { AddFoodModal } from './components/AddFoodModal';
import { FoodCard } from './components/FoodCard';
import { FilterBar } from './components/FilterBar';
import { fetchFoodLogs, deleteFoodLog } from './services/foodService';
import { Plus, Utensils, LogOut, User, Sparkles } from 'lucide-react';

function MainApp() {
  const { user, openAuthModal, signOut } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    if (!user) {
      setLogs([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchFoodLogs();
      setLogs(data);
    } catch (err) {
      console.error('Error loading food logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm('确定要删除这份美食记录吗？')) {
      await deleteFoodLog(id);
      loadData();
    }
  };

  const handleOpenAdd = () => {
    if (!user) {
      openAuthModal();
    } else {
      setIsAddModalOpen(true);
    }
  };

  // Derive unique cities
  const cities = Array.from(new Set(logs.map(l => l.city).filter(Boolean)));

  // Filter logs
  const filteredLogs = logs.filter(l => {
    const matchCity = !selectedCity || l.city === selectedCity;
    const matchQuery = !searchQuery || 
      l.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.city?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCity && matchQuery;
  });

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '100px' }}>
      {/* Header Bar */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'var(--glass-bg)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--glass-border)', padding: '16px 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'var(--accent-gradient)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: '#fff'
          }}>
            <Utensils size={20} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800 }}>
            Gourmet<span style={{ color: 'var(--accent-orange)' }}>Log</span>
          </h1>
        </div>

        <div>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {user.user_metadata?.username || user.email?.split('@')[0]}
              </span>
              <button onClick={signOut} style={{ background: 'none', color: 'var(--text-muted)' }}>
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              style={{
                background: 'var(--accent-gradient)', color: '#fff', padding: '6px 16px',
                borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600
              }}
            >
              登录 / 注册
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '20px 16px' }}>
        {/* Intro / Stats Hero */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,107,53,0.12) 0%, rgba(245,158,11,0.05) 100%)',
          border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)',
          padding: '20px', marginBottom: '24px', position: 'relative', overflow: 'hidden'
        }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '6px' }}>
            🍽️ 我的私房美食记忆库
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            已记录 <strong style={{ color: 'var(--accent-orange)' }}>{logs.length}</strong> 份美食打卡，打卡 <strong style={{ color: 'var(--accent-amber)' }}>{cities.length}</strong> 个城市
          </p>
        </div>

        {/* Filter Bar */}
        <FilterBar
          cities={cities}
          selectedCity={selectedCity}
          onSelectCity={setSelectedCity}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Feed Cards */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            正在连接 Supabase 加载美食档案...
          </div>
        ) : !user ? (
          <div style={{
            textAlign: 'center', padding: '60px 20px', background: 'var(--card-bg)',
            borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)'
          }}>
            <Sparkles size={40} style={{ color: 'var(--accent-orange)', marginBottom: '12px' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '8px' }}>必须要登录才能开启美食记录</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
              注册并登录你的云端账号，随时同步照片与地图定位
            </p>
            <button
              onClick={openAuthModal}
              style={{
                background: 'var(--accent-gradient)', color: '#fff', padding: '10px 24px',
                borderRadius: 'var(--radius-full)', fontWeight: 600
              }}
            >
              立即登录 / 注册
            </button>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px 20px', background: 'var(--card-bg)',
            borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)'
          }}>
            <p style={{ color: 'var(--text-secondary)' }}>暂无符合条件的美食记录，点击下方 `+` 开启第一次打卡！</p>
          </div>
        ) : (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px'
          }}>
            {filteredLogs.map(log => (
              <FoodCard key={log.id} log={log} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>

      {/* Floating Add Button */}
      <button
        onClick={handleOpenAdd}
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 90,
          width: '56px', height: '56px', borderRadius: '50%',
          background: 'var(--accent-gradient)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--shadow-glow)', border: 'none'
        }}
      >
        <Plus size={28} />
      </button>

      {/* Modals */}
      <AuthModal />
      <AddFoodModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
```

- [ ] **Step 2: Update src/main.jsx to mount App component**

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 3: Commit Task 7**

```bash
git add src/App.jsx src/main.jsx
git commit -m "feat: complete MainApp integration with floating add trigger and cloud feed"
```

---

### Task 8: Verification & Build Validation

**Files:**
- Test application runtime & build output

- [ ] **Step 1: Test production build**

Run: `npm run build`
Expected: Clean compilation with dist folder generated without syntax or import errors.

- [ ] **Step 2: Commit final build validation**

```bash
git add .
git commit -m "chore: verify build readiness"
```
