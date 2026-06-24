import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <nav style={{
      padding: '1.25rem 2.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      <Link to="/" style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.5rem',
        fontWeight: 600,
        color: 'var(--ink)',
        display: 'flex',
        alignItems: 'baseline',
        gap: '2px',
      }}>
        Alma<span style={{ color: 'var(--terracotta)' }}>Rent</span>
      </Link>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', fontSize: '0.9rem' }}>
        <Link to="/map" style={{ color: 'var(--ink-soft)' }}>🗺 Карта</Link>
        {isAuthenticated ? (
          <>
            <Link to="/favorites" style={{ color: 'var(--ink-soft)' }}>Избранное</Link>
            <Link to="/chats" style={{ color: 'var(--ink-soft)' }}>Чаты</Link>
            <Link to="/my-listings" style={{ color: 'var(--ink-soft)' }}>Мои объявления</Link>
            <Link to="/listings/create" style={{
              background: 'var(--terracotta)',
              color: '#fff',
              padding: '0.55rem 1.1rem',
              borderRadius: '999px',
              fontWeight: 500,
            }}>
              + Объявление
            </Link>
            <Link to="/profile" style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'var(--pine-light)', color: 'var(--pine)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 600, fontSize: '0.85rem',
            }}>
              {user?.name?.[0]?.toUpperCase()}
            </Link>
            <button onClick={() => { logout(); navigate('/'); }} style={{
              background: 'none', border: 'none',
              color: 'var(--ink-soft)', fontSize: '0.9rem', cursor: 'pointer',
            }}>
              Выйти
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'var(--ink-soft)' }}>Войти</Link>
            <Link to="/register" style={{
              background: 'var(--ink)', color: '#fff',
              padding: '0.55rem 1.1rem', borderRadius: '999px', fontWeight: 500,
            }}>
              Регистрация
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};