import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import SignUpForm from "@/components/auth/SignUpForm";

export const metadata: Metadata = { title: "Create your account · Ali & Simbi" };

export default function SignUpPage() {
  return (
    <AuthShell
      panelBadge="Takes about 2 minutes"
      panelHeading={
        <>
          Your next role is one <span className="text-leaf-300">conversation</span> away.
        </>
      }
      panelBody="Ali and Simbi work both sides of the table, so every intro is one both people want."
      topLink={{ prompt: "Already have an account?", label: "Sign in", href: "/sign-in" }}
    >
      <SignUpForm />
    </AuthShell>
  );
}
