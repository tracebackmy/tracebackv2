"use client";

import { useAuth } from "@/providers/AuthProvider";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Claim, Item } from "@/types";
import { formatDate } from "@/lib/date-utils";
import ChatBox from "@/components/ChatBox";

export default function Dashboard() {
  const { user } = useAuth();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [lostItems, setLostItems] = useState<Item[]>([]);
  const [activeChatClaimId, setActiveChatClaimId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      // Fetch Claims
      const qClaims = query(collection(db, "claims"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
      const sClaims = await getDocs(qClaims);
      setClaims(sClaims.docs.map(d => ({ id: d.id, ...d.data() })) as Claim[]);

      // Fetch Reported Lost Items
      const qItems = query(collection(db, "items"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
      const sItems = await getDocs(qItems);
      setLostItems(sItems.docs.map(d => ({ id: d.id, ...d.data() })) as Item[]);
    };
    fetch();
  }, [user]);

  return (
    <div className="space-y-8">
      {/* Claims Section */}
      <section>
        <h2 className="text-xl font-bold mb-4">Your Claims</h2>
        {claims.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-border text-center text-muted">No claims yet.</div>
        ) : (
          <div className="space-y-4">
            {claims.map(claim => (
              <div key={claim.id} className="bg-white p-5 rounded-2xl border border-border shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold">{claim.itemTitle}</h3>
                    <p className="text-sm text-muted">Submitted on {formatDate(claim.createdAt)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    claim.status === 'Approved - Pending Pickup' ? 'bg-green-50 border-green-200 text-green-700' :
                    claim.status === 'Rejected' ? 'bg-red-50 border-red-200 text-red-700' :
                    'bg-yellow-50 border-yellow-200 text-yellow-700'
                  }`}>
                    {claim.status}
                  </span>
                </div>
                
                {/* Chat Toggle */}
                <div className="border-t border-gray-100 pt-4">
                   <button 
                     onClick={() => setActiveChatClaimId(activeChatClaimId === claim.id ? null : claim.id)}
                     className="text-sm font-semibold text-brand hover:underline"
                   >
                     {activeChatClaimId === claim.id ? "Close Verification Chat" : "Open Verification Chat"}
                   </button>
                   {activeChatClaimId === claim.id && (
                     <div className="mt-4">
                       <ChatBox collectionPath={`claims/${claim.id}/messages`} />
                     </div>
                   )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Reported Lost Items */}
      <section>
        <h2 className="text-xl font-bold mb-4">Reported Lost Items</h2>
        {lostItems.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-border text-center text-muted">You haven't reported any lost items.</div>
        ) : (
          <div className="space-y-4">
            {lostItems.map(item => (
              <div key={item.id} className="bg-white p-5 rounded-2xl border border-border shadow-sm flex justify-between items-center">
                 <div>
                   <h3 className="font-bold">{item.title}</h3>
                   <p className="text-sm text-muted">{item.category} • {formatDate(item.createdAt)}</p>
                 </div>
                 <span className="text-sm font-semibold text-brand">{item.status}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}