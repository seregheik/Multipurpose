import Navbar from "@/components/Navigation/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <> 
    <Navbar/>
    <main className="flex pt-3">
     {children}
    </main>
    </>
  );
}
