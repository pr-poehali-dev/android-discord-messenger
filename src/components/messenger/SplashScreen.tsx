import { useEffect, useState } from 'react';

interface Props {
  onDone: () => void;
}

const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*';

function useGlitchText(target: string, delay: number = 0) {
  const [text, setText] = useState('');
  useEffect(() => {
    let frame = 0;
    const maxFrames = 18;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        frame++;
        if (frame >= maxFrames) {
          setText(target);
          clearInterval(interval);
          return;
        }
        const progress = frame / maxFrames;
        setText(target.split('').map((char, i) => {
          if (char === ' ') return ' ';
          if (i < Math.floor(progress * target.length)) return char;
          return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        }).join(''));
      }, 40);
    }, delay);
    return () => { clearTimeout(timeout); };
  }, [target, delay]);
  return text;
}

export default function SplashScreen({ onDone }: Props) {
  const [phase, setPhase] = useState<'boot' | 'logo' | 'tagline' | 'fade'>('boot');
  const [progress, setProgress] = useState(0);
  const [bootLines, setBootLines] = useState<string[]>([]);

  const logoText = useGlitchText('NEXUS', phase === 'logo' || phase === 'tagline' || phase === 'fade' ? 0 : 9999);
  const tagText = useGlitchText('ИГРОВОЙ МЕССЕНДЖЕР', phase === 'tagline' || phase === 'fade' ? 0 : 9999);

  const BOOT_LINES = [
    '> Инициализация протокола связи...',
    '> Загрузка криптомодуля... OK',
    '> Проверка анонимного туннеля... OK',
    '> Подключение к NEXUS-сети...',
    '> Все системы в норме. Добро пожаловать.',
  ];

  useEffect(() => {
    // Phase 1: boot lines
    let lineIdx = 0;
    const lineInterval = setInterval(() => {
      setBootLines(prev => [...prev, BOOT_LINES[lineIdx]]);
      lineIdx++;
      if (lineIdx >= BOOT_LINES.length) clearInterval(lineInterval);
    }, 280);

    // Phase 2: logo
    const logoTimeout = setTimeout(() => setPhase('logo'), 1600);

    // Phase 3: tagline
    const tagTimeout = setTimeout(() => setPhase('tagline'), 2200);

    // Phase 4: progress bar
    let prog = 0;
    const progInterval = setInterval(() => {
      prog += Math.random() * 8 + 3;
      setProgress(Math.min(prog, 100));
      if (prog >= 100) clearInterval(progInterval);
    }, 60);

    // Phase 5: fade out
    const fadeTimeout = setTimeout(() => setPhase('fade'), 3400);

    // Phase 6: done
    const doneTimeout = setTimeout(() => onDone(), 3900);

    return () => {
      clearInterval(lineInterval);
      clearInterval(progInterval);
      clearTimeout(logoTimeout);
      clearTimeout(tagTimeout);
      clearTimeout(fadeTimeout);
      clearTimeout(doneTimeout);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden transition-opacity duration-500"
      style={{
        background: 'var(--dark-bg)',
        opacity: phase === 'fade' ? 0 : 1,
      }}
    >
      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,231,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,231,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }} />

      {/* Corner decorations */}
      <div className="absolute top-6 left-6 w-12 h-12 pointer-events-none"
        style={{ borderTop: '2px solid var(--neon-cyan)', borderLeft: '2px solid var(--neon-cyan)', boxShadow: '-4px -4px 12px rgba(0,255,231,0.15)' }} />
      <div className="absolute top-6 right-6 w-12 h-12 pointer-events-none"
        style={{ borderTop: '2px solid var(--neon-cyan)', borderRight: '2px solid var(--neon-cyan)', boxShadow: '4px -4px 12px rgba(0,255,231,0.15)' }} />
      <div className="absolute bottom-6 left-6 w-12 h-12 pointer-events-none"
        style={{ borderBottom: '2px solid var(--neon-cyan)', borderLeft: '2px solid var(--neon-cyan)', boxShadow: '-4px 4px 12px rgba(0,255,231,0.15)' }} />
      <div className="absolute bottom-6 right-6 w-12 h-12 pointer-events-none"
        style={{ borderBottom: '2px solid var(--neon-cyan)', borderRight: '2px solid var(--neon-cyan)', boxShadow: '4px 4px 12px rgba(0,255,231,0.15)' }} />

      {/* Boot log */}
      <div className="absolute top-16 left-10 right-10 font-rajdhani text-xs"
        style={{ color: 'rgba(0,255,231,0.35)', lineHeight: '1.8' }}>
        {bootLines.map((line, i) => (
          <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.01}s` }}>
            {line}
          </div>
        ))}
      </div>

      {/* Center content */}
      <div className="flex flex-col items-center gap-4 relative z-10">
        {/* Ambient glow */}
        <div className="absolute w-72 h-72 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(0,255,231,0.06) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
            left: '50%', top: '50%',
          }} />

        {/* Logo */}
        <div className="relative">
          <h1
            className="font-orbitron font-black text-7xl tracking-widest select-none"
            style={{
              color: 'var(--neon-cyan)',
              textShadow: '0 0 20px var(--neon-cyan), 0 0 60px rgba(0,255,231,0.4), 0 0 100px rgba(0,255,231,0.15)',
              letterSpacing: '0.2em',
              opacity: phase === 'boot' ? 0 : 1,
              transition: 'opacity 0.4s ease',
            }}
          >
            {logoText}
          </h1>
          {/* Underline scan */}
          <div className="mt-1 h-[2px] w-full"
            style={{
              background: 'linear-gradient(90deg, transparent, var(--neon-cyan), var(--neon-purple), transparent)',
              boxShadow: '0 0 8px var(--neon-cyan)',
              opacity: phase === 'boot' ? 0 : 1,
              transition: 'opacity 0.4s ease 0.2s',
            }} />
        </div>

        {/* Tagline */}
        <p
          className="font-rajdhani font-bold tracking-[0.3em] text-base uppercase"
          style={{
            color: 'rgba(0,255,231,0.55)',
            opacity: phase === 'tagline' || phase === 'fade' ? 1 : 0,
            transform: phase === 'tagline' || phase === 'fade' ? 'translateY(0)' : 'translateY(8px)',
            transition: 'all 0.4s ease',
          }}
        >
          {tagText}
        </p>

        {/* Hex badges */}
        <div className="flex gap-3 mt-2"
          style={{
            opacity: phase === 'tagline' || phase === 'fade' ? 1 : 0,
            transition: 'opacity 0.4s ease 0.2s',
          }}>
          {['АНОНИМНО', 'БЫСТРО', 'БЕЗОПАСНО'].map((badge, i) => (
            <div key={badge}
              className="px-3 py-1 font-rajdhani text-xs font-bold tracking-widest clip-corner-sm"
              style={{
                background: 'rgba(0,255,231,0.06)',
                border: '1px solid rgba(0,255,231,0.2)',
                color: 'rgba(0,255,231,0.5)',
                animationDelay: `${i * 0.1}s`,
              }}>
              {badge}
            </div>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-16 left-10 right-10">
        <div className="flex justify-between font-rajdhani text-xs mb-1"
          style={{ color: 'rgba(0,255,231,0.3)' }}>
          <span>ЗАГРУЗКА СИСТЕМЫ</span>
          <span>{Math.floor(progress)}%</span>
        </div>
        <div className="h-[3px] w-full rounded-full overflow-hidden"
          style={{ background: 'rgba(0,255,231,0.08)' }}>
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, var(--neon-cyan), var(--neon-purple))',
              boxShadow: '0 0 8px var(--neon-cyan)',
            }} />
        </div>
      </div>
    </div>
  );
}