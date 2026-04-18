import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface Props {
  onAuth: (username: string, avatar: string) => void;
}

const AVATARS = ['🤖', '👾', '🐉', '🦊', '🌑', '⭐', '🔮', '💀', '🐺', '🦁', '🦄', '🎮', '🔥', '⚡', '🌊', '🎯'];

type AuthMode = 'login' | 'register';

export default function AuthScreen({ onAuth }: Props) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🤖');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const triggerShake = (msg: string) => {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || username.trim().length < 3) {
      triggerShake('Никнейм должен быть минимум 3 символа');
      return;
    }
    if (password.length < 6) {
      triggerShake('Пароль — минимум 6 символов');
      return;
    }
    if (mode === 'register' && password !== confirmPassword) {
      triggerShake('Пароли не совпадают');
      return;
    }

    onAuth(username.trim(), selectedAvatar);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center overflow-hidden"
      style={{ background: 'var(--dark-bg)' }}>

      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,231,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,231,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }} />

      {/* Glow blobs */}
      <div className="absolute w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,255,231,0.04) 0%, transparent 70%)', top: '-10%', left: '-10%' }} />
      <div className="absolute w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(191,0,255,0.04) 0%, transparent 70%)', bottom: '-10%', right: '-10%' }} />

      {/* Card */}
      <div
        className={`relative w-full max-w-sm mx-4 animate-fade-in-up ${shake ? 'animate-glitch' : ''}`}
        style={{
          background: 'var(--panel-bg)',
          border: '1px solid rgba(0,255,231,0.15)',
          borderRadius: '1.5rem',
          boxShadow: '0 0 40px rgba(0,255,231,0.06), 0 24px 60px rgba(0,0,0,0.6)',
        }}
      >
        {/* Top accent line */}
        <div className="h-[2px] w-full rounded-t-3xl"
          style={{ background: 'linear-gradient(90deg, transparent, var(--neon-cyan), var(--neon-purple), transparent)' }} />

        <div className="px-8 pt-8 pb-8">
          {/* Logo */}
          <div className="flex flex-col items-center gap-1 mb-7">
            <div className="w-14 h-14 flex items-center justify-center rounded-2xl mb-1"
              style={{
                background: 'rgba(0,255,231,0.08)',
                border: '1px solid rgba(0,255,231,0.2)',
                boxShadow: '0 0 20px rgba(0,255,231,0.1)',
              }}>
              <span className="font-orbitron font-black text-2xl neon-text-cyan">NX</span>
            </div>
            <h1 className="font-orbitron font-black text-xl tracking-widest neon-text-cyan">NEXUS</h1>
            <p className="font-rajdhani text-xs tracking-[0.25em] uppercase" style={{ color: 'rgba(0,255,231,0.35)' }}>
              {mode === 'login' ? 'Добро пожаловать назад' : 'Создать аккаунт'}
            </p>
          </div>

          {/* Mode toggle */}
          <div className="flex p-1 rounded-xl mb-6"
            style={{ background: 'var(--surface)' }}>
            {(['login', 'register'] as AuthMode[]).map(m => (
              <button key={m}
                onClick={() => { setMode(m); setError(''); }}
                className="flex-1 py-2 rounded-lg font-rajdhani font-bold text-sm tracking-wider transition-all duration-200"
                style={mode === m
                  ? { background: 'var(--surface2)', color: 'var(--neon-cyan)', border: '1px solid rgba(0,255,231,0.25)', boxShadow: '0 0 10px rgba(0,255,231,0.1)' }
                  : { color: '#555' }}>
                {m === 'login' ? 'ВОЙТИ' : 'РЕГИСТРАЦИЯ'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Avatar picker — only on register */}
            {mode === 'register' && (
              <div className="animate-fade-in-up">
                <label className="block text-xs font-rajdhani tracking-widest uppercase mb-2"
                  style={{ color: 'rgba(0,255,231,0.45)' }}>
                  Выбери аватар
                </label>
                <div className="grid grid-cols-8 gap-1.5">
                  {AVATARS.map(a => (
                    <button key={a} type="button"
                      onClick={() => setSelectedAvatar(a)}
                      className="w-9 h-9 flex items-center justify-center text-xl rounded-xl transition-all duration-150 hover:scale-110"
                      style={selectedAvatar === a
                        ? { background: 'rgba(0,255,231,0.15)', border: '2px solid var(--neon-cyan)', boxShadow: '0 0 8px var(--neon-cyan)' }
                        : { background: 'var(--surface2)', border: '2px solid transparent' }}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-xs font-rajdhani tracking-widest uppercase mb-1.5"
                style={{ color: 'rgba(0,255,231,0.45)' }}>
                Никнейм
              </label>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all"
                style={{
                  background: 'var(--surface)',
                  border: `1px solid ${username ? 'rgba(0,255,231,0.3)' : 'rgba(0,255,231,0.1)'}`,
                }}>
                {mode === 'register' && (
                  <span className="text-xl flex-shrink-0">{selectedAvatar}</span>
                )}
                <Icon name="AtSign" size={15} className="text-gray-600 flex-shrink-0" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="твой_никнейм"
                  autoComplete="username"
                  className="flex-1 bg-transparent outline-none text-sm text-gray-200 placeholder-gray-600 font-rajdhani font-medium tracking-wider"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-rajdhani tracking-widest uppercase mb-1.5"
                style={{ color: 'rgba(0,255,231,0.45)' }}>
                Пароль
              </label>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all"
                style={{
                  background: 'var(--surface)',
                  border: `1px solid ${password ? 'rgba(0,255,231,0.3)' : 'rgba(0,255,231,0.1)'}`,
                }}>
                <Icon name="Lock" size={15} className="text-gray-600 flex-shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  className="flex-1 bg-transparent outline-none text-sm text-gray-200 placeholder-gray-600 font-rajdhani"
                />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="opacity-50 hover:opacity-100 transition-opacity flex-shrink-0">
                  <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={14} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Confirm password */}
            {mode === 'register' && (
              <div className="animate-fade-in-up">
                <label className="block text-xs font-rajdhani tracking-widest uppercase mb-1.5"
                  style={{ color: 'rgba(0,255,231,0.45)' }}>
                  Повтори пароль
                </label>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all"
                  style={{
                    background: 'var(--surface)',
                    border: `1px solid ${confirmPassword
                      ? confirmPassword === password ? 'rgba(0,255,231,0.4)' : 'rgba(255,0,110,0.4)'
                      : 'rgba(0,255,231,0.1)'}`,
                  }}>
                  <Icon name="ShieldCheck" size={15} className="text-gray-600 flex-shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="flex-1 bg-transparent outline-none text-sm text-gray-200 placeholder-gray-600 font-rajdhani"
                  />
                  {confirmPassword && (
                    <Icon
                      name={confirmPassword === password ? 'Check' : 'X'}
                      size={14}
                      className={confirmPassword === password ? 'text-green-400' : 'text-pink-500'}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl animate-fade-in-up"
                style={{ background: 'rgba(255,0,110,0.08)', border: '1px solid rgba(255,0,110,0.25)' }}>
                <Icon name="AlertTriangle" size={13} className="text-pink-500 flex-shrink-0" />
                <p className="text-xs font-rajdhani text-pink-400">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button type="submit"
              className="w-full py-3 rounded-xl font-orbitron font-bold text-sm tracking-widest uppercase transition-all duration-200 mt-1 hover:scale-[1.02] active:scale-[0.98] clip-corner-sm"
              style={{
                background: 'linear-gradient(135deg, var(--neon-cyan), rgba(0,200,180,0.8))',
                color: 'var(--dark-bg)',
                boxShadow: '0 0 20px rgba(0,255,231,0.25)',
              }}>
              {mode === 'login' ? '▶ ВОЙТИ' : '▶ СОЗДАТЬ АККАУНТ'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
