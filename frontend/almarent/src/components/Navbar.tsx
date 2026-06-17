import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <Link to="/" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#2563eb', textDecoration: 'none' }}>
        AlmaRent
      </Link>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {isAuthenticated ? (
          <>
            <Link to="/favorites">Избранное</Link>
            <Link to="/chats">Чаты</Link>
            {user?.role === 'landlord' && <Link to="/listings/create">+ Объявление</Link>}
            <Link to="/profile">{user?.name}</Link>
            <button onClick={logout}>Выйти</button>
          </>
        ) : (
          <>
            <Link to="/login">Войти</Link>
            <Link to="/register">Регистрация</Link>
          </>
        )}
      </div>
    </nav>
  );
};