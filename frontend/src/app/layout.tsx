"use client";

import { WalletContextProvider } from "@/components/WalletContextProvider";
import { MaterialUIProvider } from "@/components/MaterialUIProvider";
import "../styles/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <MaterialUIProvider>
          <WalletContextProvider>
            <div className="min-h-screen">{children}</div>
          </WalletContextProvider>
        </MaterialUIProvider>
      </body>
    </html>
  );
}
