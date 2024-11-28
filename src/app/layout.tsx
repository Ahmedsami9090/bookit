import type { Metadata } from "next";
import { Inter } from "next/font/google"
import "./globals.css";
import Header from "../components/Header";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import AuthWrapper from "@/components/AuthWrapper";
const inter = Inter({ subsets: ['latin'] })


export const metadata: Metadata = {
  title: "Bookit",
  description: "book a meeting or a conference room for your team",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthWrapper>
<html lang="en">
      <body className={`${inter.className}`}>
        <Header/>
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
          <ToastContainer/>
        </main>
        <Footer/>
      </body>
    </html>
    </AuthWrapper>
  );
}
