import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Check, Loader2, AlertCircle, ArrowLeft, Camera } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function AccountSettingsPage() {
  const { user, profile, updateProfile, updateEmail, updatePassword, signOut } = useAuth();
  const { subscription, hasActiveSubscription, plan: currentPlan } = useSubscription();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  // Profile photo
  const [uploading, setUploading] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [nameLoading, setNameLoading] = useState(false);
  const [nameMsg, setNameMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `avatars/${user.id}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
      if (uploadErr) throw uploadErr;
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
      // Add cache-buster
      const url = `${publicUrl}?t=${Date.now()}`;
      await updateProfile({ avatar_url: url });
    } catch (err) {
      console.warn('[Avatar] Upload error:', err);
    }
    setUploading(false);
  };

  const handleNameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameMsg(null);
    if (!displayName.trim()) { setNameMsg({ type: 'error', text: 'Name cannot be empty.' }); return; }
    setNameLoading(true);
    try {
      await updateProfile({ display_name: displayName.trim() });
      setNameMsg({ type: 'success', text: 'Name updated.' });
    } catch {
      setNameMsg({ type: 'error', text: 'Failed to update name.' });
    }
    setNameLoading(false);
  };

  // Email change
  const [newEmail, setNewEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailMsg, setEmailMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!user) {
    router.push('/auth?returnTo=/account', { replace: true });
    return null;
  }

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailMsg(null);

    if (!newEmail.trim()) {
      setEmailMsg({ type: 'error', text: 'Please enter a new email address.' });
      return;
    }
    if (newEmail === user.email) {
      setEmailMsg({ type: 'error', text: 'That is already your current email.' });
      return;
    }

    setEmailLoading(true);
    const { error } = await updateEmail(newEmail.trim());
    setEmailLoading(false);

    if (error) {
      setEmailMsg({ type: 'error', text: error });
    } else {
      setEmailMsg({ type: 'success', text: 'Confirmation email sent to ' + newEmail + '. Check your inbox to complete the change.' });
      setNewEmail('');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);

    if (newPassword.length < 8) {
      setPwMsg({ type: 'error', text: 'Password must be at least 8 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setPwLoading(true);
    const { error } = await updatePassword(newPassword);
    setPwLoading(false);

    if (error) {
      setPwMsg({ type: 'error', text: error });
    } else {
      setPwMsg({ type: 'success', text: 'Password updated successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />

      <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto">
          <button onClick={() => router.back()} className="text-sm text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 font-medium mb-6 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Account Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-10">Manage your profile, email, and password.</p>

          {/* Profile photo + name */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 mb-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Profile</h2>
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-2xl font-bold text-amber-600 dark:text-amber-400 border-2 border-gray-200 dark:border-gray-600">
                    {(profile?.display_name || user.email || '?')[0].toUpperCase()}
                  </div>
                )}
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600 transition-colors shadow-sm disabled:opacity-50"
                  title="Upload photo"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </div>
              {/* Name */}
              <form onSubmit={handleNameChange} className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Display name</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="Your name"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  <button type="submit" disabled={nameLoading || displayName === profile?.display_name}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg text-sm font-semibold transition-colors">
                    {nameLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                  </button>
                </div>
                {nameMsg && (
                  <p className={`mt-1.5 text-xs ${nameMsg.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>{nameMsg.text}</p>
                )}
              </form>
            </div>
          </div>

          {/* Current account info */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 mb-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">Signed in as</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.email}</p>
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Plan</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {hasActiveSubscription
                    ? `${currentPlan === 'in_person' ? 'Mentor-Led' : 'Online'} — Active`
                    : 'Free'}
                </p>
                {subscription && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    Renews {new Date(subscription.period_end).toLocaleDateString()}
                  </p>
                )}
              </div>
              {!hasActiveSubscription && (
                <Link href="/programs#pricing" className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline">
                  Upgrade
                </Link>
              )}
            </div>
          </div>

          {/* Change Email */}
          <div className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Change Email</h2>
            <form onSubmit={handleEmailChange} className="space-y-4">
              <div>
                <label htmlFor="new-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="new-email"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="new@example.com"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>

              {emailMsg && (
                <div className={`flex items-start gap-2 text-sm rounded-lg p-3 ${
                  emailMsg.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                }`}>
                  {emailMsg.type === 'success' ? <Check className="w-4 h-4 mt-0.5 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                  {emailMsg.text}
                </div>
              )}

              <button
                type="submit"
                disabled={emailLoading}
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                {emailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                Update Email
              </button>
            </form>
          </div>

          {/* Divider */}
          <hr className="border-gray-200 dark:border-gray-700 mb-10" />

          {/* Change Password */}
          <div className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm new password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>

              {pwMsg && (
                <div className={`flex items-start gap-2 text-sm rounded-lg p-3 ${
                  pwMsg.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                }`}>
                  {pwMsg.type === 'success' ? <Check className="w-4 h-4 mt-0.5 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                  {pwMsg.text}
                </div>
              )}

              <button
                type="submit"
                disabled={pwLoading}
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                {pwLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                Update Password
              </button>
            </form>
          </div>

          {/* Divider */}
          <hr className="border-gray-200 dark:border-gray-700 mb-10" />

          {/* Sign out */}
          <div>
            <button
              onClick={async () => { await signOut(); router.push('/'); }}
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold"
            >
              Sign out of all devices
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
