"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function AuthHeader() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <nav className="space-x-3">
        <div className="text-sm text-gray-600">Loading...</div>
      </nav>
    );
  }

  if (session) {
    return (
      <nav className="space-x-3">
        <Link href="/portfolio" className="text-sm text-gray-600 hover:text-gray-900">
          Portfolio
        </Link>
        <span className="text-sm text-gray-600">
          {session.user?.email}
        </span>
        <button 
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Sign Out
        </button>
      </nav>
    );
  }

  return (
    <nav className="space-x-3">
      <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
        Sign In
      </Link>
      <Link href="/register" className="text-sm text-brand hover:text-blue-700">
        Create Account
      </Link>
    </nav>
  );
}
