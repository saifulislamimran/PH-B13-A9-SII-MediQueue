import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import SmoothScroll from './SmoothScroll';

export default function Layout({ children }) {
  return (
    <SmoothScroll>
      <div className="min-h-screen flex flex-col bg-background dark:bg-slate-900 text-on-surface dark:text-gray-100 transition-colors duration-300">
        <Navbar />
        {/* 
          The navbar is fixed and has a height of h-20 (80px) initially, 
          shrinking to h-16 (64px) on scroll. Adding pt-20 matches this offset perfectly.
        */}
        <main className="flex-grow pt-20">
          {children}
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
