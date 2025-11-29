"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Item } from "@/types";
import { formatDate } from "@/lib/date-utils";
import Link from "next/link";
import Image from "next/image";

export default function BrowsePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadItems = async () => {
      const q = query(
        collection(db, "items"),
        where("status", "==", "Listed"),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      setItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Item[]);
    };
    loadItems();
  }, []);

  const filtered = items.filter(i => 
    i.title.toLowerCase().includes(search.toLowerCase()) || 
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      <div className="max-w-[1200px] mx-auto px-5 pt-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-ink">Browse Found Items</h1>
          <input 
            type="text" 
            placeholder="Search items..." 
            className="w-full md:w-80 px-4 py-2 rounded-full border border-border focus:outline-none focus:border-brand"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map(item => (
            <Link href={`/items/${item.id}`} key={item.id}>
              <article className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg transition duration-200">
                <div className="h-48 relative">
                   <Image src={item.imageUrl || "https://picsum.photos/400"} alt={item.title} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-ink truncate">{item.title}</h3>
                      <p className="text-sm text-muted">{item.category}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted">
                    <span>{item.location}</span>
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}