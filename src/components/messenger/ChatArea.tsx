import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import type { Message, Channel, DirectChat, ViewMode, Server } from '@/pages/MessengerLayout';

interface Props {
  messages: Message[];
  channel: Channel | null;
  dm: DirectChat | null;
  viewMode: ViewMode;
  server: Server | null;
  showMembers: boolean;
  onToggleMembers: () => void;
  onSendMessage: (text: string) => void;
}

const roleColors: Record<string, string> = {
  owner: '#ffe600',
  admin: '#ff006e',
  moderator: '#00ffe7',
  member: '#aaa',
};

const roleBadge: Record<string, string> = {
  owner: '👑',
  admin: '🛡️',
  moderator: '⚔️',
  member: '',
};

export default function ChatArea({
  messages, channel, dm, viewMode, server, showMembers, onToggleMembers, onSendMessage
}: Props) {
  const [inputValue, setInputValue] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;
    onSendMessage(text);
    setInputValue('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const title = viewMode === 'dm' ? dm?.name : (channel ? `#${channel.name}` : 'Выбери канал');
  const subtitle = viewMode === 'dm'
    ? (dm?.isGroup ? `${dm.members?.length} участников` : 'Личное сообщение')
    : (server ? `Канал сервера ${server.name}` : 'GhostNet');

  const quickEmojis = ['🔥', '⚡', '💀', '🤯', '👾', '✋', '🎮', '🏆'];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
        style={{ borderColor: 'rgba(0,255,231,0.08)', background: 'var(--panel-bg)' }}>
        <div className="flex items-center gap-3">
          {viewMode === 'dm' ? (
            <div className="relative">
              <span className="text-2xl">{dm?.avatar}</span>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                style={{
                  background: dm?.status === 'online' ? 'var(--neon-cyan)' : dm?.status === 'away' ? 'var(--neon-yellow)' : '#444',
                  borderColor: 'var(--panel-bg)'
                }} />
            </div>
          ) : (
            <div className="w-8 h-8 flex items-center justify-center rounded-lg"
              style={{ background: 'var(--surface2)', border: '1px solid rgba(0,255,231,0.15)' }}>
              <Icon name={channel?.type === 'voice' ? 'Volume2' : channel?.type === 'announcement' ? 'Megaphone' : 'Hash'} size={16}
                className="text-gray-300" />
            </div>
          )}
          <div>
            <h2 className="font-rajdhani font-bold text-white tracking-wider text-base">{title}</h2>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {channel?.type === 'voice' && (
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-rajdhani font-bold tracking-wider transition-all"
              style={{ background: 'var(--neon-cyan)', color: 'var(--dark-bg)' }}>
              <Icon name="Mic" size={13} />
              ВОЙТИ
            </button>
          )}
          <button
            onClick={onToggleMembers}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all
              ${showMembers ? 'opacity-100' : 'opacity-50'}`}
            style={{ background: showMembers ? 'rgba(0,255,231,0.1)' : 'var(--surface)' }}>
            <Icon name="Users" size={16} className={showMembers ? 'text-cyan-400' : 'text-gray-500'} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg opacity-50 hover:opacity-100 transition-opacity"
            style={{ background: 'var(--surface)' }}>
            <Icon name="Search" size={16} className="text-gray-400" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg opacity-50 hover:opacity-100 transition-opacity"
            style={{ background: 'var(--surface)' }}>
            <Icon name="Bell" size={16} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1"
        style={{ background: 'var(--dark-bg)' }}>

        {/* Empty state */}
        {!channel && !dm && (
          <div className="flex flex-col items-center justify-center h-full gap-4 opacity-30">
            <img src="https://cdn.poehali.dev/projects/30f34ae1-20eb-404a-b020-2dea0489c572/bucket/9cf7cce9-224c-40a7-8ab8-ff79c8bb5cef.png"
              alt="ghost" className="w-20 h-20 animate-float" style={{ filter: 'grayscale(0.5)' }} />
            <div className="text-center">
              <p className="font-orbitron font-bold text-gray-600 text-lg">GhostNet</p>
              <p className="font-rajdhani text-gray-700 text-sm mt-1">Выбери канал или чат слева</p>
            </div>
          </div>
        )}

        {(channel || dm) && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 opacity-40">
            <Icon name="MessageSquare" size={36} className="text-gray-700" />
            <p className="font-rajdhani text-gray-600 text-sm">Пока тихо... Напиши первым!</p>
          </div>
        )}

        {messages.length > 0 && (
          <>
            {/* Day separator */}
            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,255,231,0.15))' }} />
              <span className="text-xs text-gray-600 font-rajdhani tracking-wider">Сегодня</span>
              <div className="flex-1 h-[1px]" style={{ background: 'linear-gradient(90deg, rgba(0,255,231,0.15), transparent)' }} />
            </div>
          </>
        )}

        {messages.map((msg, idx) => {
          const isMe = msg.authorId === 'me';
          const prevMsg = messages[idx - 1];
          const grouped = prevMsg && prevMsg.authorId === msg.authorId;

          return (
            <div key={msg.id}
              className={`group flex gap-3 px-2 py-1 rounded-xl transition-all duration-150 animate-fade-in-up
                ${isMe ? 'flex-row-reverse' : ''}`}
              style={{ animationDelay: `${idx * 0.03}s` }}>

              {/* Avatar */}
              {!grouped || isMe ? (
                <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center text-xl rounded-xl cursor-pointer hover:scale-110 transition-transform"
                  style={{
                    background: isMe ? 'rgba(0,255,231,0.12)' : 'var(--surface2)',
                    border: isMe ? '1px solid rgba(0,255,231,0.3)' : '1px solid var(--surface2)',
                  }}>
                  {msg.authorAvatar}
                </div>
              ) : (
                <div className="w-9 flex-shrink-0" />
              )}

              {/* Content */}
              <div className={`flex flex-col max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                {(!grouped || isMe) && (
                  <div className={`flex items-center gap-2 mb-0.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <span className="text-xs font-rajdhani font-bold tracking-wider"
                      style={{ color: isMe ? 'var(--neon-cyan)' : roleColors[msg.authorRole] }}>
                      {msg.authorName}
                    </span>
                    {roleBadge[msg.authorRole] && (
                      <span className="text-xs">{roleBadge[msg.authorRole]}</span>
                    )}
                    <span className="text-xs text-gray-600">{msg.timestamp}</span>
                  </div>
                )}

                <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed relative
                  ${isMe
                    ? 'rounded-tr-sm text-white'
                    : 'rounded-tl-sm text-gray-200'
                  }`}
                  style={isMe
                    ? { background: 'linear-gradient(135deg, rgba(0,255,231,0.2), rgba(0,255,231,0.08))', border: '1px solid rgba(0,255,231,0.2)' }
                    : { background: 'var(--surface)', border: '1px solid var(--surface2)' }
                  }>
                  {msg.content}
                </div>

                {/* Reactions */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {msg.reactions.map((r, i) => (
                      <button key={i}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-all hover:scale-110"
                        style={{ background: 'var(--surface2)', border: '1px solid var(--surface2)' }}>
                        <span>{r.emoji}</span>
                        <span className="text-gray-400 font-rajdhani">{r.count}</span>
                      </button>
                    ))}
                    <button className="flex items-center justify-center w-6 h-6 rounded-full opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-all"
                      style={{ background: 'var(--surface2)' }}>
                      <span className="text-xs">+</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>


      {/* Input area */}
      <div className="px-4 py-3 flex-shrink-0" style={{ background: 'var(--dark-bg)' }}>
        {/* Quick emoji */}
        {showEmojiPicker && (
          <div className="flex gap-2 mb-2 p-2 rounded-xl animate-fade-in-up"
            style={{ background: 'var(--surface)', border: '1px solid rgba(0,255,231,0.15)' }}>
            {quickEmojis.map(e => (
              <button key={e} onClick={() => { setInputValue(v => v + e); setShowEmojiPicker(false); inputRef.current?.focus(); }}
                className="text-xl hover:scale-125 transition-transform">
                {e}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 px-3 py-2 rounded-2xl"
          style={{ background: 'var(--surface)', border: '1px solid rgba(0,255,231,0.12)' }}>
          <button onClick={() => setShowEmojiPicker(v => !v)}
            className="w-8 h-8 flex items-center justify-center rounded-lg opacity-60 hover:opacity-100 transition-opacity flex-shrink-0">
            <Icon name="Smile" size={18} className="text-gray-400" />
          </button>
          <input
            ref={inputRef}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Написать в ${viewMode === 'dm' ? dm?.name : (channel ? '#' + channel.name : 'канал')}...`}
            className="flex-1 bg-transparent outline-none text-sm text-gray-200 placeholder-gray-600 font-rubik"
          />
          <div className="flex items-center gap-1 flex-shrink-0">
            <button className="w-7 h-7 flex items-center justify-center rounded-lg opacity-40 hover:opacity-80 transition-opacity">
              <Icon name="Paperclip" size={16} className="text-gray-400" />
            </button>
            <button className="w-7 h-7 flex items-center justify-center rounded-lg opacity-40 hover:opacity-80 transition-opacity">
              <Icon name="Image" size={16} className="text-gray-400" />
            </button>
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="w-8 h-8 flex items-center justify-center rounded-xl ml-1 transition-all duration-200 disabled:opacity-30"
              style={{
                background: inputValue.trim() ? 'var(--neon-cyan)' : 'var(--surface2)',
                boxShadow: inputValue.trim() ? '0 0 10px var(--neon-cyan)' : 'none',
              }}>
              <Icon name="Send" size={15} className={inputValue.trim() ? 'text-black' : 'text-gray-600'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}