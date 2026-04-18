import { useState } from 'react';
import Icon from '@/components/ui/icon';
import type { Server, Member } from '@/pages/MessengerLayout';

interface Props {
  server: Server;
  onClose: () => void;
}

type ModTab = 'roles' | 'members' | 'bans';

const roleColors: Record<string, string> = {
  owner: '#ffe600',
  admin: '#ff006e',
  moderator: '#00ffe7',
  member: '#888',
};

const roleLabel: Record<string, string> = {
  owner: 'Владелец',
  admin: 'Администратор',
  moderator: 'Модератор',
  member: 'Участник',
};

const permissions = [
  { id: 'send', label: 'Отправлять сообщения', icon: 'MessageSquare' },
  { id: 'read', label: 'Читать историю', icon: 'BookOpen' },
  { id: 'invite', label: 'Приглашать участников', icon: 'UserPlus' },
  { id: 'pin', label: 'Закреплять сообщения', icon: 'Pin' },
  { id: 'manage_channels', label: 'Управлять каналами', icon: 'Settings' },
  { id: 'ban', label: 'Банить пользователей', icon: 'Ban' },
];

const rolePermissions: Record<string, string[]> = {
  owner: ['send', 'read', 'invite', 'pin', 'manage_channels', 'ban'],
  admin: ['send', 'read', 'invite', 'pin', 'manage_channels', 'ban'],
  moderator: ['send', 'read', 'invite', 'pin'],
  member: ['send', 'read'],
};

