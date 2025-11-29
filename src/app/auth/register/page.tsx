"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      
      // Create user doc
      await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid,
        email,
        displayName: name,
        role: "user",
        createdAt: Date.now()
      });

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl border border-border">
        <div className="flex justify-center mb-6">
          <Image src="/TRACEBACK.png" alt="Logo" width={60} height={60} className="rounded-xl" />
        </div>
        <h2 className="text-2xl font-extrabold text-center mb-8">Create Account</h2>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold mb-1 ml-1">Full Name</label>
            <input 
              type="text" 
              className="w-full p-3 rounded-xl border border-border focus:border-brand outline-none transition"
              value={name} onChange={e => setName(e.target.value)}
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1 ml-1">Email</label>
            <input 
              type="email" 
              className="w-full p-3 rounded-xl border border-border focus:border-brand outline-none transition"
              value={email} onChange={e => setEmail(e.target.value)}
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1 ml-1">Password</label>
            <input 
              type="password" 
              className="w-full p-3 rounded-xl border border-border focus:border-brand outline-none transition"
              value={password} onChange={e => setPassword(e.target.value)}
              required 
            />
          </div>
          {error && <p className="text-red-500 text-xs text-center">{error}</p>}
          <button type="submit" className="w-full py-3 bg-brand text-white font-bold rounded-xl hover:bg-brand-600 transition">
            Sign Up
          </button>
        </form>
         <p className="text-center mt-6 text-sm text-muted">
          Already have an account? <Link href="/auth/login" className="text-brand font-bold">Log in</Link>
        </p>
      </div>
    </div>
  );
}