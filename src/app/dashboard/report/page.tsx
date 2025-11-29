"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { checkMatch } from "@/lib/matching-utils";
import { Item } from "@/types";

export default function ReportLost() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({ title: '', category: 'Others', location: '', description: '', date: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      // 1. Create Lost Item
      const newItem = {
        type: 'lost',
        ...formData,
        userId: user.uid,
        createdBy: user.uid,
        status: 'Reported',
        createdAt: Date.now()
      };

      const docRef = await addDoc(collection(db, "items"), newItem);

      // 2. Automated Matching Logic
      // Fetch all 'Pending Verification' or 'Listed' items to check against
      const foundQ = query(collection(db, "items"), where("type", "==", "found"));
      const foundSnap = await getDocs(foundQ);
      const foundItems = foundSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Item[];

      const matches = checkMatch(newItem, foundItems);

      if (matches.length > 0) {
        // Create match tickets or notify admin (Mocking simplified flow: updating status)
        // In a real app, this would trigger a cloud function
        console.log("Potential matches found:", matches.length);
        // Could update item status to 'Match Found' immediately if high confidence
      }

      router.push("/dashboard");
    } catch (e) {
      console.error(e);
      alert("Error reporting item");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-border">
      <h1 className="text-2xl font-extrabold mb-6">Report a Lost Item</h1>
      <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
        <div>
          <label className="block text-sm font-bold mb-1">What did you lose?</label>
          <input 
            type="text" 
            required
            className="w-full p-3 border border-border rounded-xl"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            placeholder="e.g. Blue Nike Backpack"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1">Category</label>
            <select 
              className="w-full p-3 border border-border rounded-xl"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
               {["Bags", "Electronics", "Cards & IDs", "Clothing", "Others"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Date Lost</label>
            <input 
              type="date" 
              required
              className="w-full p-3 border border-border rounded-xl"
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Location / Station</label>
          <input 
            type="text" 
            required
            className="w-full p-3 border border-border rounded-xl"
            value={formData.location}
            onChange={e => setFormData({...formData, location: e.target.value})}
            placeholder="e.g. KL Sentral Platform 1"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Description</label>
          <textarea 
            required
            rows={4}
            className="w-full p-3 border border-border rounded-xl"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            placeholder="Detailed description helps us match it faster."
          />
        </div>

        <button 
          disabled={loading}
          type="submit" 
          className="w-full py-3 bg-brand text-white font-bold rounded-xl hover:bg-brand-600 transition"
        >
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}