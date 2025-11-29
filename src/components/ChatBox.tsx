"use client";

import React, { useEffect, useState, useRef } from 'react';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/providers/AuthProvider';
import { Message } from '@/types';
import { Send } from 'lucide-react';

interface ChatBoxProps {
  collectionPath: string; // e.g., 'claims/{id}/messages'
}

export default function ChatBox({ collectionPath }: ChatBoxProps) {
  const { user, isAdmin } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(collection(db, collectionPath), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(msgs);
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });
    return () => unsubscribe();
  }, [collectionPath]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    await addDoc(collection(db, collectionPath), {
      text: input,
      senderId: user.uid,
      senderName: isAdmin ? 'TraceBack Support' : (user.displayName || 'User'),
      isAdmin: isAdmin,
      createdAt: serverTimestamp(),
    });
    setInput('');
  };

  return (
    <div className="flex flex-col h-[400px] border border-border rounded-xl bg-white overflow-hidden shadow-sm">
      <div className="bg-gray-50 p-3 border-b border-border">
        <h4 className="font-semibold text-sm">Secure Message Channel</h4>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          const isMe = msg.senderId === user?.uid;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                isMe ? 'bg-brand text-white rounded-br-none' : 'bg-gray-100 text-ink rounded-bl-none'
              }`}>
                <p className="font-bold text-xs opacity-80 mb-1">{msg.senderName}</p>
                <p>{msg.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={sendMessage} className="p-3 border-t border-border flex gap-2">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-border rounded-full focus:outline-none focus:border-brand"
        />
        <button type="submit" className="p-2 bg-brand text-white rounded-full hover:bg-brand-600 transition">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}