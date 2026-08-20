import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, UserPlus, Sparkles, AlertCircle, Github, Mail, Lock, X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  defaultMode?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithGitHub } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      setLoading(false);
      return;
    }

    if (mode === 'login') {
      const { error } = await signInWithEmail(email, password);
      setLoading(false);
      if (error) {
        setErrorMsg(error.message || 'Failed to sign in.');
      } else if (onClose) {
        onClose();
      }
    } else {
      const { error } = await signUpWithEmail(email, password);
      setLoading(false);
      if (error) {
        setErrorMsg(error.message || 'Failed to sign up.');
      } else {
        setSuccessMsg('Account created successfully! Check your email or sign in.');
      }
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    setErrorMsg(null);
    setLoading(true);
    const res = provider === 'google' ? await signInWithGoogle() : await signInWithGitHub();
    setLoading(false);
    if (res.error) {
      setErrorMsg(res.error.message || `Failed to authenticate with ${provider}.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md liquid-glass-dock p-6 sm:p-8 rounded-3xl border border-[#D6C5B3] shadow-2xl space-y-6">
        
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl liquid-glass-pill hover:bg-[#EFE5D9] text-[#6E5D4F] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass-pill text-xs font-mono font-bold text-[#8C4A1B]">
            <Sparkles className="w-3.5 h-3.5 text-[#A6632B]" />
            <span>LearnStack Authentication</span>
          </div>
          <h2 className="text-2xl font-display font-bold text-[#2A1E17]">
            {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="text-xs font-mono text-[#6E5D4F]">
            {mode === 'login' 
              ? 'Sign in to access your course progress, study rooms, and quizzes.' 
              : 'Join LearnStack to save your learning journey across devices.'}
          </p>
        </div>

        {/* Error / Success Alerts */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-900 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-900 text-xs font-mono flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* OAuth Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => handleOAuth('google')}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl liquid-glass-card hover:border-[#A6632B] transition-all flex items-center justify-center gap-3 text-xs font-mono font-bold text-[#2A1E17] border border-[#D6C5B3]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleOAuth('github')}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl liquid-glass-card hover:border-[#A6632B] transition-all flex items-center justify-center gap-3 text-xs font-mono font-bold text-[#2A1E17] border border-[#D6C5B3]"
          >
            <Github className="w-4 h-4 text-[#2A1E17]" />
            <span>Continue with GitHub</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-[#D6C5B3]" />
          <span className="absolute px-3 bg-[#FAF4ED] text-[10px] font-mono text-[#6E5D4F] uppercase tracking-wider">
            Or with Email
          </span>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-mono font-bold text-[#8C4A1B]">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#A6632B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="student@example.com"
                className="w-full pl-10 pr-4 py-2 rounded-xl liquid-glass-pill text-xs font-mono text-[#2A1E17] placeholder-[#6E5D4F]/60 focus:outline-none focus:border-[#A6632B]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono font-bold text-[#8C4A1B]">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#A6632B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 rounded-xl liquid-glass-pill text-xs font-mono text-[#2A1E17] placeholder-[#6E5D4F]/60 focus:outline-none focus:border-[#A6632B]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#A6632B] via-[#C77A38] to-[#8C4A1B] text-white text-xs font-mono font-bold shadow-md hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            <span>{loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}</span>
          </button>
        </form>

        {/* Switch Mode Footer */}
        <div className="text-center pt-2 text-xs font-mono text-[#6E5D4F]">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-[#A6632B] font-bold hover:underline"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[#A6632B] font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
