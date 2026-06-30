'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push('/admin/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch {
      setError('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6 font-sans selection:bg-[#FDFBF7] selection:text-black">
      
      <Link href="/" className="absolute top-8 left-8 font-bold text-2xl tracking-tighter text-[#FDFBF7] hover:opacity-70 transition-opacity">
        NEXUS.
      </Link>

      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#FDFBF7] mb-2 tracking-tight">ADMIN</h1>
          <p className="text-[#888888] text-sm font-bold tracking-widest">AUTHENTICATE TO CONTINUE</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold tracking-widest text-[#888888]">USERNAME</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-black border-b border-[#333333] px-0 py-3 text-[#FDFBF7] focus:outline-none focus:border-[#FDFBF7] transition-colors text-lg"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold tracking-widest text-[#888888]">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-black border-b border-[#333333] px-0 py-3 text-[#FDFBF7] focus:outline-none focus:border-[#FDFBF7] transition-colors text-lg"
            />
          </div>

          {error && (
            <div className="text-red-500 text-xs font-bold tracking-widest mt-2 border border-red-500 p-3 text-center">
              {error.toUpperCase()}
            </div>
          )}

          <button type="submit" disabled={isLoading} className="w-full py-4 mt-6 bg-[#FDFBF7] text-black text-sm font-bold tracking-widest hover:bg-[#dddddd] transition-colors disabled:opacity-50">
            {isLoading ? 'AUTHENTICATING...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
  );
}
