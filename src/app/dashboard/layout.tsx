"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, MessageSquarePlus } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/report", label: "Report Lost Item", icon: FileText },
    { href: "/dashboard/tickets", label: "Support Tickets", icon: MessageSquarePlus },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
        {/* Sidebar */}
        <aside className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-border p-4 sticky top-24">
            <nav className="space-y-2">
              {links.map(link => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                      active ? "bg-brand text-white shadow-md" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon size={18} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="md:col-span-3">
          {children}
        </main>
      </div>
    </div>
  );
}