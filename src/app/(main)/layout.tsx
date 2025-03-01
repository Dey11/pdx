import { redirect } from "next/navigation";
import React from "react";

import Navbar from "@/components/dashboard/navbar";
import Footer from "@/components/footer";
import { auth } from "@/lib/auth";

const Layout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div>
      <Navbar />

      {children}

      <Footer />
    </div>
  );
};

export default Layout;
