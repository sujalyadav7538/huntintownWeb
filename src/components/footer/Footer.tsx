import { FormEvent, useState } from "react";
import {
  ArrowUpRight,
  ChevronUp,
  MapPin,
  ShieldCheck,
  HeartHandshake,
  Github,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";

import { Link } from "react-router-dom";

const exploreLinks = [
  { label: "Browse Requirements", to: "/explore" },
  { label: "Become a Helper", to: "/explore" },
  { label: "Post a Requirement", to: "/createPost" },
];

const communityLinks = [
  { label: "Trust Score", to: "/" },
  { label: "Achievement Badges", to: "/" },
  { label: "Community Guidelines", to: "/aboutUs" },
  { label: "Safety Tips", to: "/" },
];

const supportLinks = [
  { label: "Help Center", href: "mailto:support@huntintown.com" },
  { label: "Contact Us", href: "mailto:hello@huntintown.com" },
  { label: "Privacy Policy", href: "mailto:legal@huntintown.com?subject=Privacy%20Policy" },
  { label: "Terms & Conditions", href: "mailto:legal@huntintown.com?subject=Terms%20and%20Conditions" },
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com", icon: Github },
  { label: "LinkedIn", href: "https://www.linkedin.com", icon: Linkedin },
  { label: "Twitter", href: "https://x.com", icon: Twitter },
  { label: "Instagram", href: "https://www.instagram.com", icon: Instagram },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [hasError, setHasError] = useState(false);

  const handleNewsletterSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const normalized = email.trim().toLowerCase();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);

    if (!isValid) {
      setHasError(true);
      setMessage("Enter a valid email address.");
      return;
    }

    setHasError(false);
    setMessage("Thanks! We'll keep you posted.");
    setEmail("");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-zinc-800/90 bg-[#17171717]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#FF3F3F]/45 to-transparent" />

      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-black tracking-tight text-white">
              Hunt<span className="text-[#FF3F3F]">InTown</span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-zinc-400">
              A local-first network where neighbours find trusted help,
              collaborate transparently, and grow reputation through real work.
            </p>

            <div className="mt-6 space-y-2.5 text-sm text-zinc-300">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-400" />
                <span>No platform commission</span>
              </div>
              <div className="flex items-center gap-2.5">
                <HeartHandshake className="h-4.5 w-4.5 text-sky-400" />
                <span>Community-driven reputation</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4.5 w-4.5 text-[#FF3F3F]" />
                <span>Built for local communities</span>
              </div>
            </div>

            <form onSubmit={handleNewsletterSubmit} className="mt-7 space-y-2">
              <label htmlFor="footer-newsletter" className="text-xs font-semibold tracking-wide text-zinc-400">
                Stay in the loop
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="footer-newsletter"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-10 w-full rounded-xl border border-zinc-700 bg-zinc-900/80 px-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#FF3F3F]/60"
                />
                <button
                  type="submit"
                  className="inline-flex h-10 items-center gap-1 rounded-xl bg-[#FF3F3F] px-3.5 text-sm font-semibold text-white transition hover:bg-[#e63939]"
                >
                  Join
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
              {message && (
                <p className={`text-xs ${hasError ? "text-rose-400" : "text-emerald-400"}`}>
                  {message}
                </p>
              )}
            </form>
          </div>

          <div className="lg:col-span-7 grid gap-8 sm:grid-cols-3">
            <div>
              <h3 className="mb-4 text-sm font-bold text-white">Explore</h3>
              <div className="space-y-2.5 text-sm">
                {exploreLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="block text-zinc-400 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-bold text-white">Community</h3>
              <div className="space-y-2.5 text-sm">
                {communityLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="block text-zinc-400 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-bold text-white">Support</h3>
              <div className="space-y-2.5 text-sm">
                {supportLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block text-zinc-400 transition hover:text-white"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-800/90 pt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs sm:text-sm text-zinc-500">
            © {currentYear} HuntInTown. Built with community in mind.
          </p>

          <div className="flex items-center gap-2 sm:gap-3">
            {socialLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 transition hover:border-zinc-700 hover:text-white"
                >
                  <Icon className="h-4.5 w-4.5" />
                </a>
              );
            })}

            <button
              onClick={scrollToTop}
              className="inline-flex h-9 items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 text-xs font-semibold text-zinc-300 transition hover:border-zinc-700 hover:text-white"
            >
              Top
              <ChevronUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
