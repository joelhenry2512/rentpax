import "./globals.css";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import AuthHeader from "@/components/AuthHeader";

export const metadata: Metadata = {
  title: "RentPax — Property & Rental Analysis",
  description: "All-in-one property value, rent, mortgage, and affordability analysis."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <div className="container py-8">
            <header className="flex items-center justify-between mb-6">
              <div className="text-2xl font-bold">RentPax</div>
              <AuthHeader />
            </header>
            {children}
            <footer className="mt-12 text-center text-xs text-gray-500">
              © {new Date().getFullYear()} RentPax
            </footer>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
