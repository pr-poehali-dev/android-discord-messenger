import { useState } from 'react';
import ServersSidebar from '@/components/messenger/ServersSidebar';
import ChannelsSidebar from '@/components/messenger/ChannelsSidebar';
import ChatArea from '@/components/messenger/ChatArea';
import MembersPanel from '@/components/messenger/MembersPanel';
import ProfileBar from '@/components/messenger/ProfileBar';
import ModerationPanel from '@/components/messenger/ModerationPanel';

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
  status: 'online' | 'away' | 'offline';
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
  status: 'online' | 'away' | 'offline';
  unread: number;
  isGroup?: boolean;
  members?: string[];
}

const MOCK_SERVERS: Server[] = [
  {
    id: 's1',
    name: 'CYBER NEXUS',
    icon: '⚡',
    color: '#00ffe7',
    unread: 3,
    isOwner: true,
    channels: [
      { id: 'c1', name: 'общий', type: 'text', unread: 2 },
      { id: 'c2', name: 'объявления', type: 'announcement', unread: 1, locked: true },
      { id: 'c3', name: 'игры', type: 'text', unread: 0 },
      { id: 'c4', name: 'голосовой', type: 'voice', unread: 0 },
    ],
    members: [
      { id: 'm1', name: 'NightRider_X', avatar: '🤖', role: 'owner', status: 'online' },
      { id: 'm2', name: 'PhantomByte', avatar: '👾', role: 'admin', status: 'online' },
      { id: 'm3', name: 'StarlightZ', avatar: '⭐', role: 'moderator', status: 'away' },
      { id: 'm4', name: 'VoidWalker', avatar: '🌑', role: 'member', status: 'online' },
      { id: 'm5', name: 'CrashOverride', avatar: '💥', role: 'member', status: 'offline' },
      { id: 'm6', name: 'NeonShadow', avatar: '🔮', role: 'member', status: 'online' },
    ],
  },
  {
    id: 's2',
    name: 'VOID SQUAD',
    icon: '🌑',
    color: '#bf00ff',
    unread: 0,
    channels: [
      { id: 'c5', name: 'лобби', type: 'text', unread: 0 },
      { id: 'c6', name: 'стратегии', type: 'text', unread: 0 },
      { id: 'c7', name: 'войс', type: 'voice', unread: 0 },
    ],
    members: [
      { id: 'm7', name: 'VoidKing', avatar: '👑', role: 'owner', status: 'online' },
      { id: 'm8', name: 'DarkMatter', avatar: '🌀', role: 'member', status: 'away' },
    ],
  },
  {
    id: 's3',
    name: 'PIXEL GANG',
    icon: '🎮',
    color: '#ffe600',
    unread: 7,
    channels: [
      { id: 'c8', name: 'main', type: 'text', unread: 7 },
      { id: 'c9', name: 'memes', type: 'text', unread: 0 },
    ],
    members: [
      { id: 'm9', name: 'PixelKid', avatar: '🎮', role: 'owner', status: 'online' },
      { id: 'm10', name: 'RetroWave', avatar: '🌊', role: 'member', status: 'online' },
    ],
  },
];

const MOCK_DMS: DirectChat[] = [
  { id: 'd1', name: 'PhantomByte', avatar: '👾', status: 'online', unread: 2 },
  { id: 'd2', name: 'StarlightZ', avatar: '⭐', status: 'away', unread: 0 },
  { id: 'd3', name: 'VOID CREW', avatar: '🔥', status: 'online', unread: 5, isGroup: true, members: ['PhantomByte', 'VoidKing', 'NeonShadow'] },
  { id: 'd4', name: 'NeonShadow', avatar: '🔮', status: 'offline', unread: 0 },
];

