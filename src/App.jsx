import React from 'react';
import Layout from './components/Layout';
import { useTheme } from './context/ThemeContext';
import toast from 'react-hot-toast';

function App() {
  const { theme } = useTheme();

  const handleTestToast = () => {
    toast.success(`Active Theme: ${theme.toUpperCase()}`);
  };

  return (
    <Layout>
      <div className="flex flex-col justify-center items-center py-20 px-6">
        <div className="max-w-md w-full text-center p-8 bg-surface-container-lowest rounded-3xl shadow-xl border border-outline-variant/30 dark:bg-inverse-surface/30">
          <span className="material-symbols-outlined text-primary text-5xl mb-4">school</span>
          <h1 className="text-3xl font-bold text-primary dark:text-primary-fixed-dim mb-2 tracking-tight">
            MediQueue
          </h1>
          <p className="text-on-surface-variant dark:text-surface-variant mb-6 font-medium">
            Phase 3: Navbar and Footer components created and rendered inside a global Layout structure!
          </p>
          
          <div className="flex flex-col gap-3 justify-center items-center">
            <button
              onClick={handleTestToast}
              className="flex items-center gap-2 px-6 py-2.5 bg-secondary text-on-secondary rounded-full font-semibold hover:opacity-90 active:scale-95 transition-all"
            >
              Show Test Toast
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;
