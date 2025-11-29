"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl border border-border">
        <div className="flex justify-center mb-6">
          <Image src="/TRACEBACK.png" alt="Logo" width={60} height={60} className="rounded-xl" />
        </div>
        <h2 className="text-2xl font-extrabold text-center mb-1">Welcome back</h2>
        <p className="text-center text-muted mb-8 text-sm">Log in to manage your lost & found items</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
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
            Log In
          </button>
        </form>
        
        <p className="text-center mt-6 text-sm text-muted">
          Don't have an account? <Link href="/auth/register" className="text-brand font-bold">Sign up</Link>
        </p>
        <div className="mt-4 text-center">
             <Link href="/" className="text-xs text-muted hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}