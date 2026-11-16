import { container } from "@/lib/ui";
import { Wordmark } from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-forest-900 text-mist">
      <div className={`${container} flex flex-wrap items-center justify-between gap-4 border-t border-white/10 py-8 text-sm`}>
        <Wordmark onDark />
        <p>© 2026 Ali &amp; Simbi</p>
        <nav aria-label="Footer" className="flex gap-5">
          <a href="#faq" className="hover:text-white">FAQ</a>
          <a href="#start" className="hover:text-white">Privacy</a>
          <a href="#start" className="hover:text-white">Terms</a>
        </nav>
      </div>
    </footer>
  );
}
