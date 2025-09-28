import type { Metadata } from "next";
// import { Roboto_Mono, Roboto } from "next/font/google";
import "./globals.css";

// const robotoSans = Roboto({
//   variable: "--font-roboto-sans",
//   subsets: ["latin"],
// });

// const robotoMono = Roboto_Mono({
//   variable: "--font-roboto-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Quiz App",
  description: "Created By Osasere. I will change the questions whenever i feel like",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-Us">
      <body
        className={` antialiased`} suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
