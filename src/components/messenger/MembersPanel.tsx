import type { Member } from '@/pages/MessengerLayout';

interface Props {
  members: Member[];
}

const roleColors: Record<string, string> = {
  owner: '#ffe600',
  admin: '#ff006e',
  moderator: '#00ffe7',
  member: '#888',
};

const roleBadge: Record<string, string> = {
  owner: '👑',
  admin: '🛡️',
  moderator: '⚔️',
  member: '',
};

const roleLabel: Record<string, string> = {
  owner: 'Владелец',
  admin: 'Администратор',
  moderator: 'Модератор',
  member: 'Участник',
};

const statusColor: Record<string, string> = {
  online: '#00ffe7',
  away: '#ffe600',
  offline: '#444',
};

const groups = ['owner', 'admin', 'moderator', 'member'] as const;

export default function MembersPanel({ members }: Props) {
  return (
    <div className="w-52 flex flex-col flex-shrink-0 overflow-y-auto py-3"
      style={{
        background: 'var(--panel-bg)',
        borderLeft: '1px solid rgba(0,255,231,0.06)',
        scrollbarWidth: 'none',
      }}>
      <p className="px-4 text-xs font-rajdhani font-bold tracking-widest uppercase mb-2"
        style={{ color: 'var(--neon-cyan)', opacity: 0.5 }}>
        Участники — {members.length}
      </p>

      {groups.map(role => {
        const group = members.filter(m => m.role === role && !m.banned);
        if (!group.length) return null;
        return (
          <div key={role} className="mb-3">
            <p className="px-4 text-xs font-rajdhani tracking-widest uppercase mb-1"
              style={{ color: roleColors[role], opacity: 0.7 }}>
              {roleLabel[role]}s
            </p>
            {group.map(member => (
              <button key={member.id}
                className="flex items-center gap-2 w-full px-3 py-1.5 hover:bg-surface transition-all duration-150 rounded-lg mx-1 text-left"
                style={{ width: 'calc(100% - 8px)' }}>
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 flex items-center justify-center text-lg rounded-xl"
                    style={{
                      background: member.status === 'offline' ? 'var(--surface2)' : `${roleColors[member.role]}15`,
                      border: `1px solid ${member.status === 'offline' ? 'transparent' : roleColors[member.role] + '33'}`,
                      opacity: member.status === 'offline' ? 0.5 : 1,
                    }}>
                    {member.avatar}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                    style={{ background: statusColor[member.status], borderColor: 'var(--panel-bg)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-rajdhani font-medium truncate"
                      style={{ color: member.status === 'offline' ? '#555' : '#ddd' }}>
                      {member.name}
                    </span>
                    {roleBadge[role] && <span className="text-xs">{roleBadge[role]}</span>}
                  </div>
                  <p className="text-xs truncate" style={{ color: member.status === 'offline' ? '#444' : '#666' }}>
                    {member.status === 'online' ? 'онлайн' : member.status === 'away' ? 'не активен' : 'оффлайн'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        );
      })}
    </div>
  );
}
