import React from 'react';
import { Search } from 'lucide-react';

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
            borderRadius: 'var(--radius-full)', color: 'var(--text-primary)', boxShadow: 'var(--shadow-card)'
          }}
        />
      </div>

      {/* City Pills Horizontal Scroll */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        <button
          onClick={() => onSelectCity('')}
          style={{
            padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600,
            background: selectedCity === '' ? 'var(--accent-gradient)' : 'var(--card-bg)',
            color: selectedCity === '' ? '#fff' : 'var(--text-secondary)',
            border: '1px solid var(--glass-border)', whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          全部城市
        </button>
        {cities.map(c => (
          <button
            key={c} onClick={() => onSelectCity(c)}
            style={{
              padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600,
              background: selectedCity === c ? 'var(--accent-gradient)' : 'var(--card-bg)',
              color: selectedCity === c ? '#fff' : 'var(--text-secondary)',
              border: '1px solid var(--glass-border)', whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            📍 {c}
          </button>
        ))}
      </div>
    </div>
  );
}
