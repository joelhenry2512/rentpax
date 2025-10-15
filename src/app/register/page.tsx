"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function register() {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const r = await fetch("/api/register", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ email, password }) 
      });
      
      const data = await r.json();
      
      if (r.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="card max-w-md mx-auto text-center">
        <div className="mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-green-600 mb-2">Account Created!</h1>
          <p className="text-gray-600">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create account</h1>
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
        type="email"
      />
      <input 
        className="input mb-3" 
        placeholder="Password (min 6 characters)" 
        type="password" 
        value={password} 
        onChange={e=>setPassword(e.target.value)}
        disabled={loading}
      />
      <button 
        className="btn-primary w-full" 
        onClick={register}
        disabled={loading}
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>
      <div className="text-sm text-center mt-3">
        Already have an account? <a className="text-brand" href="/login">Sign In</a>
      </div>
    </div>
  );
}
