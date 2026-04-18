import { useState } from 'react';
import ServersSidebar from '@/components/messenger/ServersSidebar';
import ChannelsSidebar from '@/components/messenger/ChannelsSidebar';
import ChatArea from '@/components/messenger/ChatArea';
import MembersPanel from '@/components/messenger/MembersPanel';
import ModerationPanel from '@/components/messenger/ModerationPanel';
import SettingsPanel from '@/components/messenger/SettingsPanel';

export type ViewMode = 'chat' | 'dm' | 'moderation';

export interface Server {
  id: string;
  name: string;
  icon: string;
  color: string;
  unread: number;
  channels: Channel[];
  members: Member[];
  isOwner?: boolean;
}

export interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice' | 'announcement';
  unread: number;
  locked?: boolean;
}

export interface Member {
  id: string;
  name: string;
  avatar: string;
  role: 'owner' | 'admin' | 'moderator' | 'member';
  status: 'online' | 'away' | 'dnd' | 'offline';
  banned?: boolean;
}

export interface Message {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  content: string;
  timestamp: string;
  reactions?: { emoji: string; count: number }[];
}

export interface DirectChat {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'dnd' | 'offline';
  unread: number;
  isGroup?: boolean;
  members?: string[];
}

export interface UserProfile {
  username: string;
  avatar: string;
  email: string;
  emailVerified: boolean;
  role: string;
  status: 'online' | 'away' | 'dnd' | 'offline';
  customStatus: string;
}

interface LayoutProps {
  user?: { username: string; avatar: string } | null;
}

export default function MessengerLayout({ user }: LayoutProps) {
  const [servers, setServers] = useState<Server[]>([]);
  const [dms, setDms] = useState<DirectChat[]>([]);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [selectedDM, setSelectedDM] = useState<DirectChat | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('chat');
  const [showMembers, setShowMembers] = useState(true);
  const [showModeration, setShowModeration] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const [profile, setProfile] = useState<UserProfile>({
    username: user?.username ?? 'Ghost_User',
    avatar: user?.avatar ?? '👻',
    email: '',
    emailVerified: false,
    role: 'Участник',
    status: 'online',
    customStatus: '',
  });

  const handleSelectServer = (server: Server) => {
    setSelectedServer(server);
    setSelectedChannel(server.channels[0] ?? null);
    setSelectedDM(null);
    setViewMode('chat');
    setMessages([]);
    setShowModeration(false);
  };

  const handleSelectChannel = (channel: Channel) => {
    setSelectedChannel(channel);
    setSelectedDM(null);
    setViewMode('chat');
    setMessages([]);
  };

  const handleSelectDM = (dm: DirectChat) => {
    setSelectedDM(dm);
    setViewMode('dm');
    setMessages([]);
  };

  const handleSendMessage = (text: string) => {
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      authorId: 'me',
      authorName: profile.username,
      authorAvatar: profile.avatar,
      authorRole: 'member',
      content: text,
      timestamp: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const handleOpenModeration = () => {
    setShowModeration(true);
    setShowMembers(false);
  };

  const handleCloseModeration = () => {
    setShowModeration(false);
    setShowMembers(true);
  };

  const handleAddServer = () => {
    const name = prompt('Название сервера:');
    if (!name?.trim()) return;
    const icons = ['⚡', '🔥', '🌑', '🎮', '🏆', '🌊', '💀', '🔮'];
    const colors = ['#00ffe7', '#bf00ff', '#ffe600', '#ff006e', '#ff6b00'];
    const newServer: Server = {
      id: `s_${Date.now()}`,
      name: name.trim().toUpperCase(),
      icon: icons[Math.floor(Math.random() * icons.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      unread: 0,
      isOwner: true,
      channels: [
        { id: `c_${Date.now()}_1`, name: 'общий', type: 'text', unread: 0 },
        { id: `c_${Date.now()}_2`, name: 'объявления', type: 'announcement', unread: 0, locked: true },
      ],
      members: [
        { id: 'me', name: profile.username, avatar: profile.avatar, role: 'owner', status: profile.status },
      ],
    };
    setServers(prev => [...prev, newServer]);
    handleSelectServer(newServer);
  };

  return (
    <div className="flex overflow-hidden bg-[var(--dark-bg)] relative scanlines" style={{ width: '100vw', height: '100vh' }}>
      {/* Ambient blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--neon-cyan) 0%, transparent 70%)', transform: 'translate(-30%, -30%)' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--neon-purple) 0%, transparent 70%)', transform: 'translate(30%, 30%)' }} />

      <ServersSidebar
        servers={servers}
        dms={dms}
        selectedServer={selectedServer}
        selectedDM={selectedDM}
        viewMode={viewMode}
        onSelectServer={handleSelectServer}
        onSelectDM={handleSelectDM}
        onDMMode={() => setViewMode('dm')}
        onAddServer={handleAddServer}
      />

      <ChannelsSidebar
        server={selectedServer}
        dms={dms}
        selectedChannel={selectedChannel}
        selectedDM={selectedDM}
        viewMode={viewMode}
        onSelectChannel={handleSelectChannel}
        onSelectDM={handleSelectDM}
        onOpenModeration={handleOpenModeration}
        username={profile.username}
        avatar={profile.avatar}
        status={profile.status}
        customStatus={profile.customStatus}
        onOpenSettings={() => setShowSettings(true)}
      />

      <div className="flex flex-col flex-1 min-w-0">
        <ChatArea
          messages={messages}
          channel={selectedChannel}
          dm={selectedDM}
          viewMode={viewMode}
          server={selectedServer}
          showMembers={showMembers}
          onToggleMembers={() => setShowMembers(v => !v)}
          onSendMessage={handleSendMessage}
        />
      </div>

      {showMembers && !showModeration && selectedServer && (
        <MembersPanel members={selectedServer.members} />
      )}

      {showModeration && selectedServer && (
        <ModerationPanel server={selectedServer} onClose={handleCloseModeration} />
      )}

      {showSettings && (
        <SettingsPanel
          profile={profile}
          onUpdate={setProfile}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
