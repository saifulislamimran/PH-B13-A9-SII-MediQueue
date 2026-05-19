import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-surface-container-highest dark:bg-inverse-surface w-full py-12 px-6 border-t border-outline-variant dark:border-white/10 transition-colors duration-300">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto">
        {/* Info Area */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary dark:text-primary-fixed-dim text-3xl">school</span>
            <span className="font-headline-lg text-headline-lg font-bold text-primary dark:text-primary-fixed-dim">
              MediQueue
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant dark:text-surface-variant leading-relaxed">
            Precision in medical tutoring. Empowering the next generation of physicians through expert mentorship.
          </p>
          {/* Social Icons including modern X logo */}
          <div className="flex items-center gap-4">
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-surface-container-high dark:bg-on-surface-variant/20 flex items-center justify-center text-primary dark:text-primary-fixed-dim hover:bg-primary hover:text-on-secondary transition-all"
              aria-label="Visit our X profile"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-surface-container-high dark:bg-on-surface-variant/20 flex items-center justify-center text-primary dark:text-primary-fixed-dim hover:bg-primary hover:text-on-secondary transition-all"
              aria-label="Visit our Github profile"
            >
              <span className="material-symbols-outlined text-xl">hub</span>
            </a>
            <a
              href="https://mediqueue.edu"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-surface-container-high dark:bg-on-surface-variant/20 flex items-center justify-center text-primary dark:text-primary-fixed-dim hover:bg-primary hover:text-on-secondary transition-all"
              aria-label="Visit our web platform"
            >
              <span className="material-symbols-outlined text-xl">public</span>
            </a>
          </div>
        </div>

        {/* Services Area */}
        <div>
          <h4 className="font-title-md text-title-md text-on-surface dark:text-inverse-on-surface mb-6">Services</h4>
          <ul className="space-y-4">
            <li>
              <a href="#" className="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed-dim transition-colors">
                USMLE Prep
              </a>
            </li>
            <li>
              <a href="#" className="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed-dim transition-colors">
                MCAT Prep
              </a>
            </li>
            <li>
              <a href="#" className="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed-dim transition-colors">
                Clinical Skills
              </a>
            </li>
            <li>
              <a href="#" className="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed-dim transition-colors">
                Anatomy Lab
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Area */}
        <div>
          <h4 className="font-title-md text-title-md text-on-surface dark:text-inverse-on-surface mb-6">Contact</h4>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-on-surface-variant dark:text-surface-variant">
              <span className="material-symbols-outlined text-sm">mail</span>
              support@mediqueue.edu
            </li>
            <li className="flex items-center gap-3 text-on-surface-variant dark:text-surface-variant">
              <span class="material-symbols-outlined text-sm">call</span>
              +1 (555) 0123
            </li>
            <li className="flex items-center gap-3 text-on-surface-variant dark:text-surface-variant">
              <span className="material-symbols-outlined text-sm">location_on</span>
              Boston Medical Center, MA
            </li>
          </ul>
        </div>

        {/* Subscribe Area */}
        <div>
          <h4 className="font-title-md text-title-md text-on-surface dark:text-inverse-on-surface mb-6">Subscribe</h4>
          <p className="font-body-md text-body-md text-on-surface-variant dark:text-surface-variant mb-6">
            Get exam tips and tutor highlights in your inbox.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="relative">
            <input
              className="w-full bg-surface-container-high dark:bg-on-surface-variant/10 border-none rounded-xl py-3 pl-4 pr-12 focus:ring-2 focus:ring-primary text-on-surface dark:text-inverse-on-surface"
              placeholder="Email address"
              type="email"
              required
            />
            <button
              type="submit"
              className="absolute right-2 top-2 p-1.5 bg-primary text-on-secondary rounded-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center"
              aria-label="Subscribe"
            >
              <span className="material-symbols-outlined text-md">send</span>
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-on-surface-variant dark:text-surface-variant font-label-md text-label-md">
          © {new Date().getFullYear()} MediQueue. Precision in medical tutoring.
        </p>
        <div className="flex gap-8 font-label-md text-label-md">
          <a href="#" className="text-on-surface-variant dark:text-surface-variant hover:text-primary">
            Privacy Policy
          </a>
          <a href="#" className="text-on-surface-variant dark:text-surface-variant hover:text-primary">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
