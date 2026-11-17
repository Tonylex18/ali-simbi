import type { Metadata } from "next";
import { Suspense } from "react";
import AuthFallback from "@/components/auth/AuthFallback";
import AuthShell from "@/components/auth/AuthShell";
import ResetForm from "@/components/auth/ResetForm";

export const metadata: Metadata = { title: "Choose a new password · Ali & Simbi" };

export default function ResetPasswordPage() {
  return (
    <AuthShell
      panelHeading={
        <>
          A fresh <span className="text-leaf-300">start</span>.
        </>
      }
      panelBody="Choose a new password and you are back in."
      topLink={{ prompt: "Need help?", label: "Sign in", href: "/sign-in" }}
    >
      <Suspense fallback={<AuthFallback />}>
        <ResetForm />
      </Suspense>
    </AuthShell>
  );
}
