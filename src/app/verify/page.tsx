import type { Metadata } from "next";
import { Suspense } from "react";
import AuthFallback from "@/components/auth/AuthFallback";
import AuthShell from "@/components/auth/AuthShell";
import VerifyForm from "@/components/auth/VerifyForm";

export const metadata: Metadata = { title: "Verify your account · Ali & Simbi" };

export default function VerifyPage() {
  return (
    <AuthShell
      panelHeading={
        <>
          One quick <span className="text-leaf-300">check</span>.
        </>
      }
      panelBody="A short code keeps your account yours. It only takes a moment."
      topLink={{ prompt: "Already verified?", label: "Sign in", href: "/sign-in" }}
    >
      <Suspense fallback={<AuthFallback />}>
        <VerifyForm />
      </Suspense>
    </AuthShell>
  );
}
