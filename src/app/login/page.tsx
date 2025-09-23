"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="card max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sign in</h1>
      <input className="input mb-3" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="input mb-3" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="btn-primary w-full" onClick={()=>signIn("credentials", { email, password, callbackUrl: "/" })}>Sign In</button>
      <div className="text-sm text-center mt-3">
        Don&apos;t have an account? <a className="text-brand" href="/register">Register</a>
      </div>
    </div>
  );
}
