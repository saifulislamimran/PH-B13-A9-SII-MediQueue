import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface transition-colors duration-300">
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
  );
}
