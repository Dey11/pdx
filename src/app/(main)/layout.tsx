import { redirect } from "next/navigation";
import React from "react";

import Navbar from "@/components/dashboard/navbar";
import Footer from "@/components/footer";
import { AiSetupGate } from "@/components/settings/ai-setup-gate";
import { getAiCredentialStatus } from "@/lib/ai/credential-service";
import { auth } from "@/lib/auth";

const Layout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  const aiCredentialStatus = await getAiCredentialStatus(session.user.id);

  return (
    <div>
      <Navbar />
      <AiSetupGate initialStatus={aiCredentialStatus} />

      {children}

      <Footer />
    </div>
  );
};

export default Layout;
