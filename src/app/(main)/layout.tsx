import { redirect } from "next/navigation";
import React from "react";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
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
