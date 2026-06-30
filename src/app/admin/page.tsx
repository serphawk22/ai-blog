'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Lock, User, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
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
      const res = await fetch('/api/admin', {
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
    <div className="min-h-screen relative flex items-center justify-center bg-ds-background p-6 font-sans overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ds-purple/20 rounded-full blur-[120px] animate-float pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ds-cyan/20 rounded-full blur-[120px] animate-float-slow pointer-events-none" style={{ animationDelay: '1s' }}></div>

      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 group z-20">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
          <Sparkles size={18} className="text-white" />
        </div>
        <span className="font-bold text-white tracking-tight text-lg">Nexus AI</span>
      </Link>

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        <div className="glass-panel p-10 md:p-12 rounded-[40px] text-center border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
          
          <div className="w-16 h-16 rounded-2xl bg-gradient-premium mx-auto mb-8 flex items-center justify-center shadow-[0_0_30px_rgba(157,78,221,0.5)]">
            <Lock size={28} className="text-white" />
          </div>

          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Admin Portal</h1>
          <p className="text-slate-400 font-medium mb-10 text-sm">Sign in to manage your Nexus AI content.</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                icon={User}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={Lock}
                required
              />
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-center gap-2 animate-fade-in font-medium">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <Button type="submit" variant="primary" className="w-full py-4 text-lg mt-8" disabled={isLoading}>
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