export default function ModerationPanel({ server, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<ModTab>('members');
  const [selectedRole, setSelectedRole] = useState<string>('moderator');
  const [members, setMembers] = useState(server.members);
  const [bannedUsers, setBannedUsers] = useState<Member[]>([]);

  const handleBan = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;
    setMembers(prev => prev.filter(m => m.id !== memberId));
    setBannedUsers(prev => [...prev, { ...member, banned: true }]);
  };

  const handleUnban = (memberId: string) => {
    const member = bannedUsers.find(m => m.id === memberId);
    if (!member) return;
    setBannedUsers(prev => prev.filter(m => m.id !== memberId));
    setMembers(prev => [...prev, { ...member, banned: false }]);
  };

  const handleChangeRole = (memberId: string, newRole: Member['role']) => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));
  };

  const tabs: { id: ModTab; label: string; icon: string }[] = [
    { id: 'members', label: 'Участники', icon: 'Users' },
    { id: 'roles', label: 'Роли', icon: 'Shield' },
    { id: 'bans', label: 'Баны', icon: 'Ban' },
  ];

  return (
    <div className="w-80 flex flex-col flex-shrink-0 animate-slide-in-right"
      style={{ background: 'var(--panel-bg)', borderLeft: '1px solid rgba(255,0,110,0.15)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: 'rgba(255,0,110,0.15)' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 flex items-center justify-center rounded-lg"
            style={{ background: 'rgba(255,0,110,0.15)', border: '1px solid rgba(255,0,110,0.3)' }}>
            <Icon name="ShieldAlert" size={14} className="text-pink-500" />
          </div>
          <div>
            <p className="text-sm font-rajdhani font-bold tracking-wider text-white">Модерация</p>
            <p className="text-xs text-gray-500">{server.name}</p>
          </div>
        </div>
        <button onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-lg opacity-60 hover:opacity-100 transition-opacity"
          style={{ background: 'var(--surface2)' }}>
          <Icon name="X" size={14} className="text-gray-400" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex px-3 pt-2 gap-1">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-rajdhani font-bold tracking-wider transition-all"
            style={activeTab === tab.id
              ? { background: 'rgba(255,0,110,0.15)', color: '#ff006e', border: '1px solid rgba(255,0,110,0.3)' }
              : { color: '#666', border: '1px solid transparent' }}>
            <Icon name={tab.icon} size={12} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3" style={{ scrollbarWidth: 'none' }}>

        {activeTab === 'members' && (
          <div className="flex flex-col gap-2">
            {members.filter(m => m.role !== 'owner').map(member => (
              <div key={member.id} className="p-3 rounded-xl"
                style={{ background: 'var(--surface)', border: '1px solid var(--surface2)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{member.avatar}</span>
                  <div className="flex-1">
                    <p className="text-sm font-rajdhani font-bold text-white">{member.name}</p>
                    <p className="text-xs" style={{ color: roleColors[member.role] }}>
                      {roleLabel[member.role]}
                    </p>
                  </div>
                  <div className="w-2 h-2 rounded-full"
                    style={{ background: member.status === 'online' ? '#00ffe7' : member.status === 'away' ? '#ffe600' : '#444' }} />
                </div>

                <div className="flex gap-1">
                  <select
                    value={member.role}
                    onChange={e => handleChangeRole(member.id, e.target.value as Member['role'])}
                    className="flex-1 text-xs px-2 py-1 rounded-lg outline-none font-rajdhani cursor-pointer"
                    style={{ background: 'var(--surface2)', color: '#ccc', border: '1px solid rgba(0,255,231,0.15)' }}>
                    <option value="admin">Администратор</option>
                    <option value="moderator">Модератор</option>
                    <option value="member">Участник</option>
                  </select>
                  <button onClick={() => handleBan(member.id)}
                    className="px-2 py-1 rounded-lg text-xs font-rajdhani font-bold transition-all hover:scale-105"
                    style={{ background: 'rgba(255,0,110,0.15)', color: '#ff006e', border: '1px solid rgba(255,0,110,0.3)' }}>
                    <Icon name="Ban" size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'roles' && (
          <div className="flex flex-col gap-3">
            {/* Role selector */}
            <div className="flex gap-1 flex-wrap">
              {Object.keys(rolePermissions).map(role => (
                <button key={role} onClick={() => setSelectedRole(role)}
                  className="px-3 py-1.5 rounded-lg text-xs font-rajdhani font-bold tracking-wider transition-all"
                  style={selectedRole === role
                    ? { background: `${roleColors[role]}22`, color: roleColors[role], border: `1px solid ${roleColors[role]}55` }
                    : { background: 'var(--surface2)', color: '#666', border: '1px solid transparent' }}>
                  {roleLabel[role]}
                </button>
              ))}
            </div>

            {/* Permissions */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-rajdhani tracking-widest uppercase"
                style={{ color: roleColors[selectedRole], opacity: 0.7 }}>
                Разрешения — {roleLabel[selectedRole]}
              </p>
              {permissions.map(perm => {
                const hasPermission = rolePermissions[selectedRole].includes(perm.id);
                return (
                  <div key={perm.id}
                    className="flex items-center justify-between px-3 py-2 rounded-xl"
                    style={{ background: 'var(--surface)', border: '1px solid var(--surface2)' }}>
                    <div className="flex items-center gap-2">
                      <Icon name={perm.icon} size={13} className={hasPermission ? 'text-green-400' : 'text-gray-600'} />
                      <span className="text-xs font-rubik text-gray-300">{perm.label}</span>
                    </div>
                    <div className={`w-8 h-4 rounded-full relative transition-all cursor-pointer`}
                      style={{ background: hasPermission ? 'var(--neon-cyan)' : 'var(--surface2)' }}>
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full transition-all`}
                        style={{
                          background: hasPermission ? 'var(--dark-bg)' : '#555',
                          left: hasPermission ? '18px' : '2px',
                        }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'bans' && (
          <div className="flex flex-col gap-2">
            {bannedUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <div className="w-14 h-14 flex items-center justify-center rounded-2xl"
                  style={{ background: 'var(--surface)', border: '1px solid var(--surface2)' }}>
                  <Icon name="ShieldCheck" size={24} className="text-green-500" />
                </div>
                <p className="text-sm text-gray-500 font-rajdhani">Забаненных нет</p>
              </div>
            ) : bannedUsers.map(member => (
              <div key={member.id} className="flex items-center gap-2 p-3 rounded-xl"
                style={{ background: 'rgba(255,0,110,0.06)', border: '1px solid rgba(255,0,110,0.2)' }}>
                <span className="text-xl opacity-50">{member.avatar}</span>
                <div className="flex-1">
                  <p className="text-sm font-rajdhani font-bold text-gray-400 line-through">{member.name}</p>
                  <p className="text-xs text-pink-600">Заблокирован</p>
                </div>
                <button onClick={() => handleUnban(member.id)}
                  className="px-2 py-1 rounded-lg text-xs font-rajdhani font-bold transition-all"
                  style={{ background: 'rgba(0,255,231,0.1)', color: 'var(--neon-cyan)', border: '1px solid rgba(0,255,231,0.2)' }}>
                  Разбан
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
