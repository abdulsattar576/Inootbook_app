import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useState } from 'react';
import DarkModeToggle from './DarkModeToggle.jsx';

export default function Navbar({ onSearch }) {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  return (
    <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        <Link to="/" className="font-bold text-xl">MERN Blog</Link>
        <div className="flex-1" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearch?.(e.target.value);
          }}
          placeholder="Search articles..."
          className="hidden sm:block w-72 rounded-md border px-3 py-1.5 text-sm dark:bg-gray-800"
        />
        <nav className="flex items-center gap-3">
          {user?.role === 'admin' && (
            <>
              <NavLink to="/admin" className="text-sm">Admin</NavLink>
              <NavLink to="/admin/articles/new" className="text-sm">New</NavLink>
            </>
          )}
          {!user && (
            <>
              <NavLink to="/login" className="text-sm">Login</NavLink>
              <NavLink to="/register" className="text-sm">Register</NavLink>
            </>
          )}
          {user && (
            <>
              <span className="text-sm">Hi, {user.username}</span>
              <button className="text-sm" onClick={() => { logout(); navigate('/'); }}>Logout</button>
            </>
          )}
          <DarkModeToggle />
        </nav>
      </div>
    </header>
  );
}

