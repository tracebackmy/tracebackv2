"use client";

import { useState, useEffect } from "react";
import { addDoc, collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Item } from "@/types";
import { useAuth } from "@/providers/AuthProvider";

export default function AdminItems() {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState({ title: '', category: 'Others', location: '', description: '' });

  const loadItems = async () => {
    const q = query(collection(db, "items"), where("type", "==", "found")); // Get all found items
    const snap = await getDocs(q);
    setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Item[]);
  };

  useEffect(() => { loadItems(); }, []);

  const createFoundItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    await addDoc(collection(db, "items"), {
      type: 'found',
      ...newItem,
      userId: null,
      createdBy: user.uid,
      status: 'Pending Verification',
      createdAt: Date.now()
    });
    setNewItem({ title: '', category: 'Others', location: '', description: '' });
    loadItems();
  };

  const publishItem = async (id: string) => {
    await updateDoc(doc(db, "items", id), { status: 'Listed' });
    loadItems();
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
        <h2 className="text-lg font-bold mb-4">Register Found Item</h2>
        <form onSubmit={createFoundItem} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            className="p-3 border rounded-lg" placeholder="Item Title"
            value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} required 
          />
          <input 
             className="p-3 border rounded-lg" placeholder="Location"
             value={newItem.location} onChange={e => setNewItem({...newItem, location: e.target.value})} required 
          />
          <select 
             className="p-3 border rounded-lg"
             value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}
          >
             {["Bags", "Electronics", "Cards & IDs", "Clothing", "Others"].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input 
             className="p-3 border rounded-lg" placeholder="Description"
             value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} required 
          />
          <button type="submit" className="md:col-span-2 bg-brand text-white font-bold py-3 rounded-lg hover:bg-brand-600">Register Item</button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 text-xs font-bold text-muted uppercase">Title</th>
              <th className="p-4 text-xs font-bold text-muted uppercase">Category</th>
              <th className="p-4 text-xs font-bold text-muted uppercase">Status</th>
              <th className="p-4 text-xs font-bold text-muted uppercase">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 font-medium">{item.title}</td>
                <td className="p-4 text-sm text-muted">{item.category}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded-full font-bold ${
                    item.status === 'Listed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-4">
                  {item.status === 'Pending Verification' && (
                    <button onClick={() => publishItem(item.id)} className="text-xs bg-ink text-white px-3 py-1 rounded hover:bg-black">Publish</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}