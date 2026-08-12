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
