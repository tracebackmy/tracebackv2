"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, CheckSquare, MessageSquare, Camera, LogOut } from "lucide-react";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/providers/AuthProvider";
import { useEffect } from "react";
import Image from "next/image";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  // Protect Admin Route
  useEffect(() => {
    if (!loading) {
      if (!user || profile?.role !== 'admin') {
        if (!pathname.includes('login')) router.push("/traceback-admin/login");
      }
    }
  }, [user, profile, loading, pathname, router]);

  if (pathname.includes('login')) return <>{children}</>;
  if (loading) return <div className="h-screen flex items-center justify-center">Loading Admin...</div>;

  const links = [
    { href: "/traceback-admin/items", label: "Found Items", icon: Package },
    { href: "/traceback-admin/claims", label: "Claims Triage", icon: CheckSquare },
    { href: "/traceback-admin/tickets", label: "Tickets", icon: MessageSquare },
    { href: "/traceback-admin/analytics", label: "Analytics", icon: LayoutDashboard },
    { href: "/traceback-admin/cctv", label: "CCTV", icon: Camera },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-ink text-white flex-shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-gray-800">
          <Image src="/TRACEBACK.png" alt="Logo" width={40} height={40} className="rounded-lg" />
          <span className="font-bold text-lg">TraceBack</span>
        </div>
        <nav className="p-4 space-y-2">
          {links.map(link => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  active ? "bg-brand text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
          <button 
            onClick={() => auth.signOut()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-900/30 hover:text-red-400 mt-10"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}