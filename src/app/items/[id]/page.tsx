"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { doc, getDoc, addDoc, collection, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Item, Claim } from "@/types";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { formatDate } from "@/lib/date-utils";
import { useAuth } from "@/providers/AuthProvider";
import { MapPin, Calendar, Tag } from "lucide-react";

export default function ItemDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [item, setItem] = useState<Item | null>(null);
  const [existingClaim, setExistingClaim] = useState<Claim | null>(null);
  const [proof, setProof] = useState("");
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const docRef = doc(db, "items", id as string);
      const snap = await getDoc(docRef);
      if (snap.exists()) setItem({ id: snap.id, ...snap.data() } as Item);

      if (user) {
        const claimQ = query(
          collection(db, "claims"), 
          where("itemId", "==", id), 
          where("userId", "==", user.uid)
        );
        const claimSnap = await getDocs(claimQ);
        if (!claimSnap.empty) setExistingClaim(claimSnap.docs[0].data() as Claim);
      }
    };
    load();
  }, [id, user]);

  const handleClaim = async () => {
    if (!user || !item) return;
    if (!proof.trim()) return alert("Please provide proof details.");
    
    setIsClaiming(true);
    try {
      await addDoc(collection(db, "claims"), {
        itemId: item.id,
        userId: user.uid,
        itemTitle: item.title,
        proofDescription: proof,
        status: "Pending Review",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      alert("Claim submitted! Check your dashboard.");
      router.push("/dashboard");
    } catch (e) {
      console.error(e);
      alert("Error submitting claim");
    }
    setIsClaiming(false);
  };

  if (!item) return <div className="p-10">Loading...</div>;

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-[1000px] mx-auto px-5 pt-10 pb-20">
        <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2">
          <div className="relative h-[400px] md:h-auto bg-gray-100">
             <Image src={item.imageUrl || "https://picsum.photos/600/600"} alt={item.title} fill className="object-cover" />
          </div>
          <div className="p-8 flex flex-col justify-between">
            <div>
              <div className="flex gap-2 mb-4">
                 <span className="px-3 py-1 bg-gray-100 text-xs font-bold rounded-full text-muted flex items-center gap-1">
                   <Tag size={12} /> {item.category}
                 </span>
                 <span className="px-3 py-1 bg-green-50 text-xs font-bold rounded-full text-green-700 border border-green-100">
                   {item.status}
                 </span>
              </div>
              <h1 className="text-3xl font-extrabold text-ink mb-4">{item.title}</h1>
              <div className="space-y-3 text-sm text-muted">
                <p className="flex items-center gap-2"><MapPin size={16} /> Location: {item.location}</p>
                <p className="flex items-center gap-2"><Calendar size={16} /> Found: {formatDate(item.createdAt)}</p>
              </div>
              <div className="mt-6">
                <h3 className="font-bold text-ink mb-2">Description</h3>
                <p className="text-muted leading-relaxed">{item.description}</p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-border">
              {!user ? (
                <div className="text-center">
                  <p className="text-sm mb-3">Login to claim this item</p>
                  <button onClick={() => router.push("/auth/login")} className="w-full py-3 bg-brand text-white font-bold rounded-xl">Log in</button>
                </div>
              ) : existingClaim ? (
                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 text-yellow-800 text-center">
                  <p className="font-bold">Claim Submitted</p>
                  <p className="text-xs mt-1">Status: {existingClaim.status}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <label className="block text-sm font-bold">Is this yours? Provide proof.</label>
                  <textarea 
                    className="w-full p-3 border border-border rounded-xl text-sm" 
                    rows={3}
                    placeholder="Describe unique markings, contents, or serial number..."
                    value={proof}
                    onChange={(e) => setProof(e.target.value)}
                  />
                  <button 
                    onClick={handleClaim} 
                    disabled={isClaiming}
                    className="w-full py-3 bg-brand text-white font-bold rounded-xl hover:bg-brand-600 transition disabled:opacity-50"
                  >
                    {isClaiming ? "Submitting..." : "Submit Claim"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}