import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { AddFoodModal } from './components/AddFoodModal';
import { FoodDetailModal } from './components/FoodDetailModal';
import { SplashScreen } from './components/SplashScreen';
import { FoodCard } from './components/FoodCard';
import { FilterBar } from './components/FilterBar';
import { fetchFoodLogs, deleteFoodLog } from './services/foodService';
import { Plus, Utensils, LogOut, Sparkles } from 'lucide-react';

function MainApp() {
  const { user, openAuthModal, signOut } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedLogForDetail, setSelectedLogForDetail] = useState(null);
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
      {/* High-End Initial Opening Splash Screen */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Header Bar */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'var(--glass-bg)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--glass-border)', padding: '16px 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '12px',
            background: 'var(--accent-gradient)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: '#fff',
            boxShadow: '0 4px 12px rgba(255, 111, 67, 0.3)'
          }}>
            <Utensils size={20} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Gourmet<span style={{ color: 'var(--accent-orange)' }}>Log</span>
          </h1>
        </div>

        <div>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
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
                background: 'var(--accent-gradient)', color: '#fff', padding: '8px 18px',
                borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600,
                boxShadow: 'var(--shadow-glow)'
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
          background: 'linear-gradient(135deg, rgba(255, 111, 67, 0.08) 0%, rgba(255, 158, 44, 0.04) 100%)',
          border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)',
          padding: '20px', marginBottom: '24px', position: 'relative', overflow: 'hidden',
          boxShadow: '0 8px 24px -6px rgba(165, 140, 120, 0.08)'
        }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '6px', color: 'var(--text-primary)' }}>
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
            borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)',
            boxShadow: 'var(--shadow-card)'
          }}>
            <Sparkles size={40} style={{ color: 'var(--accent-orange)', marginBottom: '12px' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '8px', color: 'var(--text-primary)' }}>必须要登录才能开启美食记录</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
              注册并登录你的云端账号，随时同步照片与地图定位
            </p>
            <button
              onClick={openAuthModal}
              style={{
                background: 'var(--accent-gradient)', color: '#fff', padding: '10px 24px',
                borderRadius: 'var(--radius-full)', fontWeight: 600, boxShadow: 'var(--shadow-glow)'
              }}
            >
              立即登录 / 注册
            </button>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px 20px', background: 'var(--card-bg)',
            borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)',
            boxShadow: 'var(--shadow-card)'
          }}>
            <p style={{ color: 'var(--text-secondary)' }}>暂无符合条件的美食记录，点击下方 `+` 开启第一次打卡！</p>
          </div>
        ) : (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px'
          }}>
            {filteredLogs.map(log => (
              <FoodCard
                key={log.id}
                log={log}
                onDelete={handleDelete}
                onClickCard={(l) => setSelectedLogForDetail(l)}
              />
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
      <FoodDetailModal
        log={selectedLogForDetail}
        isOpen={!!selectedLogForDetail}
        onClose={() => setSelectedLogForDetail(null)}
        onDelete={handleDelete}
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
