'use client';

import Navbar from "@/components/Navbar";
import Drawer from "@/components/Drawer";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Drawer>
        <div className="flex-1 p-4" >
          {children}
        </div>
      </Drawer>
    </div>
  );
}