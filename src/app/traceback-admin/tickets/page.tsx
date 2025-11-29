"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Ticket } from "@/types";
import ChatBox from "@/components/ChatBox";

export default function AdminTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTicket, setActiveTicket] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const q = query(collection(db, "tickets"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setTickets(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Ticket[]);
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Support Tickets</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {tickets.map(t => (
            <div 
              key={t.id} 
              onClick={() => setActiveTicket(t.id)}
              className={`p-5 rounded-xl border cursor-pointer ${activeTicket === t.id ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}
            >
              <h3 className="font-bold">{t.subject}</h3>
              <p className="text-xs text-muted mt-1">ID: {t.id}</p>
              <span className="text-xs font-bold text-brand mt-2 block">{t.status}</span>
            </div>
          ))}
        </div>
        <div className="bg-white p-6 rounded-2xl border border-border h-fit">
          {activeTicket ? (
            <>
              <h3 className="font-bold mb-4">Chat</h3>
              <ChatBox collectionPath={`tickets/${activeTicket}/messages`} />
            </>
          ) : <p>Select a ticket</p>}
        </div>
      </div>
    </div>
  );
}