const generateMessages = (channelName: string): Message[] => [
  {
    id: 'msg1',
    authorId: 'm2',
    authorName: 'PhantomByte',
    authorAvatar: '👾',
    authorRole: 'admin',
    content: `Добро пожаловать в #${channelName}! Готовы к игре? 🎮`,
    timestamp: '19:42',
    reactions: [{ emoji: '🔥', count: 5 }, { emoji: '⚡', count: 3 }],
  },
  {
    id: 'msg2',
    authorId: 'm3',
    authorName: 'StarlightZ',
    authorAvatar: '⭐',
    authorRole: 'moderator',
    content: 'Народ, кто сегодня в рейд идёт? Нужно ещё 3 человека!',
    timestamp: '19:58',
    reactions: [{ emoji: '✋', count: 2 }],
  },
  {
    id: 'msg3',
    authorId: 'm4',
    authorName: 'VoidWalker',
    authorAvatar: '🌑',
    authorRole: 'member',
    content: 'Я в деле! @StarlightZ напиши когда начало',
    timestamp: '20:01',
  },
  {
    id: 'msg4',
    authorId: 'm6',
    authorName: 'NeonShadow',
    authorAvatar: '🔮',
    authorRole: 'member',
    content: 'Только что дропнул легендарку 🤯🤯🤯 это нереально',
    timestamp: '20:15',
    reactions: [{ emoji: '😱', count: 8 }, { emoji: '🎉', count: 4 }],
  },
  {
    id: 'msg5',
    authorId: 'm1',
    authorName: 'NightRider_X',
    authorAvatar: '🤖',
    authorRole: 'owner',
    content: 'Сервер работает стабильно, апдейт выходит в 22:00. Все в голосовой!',
    timestamp: '20:33',
    reactions: [{ emoji: '👍', count: 12 }],
  },
];

interface LayoutProps {
  user?: { username: string; avatar: string } | null;
}

export default function MessengerLayout({ user }: LayoutProps) {
  const [selectedServer, setSelectedServer] = useState<Server>(MOCK_SERVERS[0]);
  const [selectedChannel, setSelectedChannel] = useState<Channel>(MOCK_SERVERS[0].channels[0]);
  const [selectedDM, setSelectedDM] = useState<DirectChat | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('chat');
  const [showMembers, setShowMembers] = useState(true);
  const [showModeration, setShowModeration] = useState(false);
  const [messages, setMessages] = useState<Message[]>(generateMessages('общий'));

  const myName = user?.username ?? 'NightRider_X';
  const myAvatar = user?.avatar ?? '🤖';

  const handleSelectServer = (server: Server) => {
    setSelectedServer(server);
    setSelectedChannel(server.channels[0]);
    setSelectedDM(null);
    setViewMode('chat');
    setMessages(generateMessages(server.channels[0].name));
    setShowModeration(false);
  };

  const handleSelectChannel = (channel: Channel) => {
    setSelectedChannel(channel);
    setSelectedDM(null);
    setViewMode('chat');
    setMessages(generateMessages(channel.name));
  };

  const handleSelectDM = (dm: DirectChat) => {
    setSelectedDM(dm);
    setViewMode('dm');
    setMessages(generateMessages(dm.name));
  };

  const handleSendMessage = (text: string) => {
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      authorId: 'me',
      authorName: myName,
      authorAvatar: myAvatar,
      authorRole: 'owner',
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

  return (
    <div className="flex overflow-hidden bg-[var(--dark-bg)] relative scanlines" style={{ width: '100vw', height: '100vh' }}>
      {/* Ambient background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--neon-cyan) 0%, transparent 70%)', transform: 'translate(-30%, -30%)' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--neon-purple) 0%, transparent 70%)', transform: 'translate(30%, 30%)' }} />

      {/* Servers column */}
      <ServersSidebar
        servers={MOCK_SERVERS}
        dms={MOCK_DMS}
        selectedServer={selectedServer}
        selectedDM={selectedDM}
        viewMode={viewMode}
        onSelectServer={handleSelectServer}
        onSelectDM={handleSelectDM}
        onDMMode={() => setViewMode('dm')}
      />

      {/* Channels/DMs column */}
      <ChannelsSidebar
        server={selectedServer}
        dms={MOCK_DMS}
        selectedChannel={selectedChannel}
        selectedDM={selectedDM}
        viewMode={viewMode}
        onSelectChannel={handleSelectChannel}
        onSelectDM={handleSelectDM}
        onOpenModeration={handleOpenModeration}
        username={myName}
        avatar={myAvatar}
      />

      {/* Main chat */}
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

      {/* Members panel */}
      {showMembers && !showModeration && (
        <MembersPanel members={selectedServer.members} />
      )}

      {/* Moderation panel */}
      {showModeration && (
        <ModerationPanel
          server={selectedServer}
          onClose={handleCloseModeration}
        />
      )}

      {/* Profile bar at bottom of channels */}
      <ProfileBar />
    </div>
  );
}