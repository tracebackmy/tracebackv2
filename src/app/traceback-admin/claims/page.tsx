"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Claim } from "@/types";
import ChatBox from "@/components/ChatBox";

export default function AdminClaims() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [activeClaimId, setActiveClaimId] = useState<string | null>(null);

  const loadClaims = async () => {
    const q = query(collection(db, "claims"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    setClaims(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Claim[]);
  };

  useEffect(() => { loadClaims(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, "claims", id), { status });
    loadClaims();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Claims Triage</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {claims.map(claim => (
            <div 
              key={claim.id} 
              onClick={() => setActiveClaimId(claim.id)}
              className={`p-5 rounded-xl border cursor-pointer transition ${
                activeClaimId === claim.id ? 'bg-blue-50 border-blue-200' : 'bg-white border-border hover:shadow-md'
              }`}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-bold">{claim.itemTitle}</h3>
                <span className="text-xs font-bold bg-white border border-gray-200 px-2 py-1 rounded">{claim.status}</span>
              </div>
              <p className="text-sm text-muted mt-2">Proof: {claim.proofDescription}</p>
              
              <div className="mt-4 flex gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); updateStatus(claim.id, 'Approved - Pending Pickup'); }}
                  className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded"
                >
                  Approve
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); updateStatus(claim.id, 'Rejected'); }}
                  className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>

        <div>
          {activeClaimId ? (
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm sticky top-6">
              <h3 className="font-bold mb-4">Verification Chat</h3>
              <ChatBox collectionPath={`claims/${activeClaimId}/messages`} />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted border-2 border-dashed rounded-2xl">
              Select a claim to verify
            </div>
          )}
        </div>
      </div>
    </div>
  );
}