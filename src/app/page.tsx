"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Item } from "@/types";
import { formatDate } from "@/lib/date-utils";

export default function Home() {
  const [recentItems, setRecentItems] = useState<Item[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      // Fetch public listed items
      const q = query(
        collection(db, "items"),
        where("status", "==", "Listed"),
        orderBy("createdAt", "desc"),
        limit(8)
      );
      const snap = await getDocs(q);
      const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Item[];
      setRecentItems(items);
    };
    fetchItems();
  }, []);

  const filteredItems = filter 
    ? recentItems.filter(i => i.category === filter)
    : recentItems;

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="relative max-w-[1200px] mx-auto mt-5 rounded-3xl overflow-hidden shadow-lg group">
        <div className="relative h-[420px] w-full">
          <Image 
            src="/MRT3.jpg" 
            alt="City transit scene" 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50" />
        <div className="absolute left-10 bottom-10 text-white max-w-lg">
          <h2 className="text-[42px] font-extrabold leading-tight mb-2 drop-shadow-md">
            Find it. Return it.<br/>Feel good.
          </h2>
          <p className="text-lg font-medium opacity-90 drop-shadow-sm">
            TraceBack connects people to the things they miss — fast, friendly, and secure.
          </p>
          <div className="mt-6 flex gap-4">
             <Link href="/browse">
               <button className="px-6 py-3 bg-white text-ink font-bold rounded-full hover:bg-gray-100 transition">
                 Browse Found Items
               </button>
             </Link>
             <Link href="/dashboard/report">
               <button className="px-6 py-3 bg-brand text-white font-bold rounded-full hover:bg-brand-600 transition">
                 I Lost Something
               </button>
             </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-[1200px] mx-auto mt-12 px-5">
        <h3 className="text-2xl font-bold mb-6 text-ink">How TraceBack works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              title: "Report or Search", 
              text: "Create a post for what you lost or browse what was found near you.", 
              img: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1200" 
            },
            { 
              title: "Chat to Verify", 
              text: "Built-in messaging helps confirm ownership safely and quickly.", 
              img: "https://images.unsplash.com/photo-1525186402429-b4ff38bedbec?q=80&w=1200" 
            },
            { 
              title: "Reunite & Close", 
              text: "Meet at a safe location, mark it as returned, and spread the joy.", 
              img: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200" 
            },
          ].map((card, idx) => (
            <article key={idx} className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm hover:-translate-y-1 transition-transform duration-200">
              <div className="h-40 bg-gray-100 relative">
                 <Image src={card.img} alt={card.title} fill className="object-cover" />
              </div>
              <div className="p-4">
                <h4 className="font-bold text-lg mb-1">{card.title}</h4>
                <p className="text-sm text-muted">{card.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-[1200px] mx-auto mt-12 px-5">
        <h3 className="text-2xl font-bold mb-4 text-ink">Browse by category</h3>
        <div className="flex flex-wrap gap-3">
          {["", "Bags", "Electronics", "Cards & IDs", "Clothing", "Others"].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2.5 rounded-full border text-sm font-semibold transition ${
                filter === cat 
                  ? "bg-brand text-white border-brand" 
                  : "bg-white border-border hover:border-brand-600 hover:bg-red-50"
              }`}
            >
              {cat || "All"}
            </button>
          ))}
        </div>
      </section>

      {/* Recent Items */}
      <section className="max-w-[1200px] mx-auto mt-8 mb-20 px-5">
        <h3 className="text-2xl font-bold mb-6 text-ink">Recently Found</h3>
        {filteredItems.length === 0 ? (
          <p className="text-muted">No items found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredItems.map(item => (
               <Link href={`/items/${item.id}`} key={item.id} className="block group">
                <article className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <div className="h-40 bg-gray-100 relative">
                    <Image 
                      src={item.imageUrl || "https://picsum.photos/400/300"} 
                      alt={item.title} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-ink truncate">{item.title}</h4>
                    <p className="text-xs text-muted mt-1">{item.category} • {formatDate(item.createdAt)}</p>
                    <p className="text-xs text-muted truncate">{item.location}</p>
                    <span className="inline-block mt-3 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wide border border-green-200 bg-green-50 text-green-700 rounded-full">
                      {item.status}
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}