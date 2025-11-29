"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/providers/AuthProvider';
import { auth } from '@/lib/firebase';
import { LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, profile } = useAuth();

  return (
    <nav className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-border z-50">
      <div className="max-w-[1200px] mx-auto px-5 py-3.5 flex items-center justify-between">
        
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image 
            src="/TRACEBACK.png" 
            alt="TraceBack" 
            width={70} 
            height={70} 
            className="rounded-xl w-[50px] h-[50px] object-cover group-hover:opacity-90 transition"
          />
          <h1 className="text-[22px] text-brand font-extrabold tracking-tight">TraceBack</h1>
        </Link>

        {/* Actions */}
        <div className="flex gap-2.5 items-center">
          {user ? (
            <>
              {profile?.role === 'admin' ? (
                 <Link href="/traceback-admin/items">
                   <button className="px-4 py-2 text-sm font-semibold border border-brand bg-brand text-white rounded-full hover:bg-brand-600 transition">
                     Admin Console
                   </button>
                 </Link>
              ) : (
                <Link href="/dashboard">
                  <button className="px-4 py-2 text-sm font-semibold border border-border bg-white rounded-full hover:shadow-md transition">
                    Dashboard
                  </button>
                </Link>
              )}
              
              <button 
                onClick={() => auth.signOut()}
                className="p-2 text-muted hover:text-brand transition"
                title="Sign out"
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <>
              <Link href="/traceback-admin/login">
                <button className="px-4 py-2.5 text-sm font-semibold border border-border bg-white rounded-full hover:shadow-md transition">
                  Admin
                </button>
              </Link>
              <Link href="/auth/login">
                <button className="px-4 py-2.5 text-sm font-semibold border border-border bg-white rounded-full hover:shadow-md transition">
                  Log in
                </button>
              </Link>
              <Link href="/auth/register">
                <button className="px-4 py-2.5 text-sm font-semibold border border-brand bg-brand text-white rounded-full hover:bg-brand-600 shadow-sm transition">
                  Sign up
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}