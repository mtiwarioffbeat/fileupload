import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import Header from '@/components/Header'

export default async function DashboardLayout({ children }:{
  children: React.ReactNode
}) {
  const session = await getSession();
  if (!session) {
    redirect("/auth/login");
  }
  return (
    <>
      <Header />
      {children}
    </>
  );
}
