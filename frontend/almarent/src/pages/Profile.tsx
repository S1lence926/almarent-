import { useAuth } from '../context/AuthContext';

export const Profile = () => {
  const { user } = useAuth();

 const initials = user?.name?.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '2rem' }}>
      <div style={{
        background: 'var(--surface)',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'var(--pine-light)',
          color: 'var(--pine)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.75rem',
          fontWeight: 700,
          fontFamily: 'var(--font-display)',
          flexShrink: 0,
        }}>
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          ) : initials}
        </div>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.5rem' }}>{user?.name}</h2>
          <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: '0.9rem' }}>{user?.email}</p>
        </div>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <InfoRow label="Email" value={user?.email} />
          {user?.phone && <InfoRow label="Телефон" value={user.phone} />}
          <InfoRow label="Роль" value="Пользователь" />
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value?: string | null }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 1rem',
    background: 'var(--bg)',
    borderRadius: '10px',
    fontSize: '0.9rem',
  }}>
    <span style={{ color: 'var(--ink-soft)' }}>{label}</span>
    <span style={{ fontWeight: 500 }}>{value || '—'}</span>
  </div>
);