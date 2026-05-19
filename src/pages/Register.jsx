import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useDocumentTitle from '../hooks/useDocumentTitle';
import toast from 'react-hot-toast';

export default function Register() {
  useDocumentTitle('Register');
  const navigate = useNavigate();
  const { registerUser, updateUserProfile, loginWithGoogle } = useAuth();

  const [name, setName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Real-time password validations
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasMinLength = password.length >= 6;
  const isPasswordValid = hasUppercase && hasLowercase && hasMinLength;

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error('All fields except Photo URL are required.');
      return;
    }

    if (!isPasswordValid) {
      toast.error('Password does not meet all safety requirements.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      setIsLoading(true);
      // 1. Create User
      const userCredential = await registerUser(email, password);
      
      // 2. Sync profile details (name and avatar photo)
      const finalPhoto = photoURL || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYGCzxWEJXxLkhf1ZYrj5iCh84lmUnuFIDoSiXPS9tqi0XSMFy4oxYx1xn2Xop9PmlOVqx4jt1JhIvBG3DiLzxIDtLLTADZTwB52L5pf5c316c1oOwwf8-LkKBCy_34v7Y7tYh1iOIE2XRVRcHmPQjOQcUe11o9LgOG_mqHWECPS3OaU6VUtzx2-COQ0AScUHCWmKa4gA4op6XAFa8Djiid3j6uw3jGOhed6HAhV8JyCKEidkTKoR7rw8DnYf844tpEPK98Sm2lQk';
      await updateUserProfile(name, finalPhoto);

      toast.success('Registration successful! Welcome to MediQueue.');
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setIsLoading(true);
      await loginWithGoogle();
      toast.success('Successfully authenticated with Google!');
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to register with Google.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-gradient-to-br from-surface to-surface-container-high dark:from-inverse-surface dark:to-background">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-[480px] z-10 animate-in fade-in zoom-in duration-500">
        <div className="glass-card bg-surface-container-lowest/80 dark:bg-inverse-surface/90 border border-outline-variant/30 dark:border-white/10 p-8 md:p-10 rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
          
          <div className="mb-8 text-center md:text-left">
            <h1 className="font-headline-lg text-3xl font-bold text-on-surface mb-2">Create Account</h1>
            <p className="font-body-md text-body-md text-on-surface-variant dark:text-surface-variant">
              Sign up to begin your medical learning journey.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface-variant dark:text-surface-variant block font-semibold" htmlFor="name">
                Full Name
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline dark:text-surface-variant">
                  person
                </span>
                <input
                  className="w-full pl-10 pr-4 py-2.5 bg-surface dark:bg-surface-container-low border border-outline-variant dark:border-white/10 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-body-md text-body-md text-on-surface dark:text-inverse-on-surface"
                  id="name"
                  placeholder="Dr. John Doe"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Photo URL */}
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface-variant dark:text-surface-variant block font-semibold" htmlFor="photoURL">
                Photo URL (Optional)
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline dark:text-surface-variant">
                  image
                </span>
                <input
                  className="w-full pl-10 pr-4 py-2.5 bg-surface dark:bg-surface-container-low border border-outline-variant dark:border-white/10 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-body-md text-body-md text-on-surface dark:text-inverse-on-surface"
                  id="photoURL"
                  placeholder="https://example.com/avatar.jpg"
                  type="url"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface-variant dark:text-surface-variant block font-semibold" htmlFor="email">
                Email Address
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline dark:text-surface-variant">
                  mail
                </span>
                <input
                  className="w-full pl-10 pr-4 py-2.5 bg-surface dark:bg-surface-container-low border border-outline-variant dark:border-white/10 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-body-md text-body-md text-on-surface dark:text-inverse-on-surface"
                  id="email"
                  placeholder="doe.john@university.edu"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface-variant dark:text-surface-variant block font-semibold" htmlFor="password">
                Password
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline dark:text-surface-variant">
                  lock
                </span>
                <input
                  className="w-full pl-10 pr-12 py-2.5 bg-surface dark:bg-surface-container-low border border-outline-variant dark:border-white/10 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-body-md text-body-md text-on-surface dark:text-inverse-on-surface"
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              
              {/* Real-time Password Rules UI */}
              <div className="pt-2 pb-1 space-y-1 text-xs">
                <p className="text-on-surface-variant dark:text-surface-variant font-semibold">Password Requirements:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                  <span className={`flex items-center gap-1 font-medium ${hasMinLength ? 'text-green-600 dark:text-green-400' : 'text-outline'}`}>
                    <span className="material-symbols-outlined text-[14px]">
                      {hasMinLength ? 'check_circle' : 'cancel'}
                    </span>
                    Min 6 chars
                  </span>
                  <span className={`flex items-center gap-1 font-medium ${hasUppercase ? 'text-green-600 dark:text-green-400' : 'text-outline'}`}>
                    <span className="material-symbols-outlined text-[14px]">
                      {hasUppercase ? 'check_circle' : 'cancel'}
                    </span>
                    1 Uppercase
                  </span>
                  <span className={`flex items-center gap-1 font-medium ${hasLowercase ? 'text-green-600 dark:text-green-400' : 'text-outline'}`}>
                    <span className="material-symbols-outlined text-[14px]">
                      {hasLowercase ? 'check_circle' : 'cancel'}
                    </span>
                    1 Lowercase
                  </span>
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface-variant dark:text-surface-variant block font-semibold" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline dark:text-surface-variant">
                  lock_reset
                </span>
                <input
                  className="w-full pl-10 pr-4 py-2.5 bg-surface dark:bg-surface-container-low border border-outline-variant dark:border-white/10 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-body-md text-body-md text-on-surface dark:text-inverse-on-surface"
                  id="confirmPassword"
                  placeholder="••••••••"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Register Button */}
            <button
              className="w-full py-3.5 bg-primary text-on-secondary font-semibold rounded-lg shadow-sm hover:opacity-90 active:scale-[0.98] transition-all flex justify-center items-center gap-2 disabled:opacity-50 mt-6"
              type="submit"
              disabled={isLoading || !isPasswordValid}
            >
              {isLoading ? 'Creating Account...' : 'Register'}
              <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-outline-variant dark:border-white/10"></div>
              <span className="flex-shrink mx-4 font-label-sm text-label-sm text-outline dark:text-surface-variant uppercase tracking-wider">
                Or sign up with
              </span>
              <div className="flex-grow border-t border-outline-variant dark:border-white/10"></div>
            </div>

            {/* Google Signup */}
            <button
              onClick={handleGoogleRegister}
              className="w-full py-3 px-4 bg-surface dark:bg-surface-container-low border border-outline-variant dark:border-white/10 rounded-lg flex items-center justify-center gap-3 font-label-md text-label-md text-on-surface dark:text-inverse-on-surface hover:bg-surface-container-high transition-colors active:scale-[0.98] disabled:opacity-50"
              type="button"
              disabled={isLoading}
            >
              <img
                alt="Google"
                className="w-5 h-5"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQuE8Bbk4gogBVZcfeo0V8UFtEKI9xdB3kF5mwo-V71XXvaIkqNz-WN36IH_NcWY010yOsfGKXqMWG6kCqQ3huyyxiZcndIyAUOWH5T6MP8jR7BwJHFGfJKYSP7WOHWb6NOb8R8R5BubDY7kD5ZgwgYR6ol7Eii4uSxh3ajis05kX9sCu1pM9Ta_g9KMogWrbqMoXAXbRTIq8FPAX1vb7ZW6m4xTagoX6KzCA9kPZb9THWGbq-uMT2ZlW9JmdZNtDC-Wl3Ov1GR6M"
              />
              Sign up with Google
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center">
            <p className="font-body-md text-body-md text-on-surface-variant dark:text-surface-variant">
              Already have an account?
              <Link to="/login" className="text-primary dark:text-primary-fixed-dim font-semibold hover:underline transition-all ml-1">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
