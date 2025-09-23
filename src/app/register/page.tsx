"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function register() {
    setLoading(true);
    const r = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    setLoading(false);
    if (r.ok) router.push("/login");
    else alert("Registration failed");
  }

  return (
    <div className="card max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create account</h1>
      <input className="input mb-3" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="input mb-3" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="btn-primary w-full" onClick={register}>{loading ? "Creating..." : "Create Account"}</button>
    </div>
  );
}
