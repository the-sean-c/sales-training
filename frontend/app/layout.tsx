import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyCompany - Master the Art of Sales",
  description: "Interactive sales training platform for organizations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${inter.className} min-h-screen bg-base-100`}>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
