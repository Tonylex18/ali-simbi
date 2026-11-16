import CvCheck from "@/components/CvCheck";
import Employers from "@/components/Employers";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Nav from "@/components/Nav";
import PpaSection from "@/components/PpaSection";
import Premium from "@/components/Premium";
import Pricing from "@/components/Pricing";
import Trust from "@/components/Trust";
import Waitlist from "@/components/Waitlist";

export default function Home() {
  return (
    <>
      <a
        href="#how"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <Nav />
      <main>
        <Hero />
        <PpaSection />
        <HowItWorks />
        <CvCheck />
        <Premium />
        <Employers />
        <Trust />
        <Pricing />
        <Faq />
        <Waitlist />
      </main>
      <Footer />
    </>
  );
}
