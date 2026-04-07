'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Eye, EyeOff, MessageCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        // Fetch user id to check whatsapp_configs
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: config } = await supabase
            .from('whatsapp_configs')
            .select('id')
            .eq('user_id', user.id)
            .single();

          if (config) {
            router.push('/dashboard');
          } else {
            router.push('/onboarding');
          }
        }
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111b21]">
      <div className="w-full max-w-md px-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-[#00a884] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-[#00a884]/20">
            <MessageCircle size={32} className="text-white" />
          </div>
          <h1 className="text-[28px] font-light text-[#e9edef] tracking-tight">
            WhatsDash
          </h1>
          <p className="text-[#8696a0] text-sm mt-1">Business Messaging Dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="bg-[#182229] rounded-2xl p-8">
          <h2 className="text-xl text-[#e9edef] font-medium mb-6 text-center">
            Sign in to your account
          </h2>

          {error && (
            <div className="bg-[#ff5c5c]/10 border border-[#ff5c5c]/20 text-[#ff5c5c] text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[#8696a0] text-xs mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@business.com"
                className="w-full bg-[#2a3942] text-[#e9edef] px-4 py-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#00a884]/50 placeholder:text-[#8696a0]/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-[#8696a0] text-xs mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full bg-[#2a3942] text-[#e9edef] px-4 py-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#00a884]/50 placeholder:text-[#8696a0]/50 pr-12 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8696a0] hover:text-[#e9edef]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-[#00a884] text-[#111b21] py-3 rounded-lg font-semibold text-sm hover:bg-[#00a884]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          <p className="text-center text-[#8696a0] text-sm mt-5">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-[#00a884] hover:underline">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
