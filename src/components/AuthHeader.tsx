"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function AuthHeader() {
  const { data: session, status } = useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut({ redirect: false });
      // Force redirect to main domain to avoid Vercel deployment URL issues
      window.location.href = "https://rentpaxmvpplus.vercel.app/";
    } catch (error) {
      console.error("Sign out error:", error);
      // Fallback redirect
      window.location.href = "https://rentpaxmvpplus.vercel.app/";
    } finally {
      setIsSigningOut(false);
    }
  };

  if (status === "loading") {
    return (
      <nav className="space-x-3">
        <div className="text-sm text-gray-600">Loading...</div>
      </nav>
    );
  }

  if (session) {
    // Extract name from email (part before @)
    const userName = session.user?.email?.split('@')[0] || 'User';
    
    return (
      <nav className="flex items-center space-x-4">
        <Link 
          href="/portfolio" 
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          📊 Portfolio
        </Link>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              Welcome, {userName}
            </span>
            <span className="text-xs text-gray-500">
              {session.user?.email}
            </span>
          </div>
        </div>
        <button 
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="text-sm text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
        >
          {isSigningOut ? "Signing out..." : "Sign Out"}
        </button>
      </nav>
    );
  }

  return (
    <nav className="space-x-3">
      <Link 
        href="/login" 
        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        Sign In
      </Link>
      <Link 
        href="/register" 
        className="text-sm text-brand hover:text-blue-700 transition-colors font-medium"
      >
        Create Account
      </Link>
    </nav>
  );
}
