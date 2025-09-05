"use client"
import Navbar from "@/components/Navigation/Navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/Context/themeProvider";
import { AppProvider } from "@/Context/basicProvider";


const queryClient = new QueryClient();

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <QueryClientProvider client={queryClient}>
            <AppProvider>
                <ThemeProvider>
        <div>
            {/* <header >
                <Navbar/>
            </header> */}
                {children}
        </div>
                </ThemeProvider>
            </AppProvider>
        </QueryClientProvider>
    );
}
