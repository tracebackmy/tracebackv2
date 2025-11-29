"use client";

import { useState, useEffect } from "react";
import { addDoc, collection, query, where, orderBy, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/providers/AuthProvider";
import { Ticket } from "@/types";
import ChatBox from "@/components/ChatBox";

export default function SupportTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [newSubject, setNewSubject] = useState("");
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const q = query(collection(db, "tickets"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setTickets(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Ticket[]);
    };
    fetch();
  }, [user]);

  const createTicket = async () => {
    if (!newSubject.trim() || !user) return;
    const ref = await addDoc(collection(db, "tickets"), {
      userId: user.uid,
      subject: newSubject,
      status: "Open",
      createdAt: Date.now(),
      lastMessageAt: Date.now()
    });
    setNewSubject("");
    // Refresh simplified
    window.location.reload(); 
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-border">
        <h2 className="text-lg font-bold mb-4">Open New Ticket</h2>
        <div className="flex gap-2">
          <input 
            className="flex-1 p-3 border border-border rounded-xl"
            placeholder="Subject..."
            value={newSubject}
            onChange={e => setNewSubject(e.target.value)}
          />
          <button onClick={createTicket} className="px-6 bg-ink text-white font-bold rounded-xl">Create</button>
        </div>
      </div>

      <div className="space-y-4">
        {tickets.map(t => (
          <div key={t.id} className="bg-white p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">{t.subject}</h3>
              <span className={`px-2 py-1 text-xs rounded font-bold ${t.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                {t.status}
              </span>
            </div>
            <button 
              onClick={() => setActiveTicketId(activeTicketId === t.id ? null : t.id)}
              className="text-brand text-sm font-bold hover:underline"
            >
              {activeTicketId === t.id ? "Close Chat" : "Open Chat"}
            </button>
            
            {activeTicketId === t.id && (
              <div className="mt-4">
                <ChatBox collectionPath={`tickets/${t.id}/messages`} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}