import { useState } from 'react';
import Icon from '@/components/ui/icon';
import type { Server, DirectChat, ViewMode } from '@/pages/MessengerLayout';

interface Props {
  servers: Server[];
  dms: DirectChat[];
  selectedServer: Server;
  selectedDM: DirectChat | null;
  viewMode: ViewMode;
  onSelectServer: (s: Server) => void;
  onSelectDM: (dm: DirectChat) => void;
  onDMMode: () => void;
}

export default function ServersSidebar({
  servers, dms, selectedServer, selectedDM, viewMode, onSelectServer, onDMMode
}: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  const totalDMUnread = dms.reduce((sum, d) => sum + d.unread, 0);

  return (
    <div className="w-[72px] flex flex-col items-center py-3 gap-2 flex-shrink-0 relative"
      style={{ background: 'var(--dark-bg)', borderRight: '1px solid rgba(0,255,231,0.08)' }}>

      {/* Logo */}
      <div className="w-12 h-12 flex items-center justify-center mb-1 cursor-pointer animate-float">
        <span className="font-orbitron font-black text-lg neon-text-cyan">NX</span>
      </div>

      <div className="w-8 h-[1px] mb-1" style={{ background: 'linear-gradient(90deg, transparent, var(--neon-cyan), transparent)' }} />

      {/* DMs button */}
      <div className="relative" onClick={onDMMode}>
        <div
          className={`w-12 h-12 flex items-center justify-center rounded-2xl cursor-pointer transition-all duration-200 clip-corner-sm
            ${viewMode === 'dm' ? 'neon-glow-purple rounded-xl' : 'hover:rounded-xl'}`}
          style={{
            background: viewMode === 'dm' ? 'var(--neon-purple)' : 'var(--surface)',
            transform: hovered === 'dm' ? 'scale(1.1)' : 'scale(1)',
          }}
          onMouseEnter={() => setHovered('dm')}
          onMouseLeave={() => setHovered(null)}
        >
          <Icon name="MessageCircle" size={22} className={viewMode === 'dm' ? 'text-black' : 'text-gray-400'} />
        </div>
        {totalDMUnread > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-black"
            style={{ background: 'var(--neon-pink)', fontSize: '10px' }}>
            {totalDMUnread}
          </div>
        )}
      </div>

      <div className="w-8 h-[1px] my-1" style={{ background: 'linear-gradient(90deg, transparent, var(--surface2), transparent)' }} />

      {/* Servers */}
      <div className="flex flex-col gap-2 overflow-y-auto flex-1 w-full items-center" style={{ scrollbarWidth: 'none' }}>
        {servers.map(server => (
          <div key={server.id} className="relative" onClick={() => onSelectServer(server)}>
            <div
              className={`w-12 h-12 flex items-center justify-center text-2xl cursor-pointer transition-all duration-200
                ${selectedServer.id === server.id && viewMode !== 'dm' ? 'rounded-xl' : 'rounded-2xl hover:rounded-xl'}`}
              style={{
                background: selectedServer.id === server.id && viewMode !== 'dm'
                  ? `${server.color}22`
                  : 'var(--surface)',
                border: selectedServer.id === server.id && viewMode !== 'dm'
                  ? `2px solid ${server.color}`
                  : '2px solid transparent',
                boxShadow: selectedServer.id === server.id && viewMode !== 'dm'
                  ? `0 0 10px ${server.color}66` : 'none',
                transform: hovered === server.id ? 'scale(1.1)' : 'scale(1)',
              }}
              onMouseEnter={() => setHovered(server.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {server.icon}
            </div>
            {/* Active indicator */}
            {selectedServer.id === server.id && viewMode !== 'dm' && (
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
                style={{ background: server.color, boxShadow: `0 0 6px ${server.color}` }} />
            )}
            {/* Unread dot */}
            {server.unread > 0 && selectedServer.id !== server.id && (
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-black"
                style={{ background: 'var(--neon-pink)', fontSize: '10px' }}>
                {server.unread > 9 ? '9+' : server.unread}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add server */}
      <div className="mt-auto">
        <div
          className="w-12 h-12 flex items-center justify-center rounded-2xl cursor-pointer transition-all duration-200 hover:rounded-xl"
          style={{ background: 'var(--surface)', border: '2px dashed rgba(0,255,231,0.2)' }}
          onMouseEnter={() => setHovered('add')}
          onMouseLeave={() => setHovered(null)}
        >
          <Icon name="Plus" size={20} className="text-gray-500" />
        </div>
      </div>
    </div>
  );
}
