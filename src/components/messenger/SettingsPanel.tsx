import { useState } from 'react';
import Icon from '@/components/ui/icon';
import type { UserProfile } from '@/pages/MessengerLayout';

interface Props {
  profile: UserProfile;
  onUpdate: (p: UserProfile) => void;
  onClose: () => void;
}

type SettingsTab = 'profile' | 'account' | 'status' | 'verification';

const AVATARS = ['👻', '🤖', '👾', '🐉', '🦊', '🌑', '⭐', '🔮', '💀', '🐺', '🦁', '🦄', '🎮', '🔥', '⚡', '🌊'];

const ROLES = ['Участник', 'Геймер', 'Стример', 'Разработчик', 'Модератор', 'Администратор', 'Легенда'];

const STATUS_OPTIONS: { value: UserProfile['status']; label: string; color: string; icon: string }[] = [
  { value: 'online',  label: 'Онлайн',       color: '#00ffe7', icon: '●' },
  { value: 'away',    label: 'Отошёл',        color: '#ffe600', icon: '◑' },
  { value: 'dnd',     label: 'Не беспокоить', color: '#ff006e', icon: '⊘' },
  { value: 'offline', label: 'Невидимка',     color: '#555',    icon: '○' },
];

export default function SettingsPanel({ profile, onUpdate, onClose }: Props) {
  const [tab, setTab] = useState<SettingsTab>('profile');
  const [draft, setDraft] = useState<UserProfile>({ ...profile });
  const [verifyStep, setVerifyStep] = useState<'idle' | 'code_sent' | 'verified'>('idle');
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onUpdate(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSendCode = () => {
    if (!draft.email.includes('@')) {
      setVerifyError('Введи корректный email');
      return;
    }
    setVerifyError('');
    setVerifyStep('code_sent');
  };

  const handleVerifyCode = () => {
    if (verifyCode === '000000' || verifyCode.length === 6) {
      setVerifyStep('verified');
      setDraft(prev => ({ ...prev, emailVerified: true }));
      onUpdate({ ...draft, emailVerified: true });
    } else {
      setVerifyError('Неверный код');
    }
  };

  const tabs: { id: SettingsTab; label: string; icon: string }[] = [
    { id: 'profile', label: 'Профиль', icon: 'User' },
    { id: 'account', label: 'Аккаунт', icon: 'Settings' },
    { id: 'status', label: 'Статус', icon: 'Circle' },
    { id: 'verification', label: 'Верификация', icon: 'ShieldCheck' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full max-w-2xl mx-4 animate-fade-in-up flex flex-col overflow-hidden"
        style={{
          background: 'var(--panel-bg)',
          border: '1px solid rgba(0,255,231,0.12)',
          borderRadius: '1.5rem',
          maxHeight: '90vh',
          boxShadow: '0 0 60px rgba(0,255,231,0.05), 0 30px 80px rgba(0,0,0,0.7)',
        }}>
        {/* Header */}
        <div className="flex-shrink-0">
          <div className="h-[2px]"
            style={{ background: 'linear-gradient(90deg, transparent, var(--neon-cyan), var(--neon-purple), transparent)' }} />
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-xl"
                style={{ background: 'rgba(0,255,231,0.1)', border: '1px solid rgba(0,255,231,0.2)' }}>
                <Icon name="Settings" size={16} className="text-cyan-400" />
              </div>
              <h2 className="font-orbitron font-bold text-base tracking-wider neon-text-cyan">НАСТРОЙКИ</h2>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-xl transition-all opacity-60 hover:opacity-100"
              style={{ background: 'var(--surface2)' }}>
              <Icon name="X" size={15} className="text-gray-400" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Sidebar tabs */}
          <div className="w-44 flex-shrink-0 border-r flex flex-col gap-1 p-3"
            style={{ borderColor: 'rgba(0,255,231,0.06)', background: 'var(--dark-bg)' }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all"
                style={tab === t.id
                  ? { background: 'rgba(0,255,231,0.1)', color: 'var(--neon-cyan)', border: '1px solid rgba(0,255,231,0.2)' }
                  : { color: '#555', border: '1px solid transparent' }}>
                <Icon name={t.icon} size={14} />
                <span className="font-rajdhani font-bold text-sm tracking-wide">{t.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6" style={{ scrollbarWidth: 'none' }}>

            {/* ── PROFILE TAB ── */}
            {tab === 'profile' && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-5 p-4 rounded-2xl"
                  style={{ background: 'var(--surface)', border: '1px solid var(--surface2)' }}>
                  <div className="w-16 h-16 flex items-center justify-center text-4xl rounded-2xl"
                    style={{ background: 'var(--surface2)', border: '2px solid rgba(0,255,231,0.2)' }}>
                    {draft.avatar}
                  </div>
                  <div>
                    <p className="font-orbitron font-bold text-lg neon-text-cyan">{draft.username}</p>
                    <p className="text-xs font-rajdhani mt-0.5" style={{ color: '#666' }}>
                      {draft.email || 'Email не привязан'} {draft.emailVerified && <span style={{ color: 'var(--neon-cyan)' }}>✓ верифицирован</span>}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-2 h-2 rounded-full"
                        style={{ background: STATUS_OPTIONS.find(s => s.value === draft.status)?.color }} />
                      <span className="text-xs" style={{ color: '#666' }}>
                        {STATUS_OPTIONS.find(s => s.value === draft.status)?.label}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-rajdhani tracking-widest uppercase mb-2"
                    style={{ color: 'rgba(0,255,231,0.4)' }}>Никнейм</label>
                  <input value={draft.username}
                    onChange={e => setDraft(p => ({ ...p, username: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none font-rajdhani text-gray-200"
                    style={{ background: 'var(--surface)', border: '1px solid rgba(0,255,231,0.15)' }}
                    placeholder="твой_никнейм" />
                </div>

                <div>
                  <label className="block text-xs font-rajdhani tracking-widest uppercase mb-2"
                    style={{ color: 'rgba(0,255,231,0.4)' }}>Аватар</label>
                  <div className="grid grid-cols-8 gap-2">
                    {AVATARS.map(a => (
                      <button key={a} type="button" onClick={() => setDraft(p => ({ ...p, avatar: a }))}
                        className="w-10 h-10 flex items-center justify-center text-2xl rounded-xl transition-all hover:scale-110"
                        style={draft.avatar === a
                          ? { background: 'rgba(0,255,231,0.15)', border: '2px solid var(--neon-cyan)', boxShadow: '0 0 8px var(--neon-cyan)' }
                          : { background: 'var(--surface2)', border: '2px solid transparent' }}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-rajdhani tracking-widest uppercase mb-2"
                    style={{ color: 'rgba(0,255,231,0.4)' }}>Кастомный статус</label>
                  <input value={draft.customStatus}
                    onChange={e => setDraft(p => ({ ...p, customStatus: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none font-rajdhani text-gray-200"
                    style={{ background: 'var(--surface)', border: '1px solid rgba(0,255,231,0.15)' }}
                    placeholder="Напр.: В рейде 🎮" maxLength={60} />
                </div>
              </div>
            )}

            {/* ── ACCOUNT TAB ── */}
            {tab === 'account' && (
              <div className="flex flex-col gap-5">
                <div>
                  <label className="block text-xs font-rajdhani tracking-widest uppercase mb-2"
                    style={{ color: 'rgba(0,255,231,0.4)' }}>Электронная почта</label>
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl"
                      style={{ background: 'var(--surface)', border: '1px solid rgba(0,255,231,0.15)' }}>
                      <Icon name="Mail" size={14} className="text-gray-600 flex-shrink-0" />
                      <input value={draft.email}
                        onChange={e => setDraft(p => ({ ...p, email: e.target.value }))}
                        type="email"
                        className="flex-1 bg-transparent outline-none text-sm text-gray-200 font-rajdhani"
                        placeholder="ghost@example.com" />
                      {draft.emailVerified && (
                        <Icon name="ShieldCheck" size={14} className="text-green-400 flex-shrink-0" />
                      )}
                    </div>
                    <button onClick={() => setTab('verification')}
                      className="px-4 py-2.5 rounded-xl text-xs font-rajdhani font-bold tracking-wider transition-all hover:scale-105 flex-shrink-0"
                      style={{
                        background: draft.emailVerified ? 'rgba(0,255,231,0.08)' : 'rgba(0,255,231,0.15)',
                        color: draft.emailVerified ? '#00ffe7' : 'var(--dark-bg)',
                        backgroundColor: draft.emailVerified ? undefined : 'var(--neon-cyan)',
                        border: '1px solid rgba(0,255,231,0.3)',
                      }}>
                      {draft.emailVerified ? '✓ Верифицирован' : 'Верифицировать'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-rajdhani tracking-widest uppercase mb-2"
                    style={{ color: 'rgba(0,255,231,0.4)' }}>Роль в сообществе</label>
                  <div className="grid grid-cols-2 gap-2">
                    {ROLES.map(r => (
                      <button key={r} onClick={() => setDraft(p => ({ ...p, role: r }))}
                        className="py-2.5 px-4 rounded-xl text-sm font-rajdhani font-bold transition-all"
                        style={draft.role === r
                          ? { background: 'rgba(191,0,255,0.15)', color: 'var(--neon-purple)', border: '1px solid rgba(191,0,255,0.4)' }
                          : { background: 'var(--surface)', color: '#666', border: '1px solid var(--surface2)' }}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl flex items-center justify-between"
                  style={{ background: 'rgba(255,0,110,0.05)', border: '1px solid rgba(255,0,110,0.15)' }}>
                  <div>
                    <p className="text-sm font-rajdhani font-bold text-gray-300">Удалить аккаунт</p>
                    <p className="text-xs text-gray-600 mt-0.5">Это действие необратимо</p>
                  </div>
                  <button className="px-4 py-2 rounded-xl text-xs font-rajdhani font-bold transition-all"
                    style={{ background: 'rgba(255,0,110,0.1)', color: '#ff006e', border: '1px solid rgba(255,0,110,0.3)' }}>
                    Удалить
                  </button>
                </div>
              </div>
            )}

            {/* ── STATUS TAB ── */}
            {tab === 'status' && (
              <div className="flex flex-col gap-4">
                <p className="text-xs font-rajdhani tracking-widest uppercase"
                  style={{ color: 'rgba(0,255,231,0.4)' }}>Статус присутствия</p>
                <div className="flex flex-col gap-2">
                  {STATUS_OPTIONS.map(s => (
                    <button key={s.value} onClick={() => setDraft(p => ({ ...p, status: s.value }))}
                      className="flex items-center gap-4 px-4 py-3 rounded-2xl transition-all"
                      style={draft.status === s.value
                        ? { background: `${s.color}10`, border: `1px solid ${s.color}44` }
                        : { background: 'var(--surface)', border: '1px solid var(--surface2)' }}>
                      <div className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ background: s.color, boxShadow: draft.status === s.value ? `0 0 8px ${s.color}` : 'none' }} />
                      <div className="flex-1 text-left">
                        <p className="text-sm font-rajdhani font-bold"
                          style={{ color: draft.status === s.value ? s.color : '#ccc' }}>
                          {s.label}
                        </p>
                        <p className="text-xs text-gray-600">
                          {s.value === 'online' ? 'Виден всем участникам' :
                           s.value === 'away' ? 'Показывает что вы отошли' :
                           s.value === 'dnd' ? 'Уведомления отключены' :
                           'Выглядишь оффлайн для всех'}
                        </p>
                      </div>
                      {draft.status === s.value && (
                        <Icon name="Check" size={16} style={{ color: s.color }} />
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-2">
                  <label className="block text-xs font-rajdhani tracking-widest uppercase mb-2"
                    style={{ color: 'rgba(0,255,231,0.4)' }}>Текстовый статус</label>
                  <input value={draft.customStatus}
                    onChange={e => setDraft(p => ({ ...p, customStatus: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none font-rajdhani text-gray-200"
                    style={{ background: 'var(--surface)', border: '1px solid rgba(0,255,231,0.15)' }}
                    placeholder="Что ты делаешь? Напр.: В рейде 🎮" maxLength={60} />
                </div>
              </div>
            )}

            {/* ── VERIFICATION TAB ── */}
            {tab === 'verification' && (
              <div className="flex flex-col gap-5">
                {/* Status banner */}
                <div className="flex items-center gap-4 p-4 rounded-2xl"
                  style={draft.emailVerified
                    ? { background: 'rgba(0,255,231,0.06)', border: '1px solid rgba(0,255,231,0.25)' }
                    : { background: 'rgba(255,230,0,0.05)', border: '1px solid rgba(255,230,0,0.2)' }}>
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl flex-shrink-0"
                    style={draft.emailVerified
                      ? { background: 'rgba(0,255,231,0.12)', border: '1px solid rgba(0,255,231,0.3)' }
                      : { background: 'rgba(255,230,0,0.08)', border: '1px solid rgba(255,230,0,0.2)' }}>
                    <Icon name={draft.emailVerified ? 'ShieldCheck' : 'ShieldAlert'} size={22}
                      className={draft.emailVerified ? 'text-cyan-400' : 'text-yellow-400'} />
                  </div>
                  <div>
                    <p className="font-rajdhani font-bold text-sm"
                      style={{ color: draft.emailVerified ? 'var(--neon-cyan)' : 'var(--neon-yellow)' }}>
                      {draft.emailVerified ? 'Аккаунт верифицирован' : 'Аккаунт не верифицирован'}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {draft.emailVerified
                        ? `Привязан к ${draft.email}`
                        : 'Верификация даёт бейдж ✓ и расширенные возможности'}
                    </p>
                  </div>
                </div>

                {!draft.emailVerified && (
                  <>
                    <div>
                      <label className="block text-xs font-rajdhani tracking-widest uppercase mb-2"
                        style={{ color: 'rgba(0,255,231,0.4)' }}>Электронная почта</label>
                      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
                        style={{ background: 'var(--surface)', border: '1px solid rgba(0,255,231,0.15)' }}>
                        <Icon name="Mail" size={14} className="text-gray-600" />
                        <input value={draft.email}
                          onChange={e => setDraft(p => ({ ...p, email: e.target.value }))}
                          type="email"
                          className="flex-1 bg-transparent outline-none text-sm text-gray-200 font-rajdhani"
                          placeholder="ghost@example.com"
                          disabled={verifyStep === 'code_sent'} />
                      </div>
                    </div>

                    {verifyStep === 'idle' && (
                      <button onClick={handleSendCode}
                        className="w-full py-3 rounded-xl font-orbitron font-bold text-sm tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98] clip-corner-sm"
                        style={{ background: 'var(--neon-cyan)', color: 'var(--dark-bg)', boxShadow: '0 0 20px rgba(0,255,231,0.2)' }}>
                        ▶ ОТПРАВИТЬ КОД
                      </button>
                    )}

                    {verifyStep === 'code_sent' && (
                      <div className="flex flex-col gap-3 animate-fade-in-up">
                        <div className="p-3 rounded-xl text-xs font-rajdhani text-center"
                          style={{ background: 'rgba(0,255,231,0.06)', border: '1px solid rgba(0,255,231,0.15)', color: 'rgba(0,255,231,0.6)' }}>
                          Код отправлен на <strong>{draft.email}</strong>
                          <br />
                          <span style={{ opacity: 0.5 }}>(для демо: введи любые 6 цифр)</span>
                        </div>
                        <div>
                          <label className="block text-xs font-rajdhani tracking-widest uppercase mb-2"
                            style={{ color: 'rgba(0,255,231,0.4)' }}>Код из письма</label>
                          <input value={verifyCode}
                            onChange={e => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            className="w-full px-4 py-3 rounded-xl text-center text-2xl outline-none font-orbitron tracking-[0.5em] text-gray-200"
                            style={{ background: 'var(--surface)', border: '1px solid rgba(0,255,231,0.2)', letterSpacing: '0.5em' }}
                            placeholder="000000" maxLength={6} />
                        </div>
                        <button onClick={handleVerifyCode}
                          disabled={verifyCode.length < 6}
                          className="w-full py-3 rounded-xl font-orbitron font-bold text-sm tracking-wider transition-all disabled:opacity-40 hover:scale-[1.02] clip-corner-sm"
                          style={{ background: 'var(--neon-cyan)', color: 'var(--dark-bg)', boxShadow: '0 0 20px rgba(0,255,231,0.2)' }}>
                          ▶ ПОДТВЕРДИТЬ
                        </button>
                      </div>
                    )}

                    {verifyError && (
                      <p className="text-xs font-rajdhani text-pink-400 text-center animate-fade-in-up">{verifyError}</p>
                    )}
                  </>
                )}

                {/* What verification gives */}
                <div className="mt-2">
                  <p className="text-xs font-rajdhani tracking-widest uppercase mb-3"
                    style={{ color: 'rgba(0,255,231,0.4)' }}>Что даёт верификация</p>
                  {[
                    { icon: 'BadgeCheck', text: 'Бейдж ✓ рядом с именем' },
                    { icon: 'Shield', text: 'Создание серверов без ограничений' },
                    { icon: 'Megaphone', text: 'Доступ к объявлениям и анонсам' },
                    { icon: 'KeyRound', text: 'Восстановление доступа к аккаунту' },
                  ].map(item => (
                    <div key={item.text} className="flex items-center gap-3 py-2">
                      <Icon name={item.icon} size={14} className="text-cyan-500 flex-shrink-0" />
                      <span className="text-sm text-gray-400 font-rajdhani">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-t"
          style={{ borderColor: 'rgba(0,255,231,0.06)', background: 'var(--dark-bg)' }}>
          <button onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-rajdhani font-bold transition-all"
            style={{ background: 'var(--surface2)', color: '#666', border: '1px solid var(--surface2)' }}>
            Отмена
          </button>
          <button onClick={handleSave}
            className="px-6 py-2.5 rounded-xl text-sm font-orbitron font-bold tracking-wider transition-all hover:scale-105 clip-corner-sm"
            style={{
              background: saved ? 'rgba(0,255,231,0.15)' : 'var(--neon-cyan)',
              color: saved ? 'var(--neon-cyan)' : 'var(--dark-bg)',
              boxShadow: '0 0 16px rgba(0,255,231,0.2)',
              border: saved ? '1px solid rgba(0,255,231,0.4)' : 'none',
            }}>
            {saved ? '✓ СОХРАНЕНО' : 'СОХРАНИТЬ'}
          </button>
        </div>
      </div>
    </div>
  );
}
