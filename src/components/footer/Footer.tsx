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
  {
    label: "Privacy Policy",
    href: "mailto:legal@huntintown.com?subject=Privacy%20Policy",
  },
  {
    label: "Terms & Conditions",
    href: "mailto:legal@huntintown.com?subject=Terms%20and%20Conditions",
  },
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
    <footer className="relative overflow-hidden border-t border-zinc-800">
      {/* Glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#FF3F3F]/10 blur-3xl" />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FF3F3F]/60 to-transparent" />

      <div className="relative px-4 pt-6 ">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand Section */}
          <div className="lg:col-span-5">
            <h2 className="text-4xl font-black tracking-tight text-white">
              Hunt
              <span className="text-[#FF3F3F]">InTown</span>
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-zinc-400">
              A local-first network where neighbours find trusted help,
              collaborate transparently, and grow reputation through real work.
            </p>

            <div className="mt-7 space-y-3">
              {[
                {
                  icon: ShieldCheck,
                  text: "No platform commission",
                  color: "text-emerald-400",
                },
                {
                  icon: HeartHandshake,
                  text: "Community-driven reputation",
                  color: "text-sky-400",
                },
                {
                  icon: MapPin,
                  text: "Built for local communities",
                  color: "text-[#FF3F3F]",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.text}
                    className="flex items-center gap-3 text-sm text-zinc-300"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800">
                      <Icon className={`h-4 w-4 ${item.color}`} />
                    </div>

                    {item.text}
                  </div>
                );
              })}
            </div>

            {/* Newsletter */}
            <form
              onSubmit={handleNewsletterSubmit}
              className="
              mt-8 rounded-2xl
              border border-zinc-800
              bg-zinc-900/60
              p-4
            "
            >
              <label
                htmlFor="footer-newsletter"
                className="text-sm font-semibold text-white"
              >
                Stay updated
              </label>

              <p className="mt-1 text-xs text-zinc-500">
                Get community updates and new features.
              </p>

              <div className="mt-4 flex gap-2">
                <input
                  id="footer-newsletter"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="
                  h-11 flex-1 rounded-xl
                  border border-zinc-700
                  bg-zinc-950
                  px-4 text-sm
                  text-white
                  placeholder:text-zinc-600
                  focus:outline-none
                  focus:border-[#FF3F3F]/60
                "
                />

                <button
                  type="submit"
                  className="
                  flex h-11 items-center gap-2
                  rounded-xl
                  bg-[#FF3F3F]
                  px-5
                  text-sm font-semibold text-white
                  transition
                  hover:bg-[#e63939]
                "
                >
                  Join
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>

              {message && (
                <p
                  className={`mt-2 text-xs ${
                    hasError ? "text-rose-400" : "text-emerald-400"
                  }`}
                >
                  {message}
                </p>
              )}
            </form>
          </div>

          {/* Links */}
          <div className="lg:col-span-7 grid gap-10 sm:grid-cols-3">
            {[
              {
                title: "Explore",
                links: exploreLinks,
              },
              {
                title: "Community",
                links: communityLinks,
              },
              {
                title: "Support",
                links: supportLinks,
              },
            ].map((section) => (
              <div key={section.title}>
                <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">
                  {section.title}
                </h3>

                <div className="space-y-3">
                  {section.links.map((link) =>
                    link.to ? (
                      <Link
                        key={link.label}
                        to={link.to}
                        className="
                        block text-sm text-zinc-400
                        transition
                        hover:text-[#FF3F3F]
                      "
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        key={link.label}
                        href={link.href}
                        className="
                        block text-sm text-zinc-400
                        transition
                        hover:text-[#FF3F3F]
                      "
                      >
                        {link.label}
                      </a>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div
          className="
          mt-14
          border-t border-zinc-800
          pt-6
          flex flex-col gap-5
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
        >
          <p className="text-sm text-zinc-500">
            © {currentYear} HuntInTown. Built with community in mind.
          </p>

          <div className="flex items-center gap-3">
            {socialLinks.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="
                  flex h-10 w-10
                  items-center justify-center
                  rounded-xl
                  border border-zinc-800
                  bg-zinc-900
                  text-zinc-400
                  transition
                  hover:border-[#FF3F3F]/50
                  hover:text-[#FF3F3F]
                "
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}

            <button
              onClick={scrollToTop}
              className="
              flex h-10 items-center gap-2
              rounded-xl
              border border-zinc-800
              bg-zinc-900
              px-4
              text-sm
              font-semibold
              text-zinc-300
              transition
              hover:border-[#FF3F3F]/50
              hover:text-white
            "
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
