import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { Providers } from "./providers";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "ONE-52 Bar & Grill",
  description: "ONE-52 Bar & Grill - Your neighborhood bar and grill",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#0A0B0D] text-white">
        <Providers>
          <header className="flex flex-col items-center justify-center px-4 pt-6 pb-2">
            {/* License Plate Design */}
            <div className="relative mb-6 mx-auto">
              <div className="bg-white rounded-lg border-4 border-black p-4 px-8 max-w-md mx-auto shadow-lg" style={{ filter: 'grayscale(10%)', background: 'linear-gradient(to bottom, #f5f5f5, #e0e0e0)' }}>
                <Link href="/" className="block text-center">
                  <h1 className="text-5xl font-black tracking-wider text-black mb-1">ONE-52</h1>
                  <div className="flex items-center justify-center">
                    <div className="h-0.5 w-6 bg-black"></div>
                    <p className="text-xl text-black px-2 font-bold tracking-wide">BAR & GRILL</p>
                    <div className="h-0.5 w-6 bg-black"></div>
                  </div>
                </Link>
              </div>
            </div>
            
            {/* Navigation Component */}
            <Nav />
          </header>
          <main className="p-4 max-w-6xl mx-auto">
            {children}
          </main>
          
          {/* Footer Links for Legal Pages */}
          <div className="bg-gray-900/50 text-gray-400 text-sm py-4">
            <div className="container mx-auto px-4 text-center">
              <p className="mb-2">© {new Date().getFullYear()} 152 Bar & Restaurant. All rights reserved.</p>
              <div className="flex justify-center space-x-4">
                <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
