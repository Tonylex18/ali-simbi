import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import ForgotForm from "@/components/auth/ForgotForm";

export const metadata: Metadata = { title: "Reset your password · Ali & Simbi" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      panelHeading={
        <>
          We&apos;ll get you <span className="text-leaf-300">back in</span>.
        </>
      }
      panelBody="Reset your password in a minute, then carry on where you left off."
      topLink={{ prompt: "Remembered it?", label: "Sign in", href: "/sign-in" }}
    >
      <ForgotForm />
    </AuthShell>
  );
}
