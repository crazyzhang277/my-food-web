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
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);
    try {
      if (isSignUp) {
        const data = await signUp(email, password, username);
        if (data?.user && !data?.session) {
          setSuccessMsg('注册成功！请去邮箱查收确认邮件。若无需邮箱验证，可在 Supabase 控制台 Auth -> Email 中关闭 "Confirm email"。');
          setIsSignUp(false);
          setSubmitting(false);
          return;
        }
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
        backgroundColor: 'rgba(45, 37, 34, 0.45)',
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
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-primary)' }}>
              {isSignUp ? '注册 Gourmet Account' : '登录美食回忆库'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
              必须登录才能新增和储存你的专属食记
            </p>
          </div>

          {errorMsg && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#dc2626', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px'
            }}>
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div style={{
              background: 'rgba(34, 197, 94, 0.12)', border: '1px solid rgba(34, 197, 94, 0.3)',
              color: '#16a34a', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px'
            }}>
              {successMsg}
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
                    borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)'
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
                  borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)'
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
                  borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)'
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
