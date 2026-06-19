import { useAuth } from '../context/AuthContext';

export const Profile = () => {
  const { user } = useAuth();

  return (
    <div style={{ maxWidth: '500px', margin: '3rem auto', padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Личный кабинет</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <p><strong>Имя:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Роль:</strong> {user?.role === 'tenant' ? 'Арендатор' : 'Арендодатель'}</p>
        {user?.phone && <p><strong>Телефон:</strong> {user.phone}</p>}
      </div>
    </div>
  );
};