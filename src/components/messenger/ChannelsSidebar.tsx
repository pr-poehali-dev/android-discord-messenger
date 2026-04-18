import Icon from '@/components/ui/icon';
import type { Server, Channel, DirectChat, ViewMode } from '@/pages/MessengerLayout';

interface Props {
  server: Server;
  dms: DirectChat[];
  selectedChannel: Channel;
  selectedDM: DirectChat | null;
  viewMode: ViewMode;
  onSelectChannel: (c: Channel) => void;
  onSelectDM: (dm: DirectChat) => void;
  onOpenModeration: () => void;
}

const roleColor: Record<string, string> = {
  online: '#00ffe7',
  away: '#ffe600',
  offline: '#444',
};

const channelTypeIcon: Record<string, string> = {
  text: 'Hash',
  voice: 'Volume2',
  announcement: 'Megaphone',
};

export default function ChannelsSidebar({
  server, dms, selectedChannel, selectedDM, viewMode,
  onSelectChannel, onSelectDM, onOpenModeration
}: Props) {
  return (
    <div className="w-56 flex flex-col flex-shrink-0 relative"
      style={{ background: 'var(--panel-bg)', borderRight: '1px solid rgba(0,255,231,0.06)' }}>

      {/* Server header */}
      <div className="flex items-center justify-between px-3 py-3 border-b"
        style={{ borderColor: 'rgba(0,255,231,0.08)' }}>
        {viewMode === 'dm' ? (
          <span className="font-rajdhani font-bold text-base tracking-widest uppercase neon-text-purple">
            Сообщения
          </span>
        ) : (
          <div className="flex items-center gap-2 flex-1">
            <div className="w-7 h-7 flex items-center justify-center text-lg rounded-lg"
              style={{ background: `${server.color}22`, border: `1px solid ${server.color}44` }}>
              {server.icon}
            </div>
            <span className="font-rajdhani font-bold text-sm tracking-widest uppercase truncate"
              style={{ color: server.color }}>
              {server.name}
            </span>
          </div>
        )}
        {viewMode !== 'dm' && server.isOwner && (
          <button onClick={onOpenModeration}
            className="w-6 h-6 flex items-center justify-center rounded opacity-60 hover:opacity-100 transition-opacity"
            title="Модерация">
            <Icon name="Settings" size={14} className="text-gray-400" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto py-2" style={{ scrollbarWidth: 'none' }}>
        {viewMode === 'dm' ? (
          <div className="flex flex-col gap-1 px-2">
            <p className="text-xs font-rajdhani tracking-widest uppercase px-2 py-1"
              style={{ color: 'var(--neon-cyan)', opacity: 0.5 }}>
              Личные чаты
            </p>
            {dms.filter(d => !d.isGroup).map(dm => (
              <button key={dm.id} onClick={() => onSelectDM(dm)}
                className={`flex items-center gap-2 px-2 py-2 rounded-lg w-full text-left transition-all duration-150
                  ${selectedDM?.id === dm.id ? 'bg-surface' : 'hover:bg-surface'}`}
                style={selectedDM?.id === dm.id ? { background: 'var(--surface2)', border: '1px solid rgba(191,0,255,0.3)' } : {}}>
                <div className="relative">
                  <span className="text-xl">{dm.avatar}</span>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                    style={{ background: roleColor[dm.status], borderColor: 'var(--panel-bg)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-gray-200">{dm.name}</p>
                </div>
                {dm.unread > 0 && (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0"
                    style={{ background: 'var(--neon-pink)', fontSize: '10px' }}>
                    {dm.unread}
                  </div>
                )}
              </button>
            ))}

            <p className="text-xs font-rajdhani tracking-widest uppercase px-2 py-1 mt-2"
              style={{ color: 'var(--neon-cyan)', opacity: 0.5 }}>
              Групповые чаты
            </p>
            {dms.filter(d => d.isGroup).map(dm => (
              <button key={dm.id} onClick={() => onSelectDM(dm)}
                className="flex items-center gap-2 px-2 py-2 rounded-lg w-full text-left transition-all"
                style={selectedDM?.id === dm.id ? { background: 'var(--surface2)', border: '1px solid rgba(191,0,255,0.3)' } : {}}>
                <span className="text-xl">{dm.avatar}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-gray-200">{dm.name}</p>
                  <p className="text-xs text-gray-500 truncate">{dm.members?.length} участников</p>
                </div>
                {dm.unread > 0 && (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0"
                    style={{ background: 'var(--neon-pink)', fontSize: '10px' }}>
                    {dm.unread}
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col">
            <p className="text-xs font-rajdhani tracking-widest uppercase px-4 py-1"
              style={{ color: 'var(--neon-cyan)', opacity: 0.5 }}>
              Каналы
            </p>
            {server.channels.map(channel => (
              <button key={channel.id} onClick={() => onSelectChannel(channel)}
                className={`flex items-center gap-2 mx-2 px-2 py-1.5 rounded-lg w-[calc(100%-16px)] text-left transition-all duration-150`}
                style={selectedChannel.id === channel.id
                  ? { background: 'var(--surface2)', borderLeft: `2px solid ${server.color}` }
                  : { borderLeft: '2px solid transparent' }}>
                <Icon name={channelTypeIcon[channel.type]} size={14}
                  className={selectedChannel.id === channel.id ? 'text-white' : 'text-gray-500'} />
                <span className={`text-sm flex-1 truncate font-rajdhani font-medium tracking-wide
                  ${selectedChannel.id === channel.id ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}>
                  {channel.name}
                </span>
                {channel.locked && (
                  <Icon name="Lock" size={11} className="text-gray-600" />
                )}
                {channel.unread > 0 && (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0"
                    style={{ background: 'var(--neon-pink)', fontSize: '10px' }}>
                    {channel.unread}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* User profile bottom */}
      <ProfileBarInline />
    </div>
  );
}

function ProfileBarInline() {
  return (
    <div className="flex items-center gap-2 px-3 py-2 border-t"
      style={{ borderColor: 'rgba(0,255,231,0.08)', background: 'var(--dark-bg)' }}>
      <div className="relative">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
          style={{ background: 'var(--surface2)', border: '1px solid rgba(0,255,231,0.3)' }}>
          🤖
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
          style={{ background: '#00ffe7', borderColor: 'var(--dark-bg)' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-rajdhani font-bold tracking-wider neon-text-cyan truncate">NightRider_X</p>
        <p className="text-xs text-gray-600 truncate">Анонимный</p>
      </div>
      <button className="w-6 h-6 flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity">
        <Icon name="Settings" size={13} className="text-gray-400" />
      </button>
    </div>
  );
}