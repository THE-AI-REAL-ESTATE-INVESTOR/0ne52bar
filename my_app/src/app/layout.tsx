import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ONE-52 BAR & GRILL",
  description: "ONE-52 BAR & GRILL website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}>
        <Providers>
          <header className="flex flex-col items-center justify-center">
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
            
            {/* Navigation */}
            <nav className="flex gap-8 mb-4">
              <Link href="/tappass" className="text-white hover:text-blue-300 transition-colors">
                TAP PASS 🍺
              </Link>
              <Link href="/menu" className="text-white hover:text-blue-300 transition-colors">
                Menu
              </Link>
              <Link href="/about" className="text-white hover:text-blue-300 transition-colors">
                About
              </Link>
              <Link href="/one52stories" className="text-white hover:text-blue-300 transition-colors">
                One52stories 📖 
              </Link>
              <Link href="/events" className="text-white hover:text-blue-300 transition-colors">
                events 📖 
              </Link>
            </nav>
          </header>
          <main className="p-4 max-w-6xl mx-auto">
            {children}
          </main>
          
          {/* Footer Links for Legal Pages */}
          <div className="bg-gray-900 text-gray-400 text-sm py-4">
            <div className="container mx-auto px-4 text-center">
              <p className="mb-2">© {new Date().getFullYear()} 152 Bar & Restaurant. All rights reserved.</p>
              <div className="flex justify-center space-x-4">
                <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
