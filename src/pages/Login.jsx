import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useDocumentTitle from '../hooks/useDocumentTitle';
import toast from 'react-hot-toast';

export default function Login() {
  useDocumentTitle('Login');
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser, loginWithGoogle } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect target after successful login (default to Home)
  const from = location.state?.from?.pathname || '/';

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    try {
      setIsLoading(true);
      await loginUser(email, password);
      toast.success('Successfully logged in!');
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await loginWithGoogle();
      toast.success('Successfully logged in with Google!');
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to login with Google.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-gradient-to-br from-surface to-surface-container-high dark:from-slate-900 dark:to-slate-950">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-[440px] z-10 animate-in fade-in zoom-in duration-500">
        <div className="glass-card bg-white/90 dark:bg-slate-800/95 border border-outline-variant/30 dark:border-slate-700 p-8 md:p-10 rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
          
          <div className="mb-8 text-center md:text-left">
            <h1 className="font-headline-lg text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Welcome Back</h1>
            <p className="font-body-md text-body-md text-gray-600 dark:text-gray-300">
              Login to access your medical tutoring dashboard.
            </p>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="font-label-md text-label-md text-gray-700 dark:text-gray-300 block font-semibold" htmlFor="email">
                Email Address
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline dark:text-gray-400">
                  mail
                </span>
                <input
                  className="w-full pl-10 pr-4 py-3 bg-surface dark:bg-slate-700 border border-outline-variant dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-body-md text-body-md text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  id="email"
                  placeholder="dr.smith@university.edu"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-label-md text-label-md text-gray-700 dark:text-gray-300 block font-semibold" htmlFor="password">
                  Password
                </label>
                <a href="#" className="font-label-md text-label-md text-primary dark:text-primary-fixed-dim hover:underline transition-all">
                  Forgot Password?
                </a>
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline dark:text-gray-400">
                  lock
                </span>
                <input
                  className="w-full pl-10 pr-12 py-3 bg-surface dark:bg-slate-700 border border-outline-variant dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-body-md text-body-md text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface dark:hover:text-white transition-colors"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              className="w-full py-3.5 bg-primary text-on-secondary font-semibold rounded-lg shadow-sm hover:opacity-90 active:scale-[0.98] transition-all flex justify-center items-center gap-2 disabled:opacity-50"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Login'}
              <span className="material-symbols-outlined text-[20px]">login</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-outline-variant dark:border-slate-600"></div>
              <span className="flex-shrink mx-4 font-label-sm text-label-sm text-outline dark:text-gray-400 uppercase tracking-wider">
                Or continue with
              </span>
              <div className="flex-grow border-t border-outline-variant dark:border-slate-600"></div>
            </div>

            {/* Social Login */}
            <button
              onClick={handleGoogleLogin}
              className="w-full py-3 px-4 bg-surface dark:bg-slate-700 border border-outline-variant dark:border-slate-600 rounded-lg flex items-center justify-center gap-3 font-label-md text-label-md text-gray-900 dark:text-white hover:bg-surface-container-high dark:hover:bg-slate-600 transition-colors active:scale-[0.98] disabled:opacity-50"
              type="button"
              disabled={isLoading}
            >
              <img
                alt="Google"
                className="w-5 h-5"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQuE8Bbk4gogBVZcfeo0V8UFtEKI9xdB3kF5mwo-V71XXvaIkqNz-WN36IH_NcWY010yOsfGKXqMWG6kCqQ3huyyxiZcndIyAUOWH5T6MP8jR7BwJHFGfJKYSP7WOHWb6NOb8R8R5BubDY7kD5ZgwgYR6ol7Eii4uSxh3ajis05kX9sCu1pM9Ta_g9KMogWrbqMoXAXbRTIq8FPAX1vb7ZW6m4xTagoX6KzCA9kPZb9THWGbq-uMT2ZlW9JmdZNtDC-Wl3Ov1GR6M"
              />
              Continue with Google
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-10 text-center">
            <p className="font-body-md text-body-md text-gray-600 dark:text-gray-300">
              Don't have an account?
              <Link to="/register" className="text-primary dark:text-primary-fixed-dim font-semibold hover:underline transition-all ml-1">
                Register here
              </Link>
            </p>
          </div>
        </div>

        {/* Secure Indicators */}
        <div className="mt-8 flex justify-center gap-6 opacity-60 text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span className="font-label-sm text-label-sm">Secure Portal</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px]">encrypted</span>
            <span className="font-label-sm text-label-sm">SSL Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
