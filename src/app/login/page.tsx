"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", { 
        email, 
        password, 
        redirect: false 
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sign in</h1>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      <input 
        className="input mb-3" 
        placeholder="Email" 
        value={email} 
        onChange={e=>setEmail(e.target.value)}
        disabled={loading}
      />
      <input 
        className="input mb-3" 
        placeholder="Password" 
        type="password" 
        value={password} 
        onChange={e=>setPassword(e.target.value)}
        disabled={loading}
      />
      <button 
        className="btn-primary w-full" 
        onClick={handleSignIn}
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
      <div className="text-sm text-center mt-3">
        Don&apos;t have an account? <a className="text-brand" href="/register">Register</a>
      </div>
    </div>
  );
}
