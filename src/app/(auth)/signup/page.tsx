'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Eye, EyeOff, MessageCircle, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
      } else {
        setSuccess(true);
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

        {success ? (
          <div className="bg-[#182229] rounded-2xl p-8 text-center">
            <div className="w-12 h-12 bg-[#00a884]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle size={24} className="text-[#00a884]" />
            </div>
            <h2 className="text-xl text-[#e9edef] font-medium mb-2">Check your email</h2>
            <p className="text-[#8696a0] text-sm mb-6">
              We&apos;ve sent a confirmation link to <strong className="text-[#e9edef]">{email}</strong>.
              Click the link to activate your account.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-[#00a884] text-[#111b21] px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-[#00a884]/90 transition-colors"
            >
              Go to Login <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="bg-[#182229] rounded-2xl p-8">
            <h2 className="text-xl text-[#e9edef] font-medium mb-6 text-center">
              Create your account
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
                    placeholder="Min 6 characters"
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

              <div>
                <label className="block text-[#8696a0] text-xs mb-1.5 uppercase tracking-wider">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Re-enter password"
                  className="w-full bg-[#2a3942] text-[#e9edef] px-4 py-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#00a884]/50 placeholder:text-[#8696a0]/50 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-[#00a884] text-[#111b21] py-3 rounded-lg font-semibold text-sm hover:bg-[#00a884]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>

            <p className="text-center text-[#8696a0] text-sm mt-5">
              Already have an account?{' '}
              <Link href="/login" className="text-[#00a884] hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
