import React from 'react';
import './App.css';

function App() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background text-on-surface p-6">
      <div className="max-w-md text-center p-8 bg-surface-container rounded-3xl shadow-lg border border-outline-variant/30">
        <span className="material-symbols-outlined text-primary text-5xl mb-4">school</span>
        <h1 className="text-3xl font-bold text-primary mb-2">MediQueue</h1>
        <p className="text-on-surface-variant mb-6 font-medium">
          Precision Medical Tutoring Client Initialized.
        </p>
        <div className="flex gap-2 justify-center">
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
            React + Vite
          </span>
          <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-semibold">
            Tailwind CSS
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
