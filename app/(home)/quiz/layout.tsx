"use client"
import type { Metadata } from "next";
import { ThemeProvider } from "@/Context/themeProvider";
import { AppProvider } from "@/Context/basicProvider";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import ThemeToggle from "@/components/Theme/themeToggle";
import Navbar from "@/components/Navigation/Navbar";


const queryClient = new QueryClient();
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <> 
    <Navbar/>
    <main className="flex min-h-dvh">
     {children}
    </main>
    </>
  );
}
