'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, BookOpen, Settings, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col justify-between p-6 shrink-0 hidden md:flex">
        <div className="space-y-8">
          {/* Logo / Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-650 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/20">
              MQ
            </div>
            <div>
              <h3 className="font-extrabold text-sm leading-none">MediQueue</h3>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold tracking-wider uppercase">Admin Hub</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30 rounded-xl transition-all"
            >
              <LayoutDashboard className="w-4 h-4" />
              Overview & Metrics
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              <Users className="w-4 h-4" />
              Manage Tutors
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              <BookOpen className="w-4 h-4" />
              Reservations
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </nav>
        </div>

        {/* User Profile */}
        <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs uppercase">
              AD
            </div>
            <div>
              <p className="text-xs font-bold">Admin Controller</p>
              <span className="text-[10px] text-gray-500">Active Session</span>
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-bold transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Exit Admin
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-650 text-white flex items-center justify-center font-bold text-md">
              MQ
            </div>
            <span className="font-extrabold text-sm">MediQueue Admin</span>
          </div>
          <Link
            href="/"
            className="p-1.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 rounded-lg"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </header>

        {/* Content Children */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
