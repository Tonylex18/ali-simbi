import type { Metadata } from "next";
import { Suspense } from "react";
import AuthFallback from "@/components/auth/AuthFallback";
import AuthShell from "@/components/auth/AuthShell";
import SignInForm from "@/components/auth/SignInForm";

export const metadata: Metadata = { title: "Sign in · Ali & Simbi" };

export default function SignInPage() {
  return (
    <AuthShell
      panelHeading={
        <>
          Welcome <span className="text-leaf-300">back</span>.
        </>
      }
      panelBody="Ali keeps searching while you are away, and Simbi keeps your shortlists fresh."
      topLink={{ prompt: "New here?", label: "Create an account", href: "/sign-up" }}
    >
      <Suspense fallback={<AuthFallback />}>
        <SignInForm />
      </Suspense>
    </AuthShell>
  );
}
