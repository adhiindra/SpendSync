"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button variant="outline" onClick={() => signOut()}>Sign out</Button>
      </div>
      <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm border">
        <p className="text-lg">Welcome back, {session?.user?.name || session?.user?.email}!</p>
        <p className="text-gray-500 mt-2">This is the dashboard placeholder. More features coming soon.</p>
      </div>
    </div>
  );
}
