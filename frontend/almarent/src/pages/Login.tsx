import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(form);
      authLogin(data.token, data.user);
      navigate('/');
    } catch {
      setError('Неверный email или пароль');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Вход</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input type="email" placeholder="Email" value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
        <input type="password" placeholder="Пароль" value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
        <button type="submit" style={{ padding: '0.75rem', borderRadius: '8px', background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
          Войти
        </button>
      </form>
    </div>
  );
};