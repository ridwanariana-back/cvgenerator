import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NextTopLoader from 'nextjs-toploader'; //

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CVGenerator",
  description: "Create your Professional Resume. Build an ATS-ready CV with minimalist designs. Focus on your expertise, and let us handle the aesthetics for you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Tambahkan TopLoader di sini agar muncul di semua halaman */}
        <NextTopLoader 
          color="#2563eb" // Warna biru yang sesuai dengan branding CVGenerator
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false} // Matikan spinner karena loading bar sudah cukup informatif
          easing="ease"
          speed={200}
          shadow="0 0 10px #2563eb,0 0 5px #2563eb"
        />
        {children}
      </body>
    </html>
  );
}