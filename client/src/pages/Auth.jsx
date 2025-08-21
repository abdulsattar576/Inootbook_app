import { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div>
      <Navbar />
      <main className="max-w-md mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form className="space-y-3" onSubmit={async (e) => {
          e.preventDefault();
          await login(email, password);
          navigate('/');
        }}>
          <input className="w-full rounded-md border px-3 py-2 text-sm dark:bg-gray-800" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" className="w-full rounded-md border px-3 py-2 text-sm dark:bg-gray-800" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="w-full rounded-md border px-3 py-2 text-sm">Login</button>
        </form>
      </main>
    </div>
  );
}

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div>
      <Navbar />
      <main className="max-w-md mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        <form className="space-y-3" onSubmit={async (e) => {
          e.preventDefault();
          await register(username, email, password);
          navigate('/');
        }}>
          <input className="w-full rounded-md border px-3 py-2 text-sm dark:bg-gray-800" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input className="w-full rounded-md border px-3 py-2 text-sm dark:bg-gray-800" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" className="w-full rounded-md border px-3 py-2 text-sm dark:bg-gray-800" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="w-full rounded-md border px-3 py-2 text-sm">Create account</button>
        </form>
      </main>
    </div>
  );
}

