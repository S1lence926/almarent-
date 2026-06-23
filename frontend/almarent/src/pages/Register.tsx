import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await register({ ...form, role: 'tenant' });
      login(data.token, data.user);
      navigate('/');
    } catch {
      setError('Ошибка регистрации. Email уже занят.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--surface)' }}>
      <h2 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-display)' }}>Регистрация</h2>
      {error && <p style={{ color: 'var(--terracotta)' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input placeholder="Имя" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
          style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'var(--font-body)' }} />
        <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
          style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'var(--font-body)' }} />
        <input type="password" placeholder="Пароль (минимум 6 символов)" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
          style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'var(--font-body)' }} />
        <button type="submit" style={{ padding: '0.75rem', borderRadius: '8px', background: 'var(--terracotta)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
};