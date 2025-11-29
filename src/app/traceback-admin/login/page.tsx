"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { doc, getDoc } from "firebase/firestore";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      
      // Check role
      const userDoc = await getDoc(doc(db, "users", cred.user.uid));
      if (userDoc.exists() && userDoc.data().role === 'admin') {
        router.push("/traceback-admin/items");
      } else {
        await auth.signOut();
        setError("Access Denied: Not an admin account.");
      }
    } catch (err) {
      setError("Invalid admin credentials");
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <Image src="/TRACEBACK.png" alt="Logo" width={80} height={80} className="rounded-2xl mb-4" />
          <h2 className="text-2xl font-extrabold text-ink">Admin Console</h2>
          <p className="text-muted text-sm">Authorized personnel only</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold mb-1 ml-1">Admin Email</label>
            <input 
              type="email" 
              className="w-full p-3 rounded-xl border border-border focus:border-brand outline-none"
              value={email} onChange={e => setEmail(e.target.value)}
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1 ml-1">Password</label>
            <input 
              type="password" 
              className="w-full p-3 rounded-xl border border-border focus:border-brand outline-none"
              value={password} onChange={e => setPassword(e.target.value)}
              required 
            />
          </div>
          {error && <p className="text-red-500 text-xs text-center font-bold">{error}</p>}
          <button type="submit" className="w-full py-3 bg-brand text-white font-bold rounded-xl hover:bg-brand-600 transition">
            Access System
          </button>
        </form>
      </div>
    </div>
  );
}