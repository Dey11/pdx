import Image from "next/image";
import React from "react";

import Footer from "@/components/footer";
import Header from "@/components/header";

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div>
      <Image
        src="/logo.png"
        alt="Logo"
        width={40}
        height={50}
        className="left-10 z-20 -mt-2 hidden md:fixed md:block"
      />

      <div className="relative">
        <div className="absolute -top-[15vh] left-1/2 right-1/2 -z-20 size-[40dvh] -translate-x-1/2 rounded-full bg-[#00FF1E]/60 blur-[100px] sm:-top-[60dvh] sm:size-[90dvh] sm:blur-[120px]" />
      </div>

      <Header />

      {children}

      <Footer />
    </div>
  );
};

export default Layout;
