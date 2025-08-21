import { useEffect, useState } from 'react';

export default function DarkModeToggle() {
  const [enabled, setEnabled] = useState(() => {
    const stored = localStorage.getItem('dark');
    return stored ? stored === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (enabled) root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('dark', String(enabled));
  }, [enabled]);

  return (
    <button
      onClick={() => setEnabled((v) => !v)}
      className="text-sm px-2 py-1 border rounded-md"
      title="Toggle dark mode"
    >
      {enabled ? 'Light' : 'Dark'}
    </button>
  );
}

