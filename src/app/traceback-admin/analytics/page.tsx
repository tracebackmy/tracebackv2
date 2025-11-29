"use client";

import { PieChart, BarChart, Activity, Users } from "lucide-react";

export default function Analytics() {
  // Mock data for visual completeness
  const stats = [
    { label: "Items Found", val: "142", icon: Package },
    { label: "Claims Resolved", val: "89", icon: CheckSquare },
    { label: "Active Tickets", val: "12", icon: MessageSquare },
    { label: "Users", val: "1.2k", icon: Users },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">System Analytics</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-2 text-muted">
              <s.icon size={18} />
              <span className="text-sm font-bold">{s.label}</span>
            </div>
            <p className="text-3xl font-extrabold text-ink">{s.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-border h-64 flex flex-col items-center justify-center text-muted">
           <BarChart size={48} className="mb-4 text-brand opacity-50" />
           <p>Weekly Lost vs Found Reports</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-border h-64 flex flex-col items-center justify-center text-muted">
           <PieChart size={48} className="mb-4 text-blue-500 opacity-50" />
           <p>Category Distribution</p>
        </div>
      </div>
    </div>
  );
}

import { Package, CheckSquare, MessageSquare } from "lucide-react";