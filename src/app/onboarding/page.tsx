'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import {
  MessageCircle,
  Key,
  Phone,
  Building2,
  Shield,
  Copy,
  Check,
  Loader2,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [userId, setUserId] = useState('');
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [wabaId, setWabaId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [webhookVerifyToken, setWebhookVerifyToken] = useState('');

  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ valid: boolean; message: string } | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [existingConfig, setExistingConfig] = useState(false);

  const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com'}/api/webhook/${userId}`;

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        // Check existing config
        const { data: config } = await supabase
          .from('whatsapp_configs')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (config) {
          setExistingConfig(true);
          setPhoneNumberId(config.phone_number_id);
          setWabaId(config.waba_id);
          setAccessToken(config.access_token);
          setWebhookVerifyToken(config.webhook_verify_token);
        }
      }
    };
    getUser();
  }, [supabase]);

  const handleCopyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/verify-meta-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken, phoneNumberId }),
      });
      const data = await res.json();
      setTestResult({
        valid: data.valid,
        message: data.valid
          ? `Connected! Phone: ${data.phoneNumber || 'verified'}`
          : data.error || 'Connection failed',
      });
    } catch {
      setTestResult({ valid: false, message: 'Network error' });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (existingConfig) {
        const { error: updateError } = await supabase
          .from('whatsapp_configs')
          .update({
            phone_number_id: phoneNumberId,
            waba_id: wabaId,
            access_token: accessToken,
            webhook_verify_token: webhookVerifyToken,
            is_active: true,
          })
          .eq('user_id', userId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('whatsapp_configs')
          .insert({
            user_id: userId,
            phone_number_id: phoneNumberId,
            waba_id: wabaId,
            access_token: accessToken,
            webhook_verify_token: webhookVerifyToken,
          });
        if (insertError) throw insertError;
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Failed to save configuration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111b21] flex flex-col items-center py-12 px-4">
      {/* Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 bg-[#00a884] rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-[#00a884]/20">
          <MessageCircle size={28} className="text-white" />
        </div>
        <h1 className="text-2xl font-light text-[#e9edef]">
          {existingConfig ? 'Update Configuration' : 'Setup Your WhatsApp'}
        </h1>
        <p className="text-[#8696a0] text-sm mt-1 text-center max-w-md">
          Enter your Meta Business credentials to connect your WhatsApp Business account
        </p>
      </div>

      <div className="w-full max-w-2xl space-y-6">
        {/* Credentials Form */}
        <form onSubmit={handleSave} className="bg-[#182229] rounded-2xl p-8">
          {error && (
            <div className="bg-[#ff5c5c]/10 border border-[#ff5c5c]/20 text-[#ff5c5c] text-sm px-4 py-3 rounded-lg mb-5 flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Phone Number ID */}
            <div>
              <label className="flex items-center gap-2 text-[#8696a0] text-xs mb-1.5 uppercase tracking-wider">
                <Phone size={14} /> WhatsApp Phone Number ID
              </label>
              <input
                type="text"
                value={phoneNumberId}
                onChange={(e) => setPhoneNumberId(e.target.value)}
                required
                placeholder="e.g. 109876543210"
                className="w-full bg-[#2a3942] text-[#e9edef] px-4 py-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#00a884]/50 placeholder:text-[#8696a0]/50 transition-all"
              />
            </div>

            {/* WABA ID */}
            <div>
              <label className="flex items-center gap-2 text-[#8696a0] text-xs mb-1.5 uppercase tracking-wider">
                <Building2 size={14} /> Business Account ID (WABA ID)
              </label>
              <input
                type="text"
                value={wabaId}
                onChange={(e) => setWabaId(e.target.value)}
                required
                placeholder="e.g. 102938475610"
                className="w-full bg-[#2a3942] text-[#e9edef] px-4 py-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#00a884]/50 placeholder:text-[#8696a0]/50 transition-all"
              />
            </div>

            {/* Access Token */}
            <div>
              <label className="flex items-center gap-2 text-[#8696a0] text-xs mb-1.5 uppercase tracking-wider">
                <Key size={14} /> Permanent Access Token
              </label>
              <textarea
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                required
                placeholder="System User Token from Meta Business Manager"
                rows={3}
                className="w-full bg-[#2a3942] text-[#e9edef] px-4 py-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#00a884]/50 placeholder:text-[#8696a0]/50 resize-none font-mono transition-all"
              />
            </div>

            {/* Webhook Verify Token */}
            <div>
              <label className="flex items-center gap-2 text-[#8696a0] text-xs mb-1.5 uppercase tracking-wider">
                <Shield size={14} /> Webhook Verify Token
              </label>
              <input
                type="text"
                value={webhookVerifyToken}
                onChange={(e) => setWebhookVerifyToken(e.target.value)}
                required
                placeholder="Create a secret string (any value)"
                className="w-full bg-[#2a3942] text-[#e9edef] px-4 py-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#00a884]/50 placeholder:text-[#8696a0]/50 transition-all"
              />
              <p className="text-[#8696a0] text-xs mt-1.5">
                Create any secret string. You&apos;ll paste this same string in Meta Dashboard → Webhooks.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-2.5 bg-[#00a884] text-[#111b21] rounded-lg font-semibold text-sm hover:bg-[#00a884]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Saving...
                </>
              ) : (
                existingConfig ? 'Update & Continue' : 'Save & Continue'
              )}
            </button>

            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing || !accessToken || !phoneNumberId}
              className="px-5 py-2.5 rounded-lg border border-[#00a884]/30 text-[#00a884] text-sm font-medium hover:bg-[#00a884]/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {testing ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
              Test Connection
            </button>
          </div>

          {testResult && (
            <div className={`mt-3 text-sm flex items-center gap-1.5 ${testResult.valid ? 'text-[#00a884]' : 'text-[#ff5c5c]'}`}>
              {testResult.valid ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {testResult.message}
            </div>
          )}
        </form>

        {/* Webhook URL Card */}
        {userId && (
          <div className="bg-[#182229] rounded-2xl p-6">
            <h3 className="text-[#e9edef] text-sm font-medium mb-2 flex items-center gap-2">
              <ExternalLink size={16} className="text-[#00a884]" />
              Your Webhook URL
            </h3>
            <p className="text-[#8696a0] text-xs mb-3">
              Copy this URL and paste it in Meta Dashboard → WhatsApp → Configuration → Webhook URL
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-[#0b141a] text-[#00a884] px-4 py-3 rounded-lg text-xs font-mono truncate">
                {webhookUrl}
              </code>
              <button
                onClick={handleCopyWebhookUrl}
                className="shrink-0 p-3 rounded-lg bg-[#2a3942] hover:bg-[#3a4f5b] transition-colors text-[#8696a0] hover:text-[#e9edef]"
              >
                {copied ? <Check size={16} className="text-[#00a884]" /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-[#182229] rounded-2xl p-6">
          <h3 className="text-[#e9edef] text-sm font-medium mb-3">Quick Setup Guide</h3>
          <ol className="list-decimal list-inside text-[#8696a0] text-sm space-y-2">
            <li>Go to <a href="https://developers.facebook.com" target="_blank" rel="noreferrer" className="text-[#00a884] hover:underline">developers.facebook.com</a> and create a Meta App</li>
            <li>Add the <strong className="text-[#e9edef]">WhatsApp</strong> product to your app</li>
            <li>Get your Phone Number ID from API Setup</li>
            <li>Generate a <strong className="text-[#e9edef]">System User Token</strong> (permanent) via Business Manager</li>
            <li>Paste the Webhook URL above into Webhooks → Callback URL</li>
            <li>Subscribe to: <code className="text-[#00a884]">messages</code>, <code className="text-[#00a884]">message_deliveries</code>, <code className="text-[#00a884]">message_reads</code></li>
          </ol>
        </div>
      </div>
    </div>
  );
}
