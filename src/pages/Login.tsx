import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Sun, Moon, User as UserIcon, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Logo } from '../components/UI/Logo';
import { BinaryWatermark } from '../components/UI/BinaryWatermark';

interface AuthForm {
  name?: string;
  email: string;
  password: string;
  role?: 'Admin' | 'Recruiter' | 'Manager';
}

const DEMO_CREDENTIALS = [
  { label: 'Admin', email: 'admin@binaryhire.com', password: 'admin123' },
  { label: 'Recruiter', email: 'recruiter@binaryhire.com', password: 'recruiter123' },
];

export const LoginPage: React.FC = () => {
  const { login, signUp, isAuthenticated, isLoading: authLoading } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AuthForm>({
    defaultValues: { name: '', email: '', password: '', role: 'Recruiter' },
  });

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const toggleAuthMode = () => {
    setIsSignUp((v) => !v);
    setError('');
    reset();
  };

  const fillDemo = (email: string, pass: string) => {
    setIsSignUp(false);
    setValue('email', email);
    setValue('password', pass);
  };

  const onSubmit = async (data: AuthForm) => {
    setError('');
    try {
      if (isSignUp) {
        if (!data.name || data.name.trim() === '') {
          setError('Full Name is required for registration.');
          return;
        }
        await signUp(data.name.trim(), data.email.trim(), data.password, data.role || 'Recruiter');
      } else {
        await login(data.email.trim(), data.password);
      }
    } catch (err: any) {
      setError(err?.message || (isSignUp ? 'Registration failed. Please try again.' : 'Invalid email or password.'));
    }
  };

  return (
    <div
      className="w-full min-h-screen flex relative transition-colors duration-200"
      style={{
        background: isDark ? '#08070b' : '#f5f4fa',
        color: isDark ? '#f2f1f5' : '#18141f',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Top right Theme Toggle Button */}
      <button
        id="login-theme-toggle"
        onClick={toggleTheme}
        className="absolute top-5 right-5 z-30 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-105"
        style={{
          background: isDark ? '#111116' : '#ffffff',
          border: isDark ? '1px solid #24212c' : '1px solid #e7e4ef',
          boxShadow: isDark ? '0 0 12px rgba(201,77,255,0.2)' : '0 2px 8px rgba(0,0,0,0.08)',
        }}
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun size={18} className="text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
        ) : (
          <Moon size={18} className="text-indigo-600 drop-shadow-[0_0_6px_rgba(79,70,229,0.3)]" />
        )}
      </button>

      <style>{`
        @keyframes floatLogo {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 40px 6px rgba(201,77,255,0.18); }
          50% { box-shadow: 0 0 60px 12px rgba(201,77,255,0.3); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s cubic-bezier(.4,0,.2,1) both; }
        .logo-float { animation: floatLogo 4.5s ease-in-out infinite, glowPulse 3.4s ease-in-out infinite; }
        .field {
          transition: all 0.25s cubic-bezier(.4,0,.2,1);
        }
        .field:focus-within {
          border-color: #c94dff !important;
          box-shadow: 0 0 0 3px rgba(201,77,255,0.14);
        }
        .btn-primary {
          transition: all 0.25s cubic-bezier(.4,0,.2,1);
          background-size: 160% 100%;
          background-position: 0% 0%;
        }
        .btn-primary:hover {
          background-position: 100% 0%;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(201,77,255,0.35);
        }
        .social-btn { transition: all 0.2s ease; }
        .social-btn:hover { border-color: #c94dff !important; }
      `}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {/* Left brand panel */}
      <div
        className="hidden md:flex w-[46%] relative flex-col justify-between px-12 py-12 overflow-hidden transition-colors duration-200"
        style={{
          background: isDark ? '#0c0b10' : '#ffffff',
          borderRight: isDark ? '1px solid #1a1820' : '1px solid #e7e4ef',
        }}
      >
        <BinaryWatermark />

        <div className="relative h-6" />

        <div className="relative flex flex-col items-center text-center">
          <div
            className="logo-float rounded-3xl mb-8 p-6 flex items-center justify-center transition-colors duration-200"
            style={{
              background: isDark ? '#0c0b10' : '#ffffff',
              border: isDark ? '1px solid #24212c' : '1px solid #e7e4ef',
            }}
          >
            <Logo size="xl" showText={false} />
          </div>
          <h1
            className="text-3xl font-semibold mb-3 fade-up"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: isDark ? '#f2f1f5' : '#18141f',
            }}
          >
            BinaryHire SRMIST
          </h1>
          <p
            className="text-sm max-w-sm fade-up"
            style={{ color: isDark ? '#9a98a6' : '#6b6875', animationDelay: '0.08s' }}
          >
            One centralized hiring workspace for SRMIST — manage candidate pipelines, streamline interviews, and hire top talent with ease.
          </p>

          <div className="grid grid-cols-2 gap-3 w-full max-w-sm mt-8 fade-up" style={{ animationDelay: '0.12s' }}>
            {[
              { label: 'Active Roles', value: '24+' },
              { label: 'Candidates', value: '500+' },
              { label: 'Hired', value: '87' },
              { label: 'Avg Time to Hire', value: '14d' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-3 rounded-xl text-left transition-colors duration-200"
                style={{
                  background: isDark ? '#111116' : '#ffffff',
                  border: isDark ? '1px solid #1f1d27' : '1px solid #e7e4ef',
                }}
              >
                <p
                  className="text-xl font-bold"
                  style={{
                    color: isDark ? '#f2f1f5' : '#18141f',
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {stat.value}
                </p>
                <p className="text-xs" style={{ color: isDark ? '#6f6d7a' : '#6b6875' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-between text-xs" style={{ color: isDark ? '#6f6d7a' : '#6b6875' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>binaryhire.srmist.edu.in</span>
          <div className="flex gap-4">
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </div>

      {/* Right auth panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-y-auto">
        <div className="w-full max-w-[380px]">
          {/* Mobile Logo Header */}
          <div className="mb-6 md:hidden fade-up">
            <Logo size="md" />
          </div>

          {/* Mode Switcher Tabs */}
          <div
            className="flex p-1 rounded-2xl mb-6 fade-up"
            style={{
              background: isDark ? '#111116' : '#eae7f2',
              border: isDark ? '1px solid #24212c' : '1px solid #e7e4ef',
            }}
          >
            <button
              type="button"
              onClick={() => { setIsSignUp(false); setError(''); reset(); }}
              className="flex-1 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200"
              style={{
                background: !isSignUp ? (isDark ? '#1f1c29' : '#ffffff') : 'transparent',
                color: !isSignUp ? (isDark ? '#f2f1f5' : '#18141f') : (isDark ? '#8b899a' : '#6b6875'),
                boxShadow: !isSignUp ? '0 2px 8px rgba(0,0,0,0.12)' : 'none',
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsSignUp(true); setError(''); reset(); }}
              className="flex-1 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200"
              style={{
                background: isSignUp ? (isDark ? '#1f1c29' : '#ffffff') : 'transparent',
                color: isSignUp ? (isDark ? '#f2f1f5' : '#18141f') : (isDark ? '#8b899a' : '#6b6875'),
                boxShadow: isSignUp ? '0 2px 8px rgba(0,0,0,0.12)' : 'none',
              }}
            >
              Sign Up
            </button>
          </div>

          <div className="mb-6 fade-up">
            <h2
              className="text-2xl font-semibold mb-2"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: isDark ? '#f2f1f5' : '#18141f',
              }}
            >
              {isSignUp ? 'Create an account' : 'Welcome back, recruiter.'}
            </h2>
            <p className="text-sm" style={{ color: isDark ? '#8b899a' : '#6b6875' }}>
              {isSignUp ? 'Sign up to get started with BinaryHire' : 'Sign in to pick up where you left off.'}
            </p>
          </div>

          {/* Quick Demo Credentials Buttons (Sign in mode only) */}
          {!isSignUp && (
            <div className="mb-5 fade-up" style={{ animationDelay: '0.04s' }}>
              <p className="text-xs mb-2 font-medium" style={{ color: isDark ? '#6f6d7a' : '#6b6875' }}>Quick Demo Fill:</p>
              <div className="flex gap-2">
                {DEMO_CREDENTIALS.map((cred) => (
                  <button
                    key={cred.label}
                    type="button"
                    onClick={() => fillDemo(cred.email, cred.password)}
                    className="social-btn flex-1 py-2 px-3 rounded-xl text-xs font-medium border cursor-pointer"
                    style={{
                      background: isDark ? '#111116' : '#ffffff',
                      borderColor: isDark ? '#24212c' : '#e7e4ef',
                      color: isDark ? '#c94dff' : '#9333ea',
                    }}
                  >
                    ⚡ Demo: {cred.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 mb-6 fade-up" style={{ animationDelay: '0.06s' }}>
            <button
              type="button"
              className="social-btn w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium cursor-pointer"
              style={{
                background: isDark ? '#111116' : '#ffffff',
                border: isDark ? '1px solid #24212c' : '1px solid #e7e4ef',
                color: isDark ? '#f2f1f5' : '#18141f',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
            <button
              type="button"
              className="social-btn w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium cursor-pointer"
              style={{
                background: isDark ? '#111116' : '#ffffff',
                border: isDark ? '1px solid #24212c' : '1px solid #e7e4ef',
                color: isDark ? '#f2f1f5' : '#18141f',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              Continue with GitHub
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6 fade-up" style={{ animationDelay: '0.08s' }}>
            <div className="flex-1 h-px" style={{ background: isDark ? '#1f1d27' : '#e7e4ef' }} />
            <span className="text-xs" style={{ color: isDark ? '#6f6d7a' : '#6b6875' }}>
              {isSignUp ? 'or sign up with email' : 'or sign in with email'}
            </span>
            <div className="flex-1 h-px" style={{ background: isDark ? '#1f1d27' : '#e7e4ef' }} />
          </div>

          {error && (
            <div
              className="flex items-center gap-2 p-3 mb-4 rounded-xl text-xs fade-up"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}
            >
              <AlertCircle size={15} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" id="login-form">
            {/* Full Name field (Sign Up only) */}
            {isSignUp && (
              <div className="fade-up" style={{ animationDelay: '0.09s' }}>
                <label htmlFor="signup-name" className="text-xs font-medium mb-1.5 block" style={{ color: isDark ? '#a8a6b3' : '#6b6875' }}>
                  Full Name
                </label>
                <div
                  className="field flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
                  style={{
                    background: isDark ? '#111116' : '#ffffff',
                    border: isDark ? '1px solid #24212c' : '1px solid #e7e4ef',
                  }}
                >
                  <UserIcon size={15} style={{ color: isDark ? '#6f6d7a' : '#6b6875' }} />
                  <input
                    id="signup-name"
                    type="text"
                    placeholder="e.g. Alex Morgan"
                    {...register('name', {
                      required: isSignUp ? 'Full Name is required' : false,
                    })}
                    className="bg-transparent outline-none text-sm w-full"
                    style={{ color: isDark ? '#f2f1f5' : '#18141f' }}
                  />
                </div>
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
              </div>
            )}

            {/* Email field */}
            <div className="fade-up" style={{ animationDelay: '0.1s' }}>
              <label htmlFor="login-email" className="text-xs font-medium mb-1.5 block" style={{ color: isDark ? '#a8a6b3' : '#6b6875' }}>
                Email address
              </label>
              <div
                className="field flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
                style={{
                  background: isDark ? '#111116' : '#ffffff',
                  border: isDark ? '1px solid #24212c' : '1px solid #e7e4ef',
                }}
              >
                <Mail size={15} style={{ color: isDark ? '#6f6d7a' : '#6b6875' }} />
                <input
                  id="login-email"
                  type="email"
                  placeholder="name@srmist.edu.in"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' },
                  })}
                  className="bg-transparent outline-none text-sm w-full"
                  style={{ color: isDark ? '#f2f1f5' : '#18141f' }}
                />
              </div>
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
            </div>

            {/* Role dropdown (Sign Up only) */}
            {isSignUp && (
              <div className="fade-up" style={{ animationDelay: '0.11s' }}>
                <label htmlFor="signup-role" className="text-xs font-medium mb-1.5 block" style={{ color: isDark ? '#a8a6b3' : '#6b6875' }}>
                  Workspace Role
                </label>
                <div
                  className="field flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
                  style={{
                    background: isDark ? '#111116' : '#ffffff',
                    border: isDark ? '1px solid #24212c' : '1px solid #e7e4ef',
                  }}
                >
                  <Shield size={15} style={{ color: isDark ? '#6f6d7a' : '#6b6875' }} />
                  <select
                    id="signup-role"
                    {...register('role')}
                    className="bg-transparent outline-none text-sm w-full cursor-pointer"
                    style={{ color: isDark ? '#f2f1f5' : '#18141f' }}
                  >
                    <option value="Recruiter" style={{ background: isDark ? '#111116' : '#ffffff' }}>Recruiter</option>
                    <option value="Admin" style={{ background: isDark ? '#111116' : '#ffffff' }}>Admin</option>
                    <option value="Manager" style={{ background: isDark ? '#111116' : '#ffffff' }}>Manager</option>
                  </select>
                </div>
              </div>
            )}

            {/* Password field */}
            <div className="fade-up" style={{ animationDelay: '0.13s' }}>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="text-xs font-medium" style={{ color: isDark ? '#a8a6b3' : '#6b6875' }}>
                  Password
                </label>
                {!isSignUp && (
                  <span className="text-xs cursor-pointer" style={{ color: isDark ? '#c94dff' : '#9333ea' }}>
                    Forgot password?
                  </span>
                )}
              </div>
              <div
                className="field flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
                style={{
                  background: isDark ? '#111116' : '#ffffff',
                  border: isDark ? '1px solid #24212c' : '1px solid #e7e4ef',
                }}
              >
                <Lock size={15} style={{ color: isDark ? '#6f6d7a' : '#6b6875' }} />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Minimum 6 characters' },
                  })}
                  className="bg-transparent outline-none text-sm w-full"
                  style={{ color: isDark ? '#f2f1f5' : '#18141f' }}
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)}>
                  {showPassword ? (
                    <EyeOff size={15} style={{ color: isDark ? '#6f6d7a' : '#6b6875' }} />
                  ) : (
                    <Eye size={15} style={{ color: isDark ? '#6f6d7a' : '#6b6875' }} />
                  )}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
            </div>

            <label className="flex items-center gap-2 text-xs fade-up cursor-pointer" style={{ color: isDark ? '#8b899a' : '#6b6875', animationDelay: '0.16s' }}>
              <input type="checkbox" className="accent-[#c94dff] rounded" defaultChecked />
              {isSignUp ? 'I agree to the Terms of Service & Privacy Policy' : 'Keep me signed in on this device'}
            </label>

            <button
              type="submit"
              id="login-submit"
              disabled={isSubmitting || authLoading}
              className="btn-primary w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 fade-up disabled:opacity-50 cursor-pointer mt-1"
              style={{
                background: 'linear-gradient(90deg,#c94dff,#7c3aed,#c94dff)',
                color: '#0c0b10',
                animationDelay: '0.19s',
              }}
            >
              {isSignUp ? 'Create BinaryHire Account' : 'Sign in to BinaryHire'}
            </button>
          </form>

          {/* Toggle link */}
          <div className="mt-6 text-center text-xs fade-up" style={{ animationDelay: '0.22s' }}>
            <span style={{ color: isDark ? '#8b899a' : '#6b6875' }}>
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            </span>
            <button
              type="button"
              onClick={toggleAuthMode}
              className="font-semibold cursor-pointer hover:underline"
              style={{ color: isDark ? '#c94dff' : '#9333ea' }}
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
