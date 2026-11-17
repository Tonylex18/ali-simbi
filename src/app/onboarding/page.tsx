import type { Metadata } from "next";
import OnboardingApp from "@/components/onboarding/OnboardingApp";

export const metadata: Metadata = { title: "Set up your profile · Ali & Simbi" };

export default function OnboardingPage() {
  return <OnboardingApp />;
}
