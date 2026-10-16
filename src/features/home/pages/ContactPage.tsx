import { Link } from "react-router-dom";
import Footer from "@/src/shared/components/layout/Footer";
import { useSeo } from "@/src/shared/hooks/useSeo";
import { absoluteUrl } from "@/src/shared/lib/seo";

const contacts = [
  {
    title: "Account and technical support",
    description: "For sign-in issues, problems with posts or chats, and help using the platform.",
    email: "support@huntintown.com",
  },
  {
    title: "General enquiries",
    description: "For feedback, community enquiries, and questions about HuntInTown.",
    email: "hello@huntintown.com",
  },
  {
    title: "Privacy and safety",
    description: "For privacy requests, account concerns, or reports of prohibited content and behaviour.",
    email: "legal@huntintown.com",
  },
];

export default function ContactPage() {
  useSeo({
    title: "Contact Us",
    description: "Contact HuntInTown for account support, general enquiries, privacy requests, and safety concerns.",
    path: "/contact",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "Contact HuntInTown",
      url: absoluteUrl("/contact"),
      mainEntity: {
        "@type": "Organization",
        name: "HuntInTown",
        url: absoluteUrl("/"),
        contactPoint: contacts.map(({ title, email }) => ({
          "@type": "ContactPoint",
          contactType: title,
          email,
        })),
      },
    },
  });

  return (
    <>
      <section className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <Link to="/" className="theme-text-secondary text-sm underline underline-offset-4">
          Back to home
        </Link>
        <h1 className="theme-text-primary mt-6 text-3xl font-bold">Contact Us</h1>
        <p className="theme-text-muted mt-3 text-sm leading-6">
          Need assistance? Choose the contact below that best matches your question.
          You can use the email link or copy the address into your preferred email service.
        </p>
        <div className="mt-8 space-y-4">
          {contacts.map((contact) => (
            <article key={contact.email} className="theme-panel theme-divider rounded-xl border p-5">
              <h2 className="theme-text-primary font-semibold">{contact.title}</h2>
              <p className="theme-text-secondary mt-2 text-sm leading-6">{contact.description}</p>
              <a href={`mailto:${contact.email}`} className="theme-text-primary mt-3 inline-block break-all text-sm underline underline-offset-4">
                {contact.email}
              </a>
            </article>
          ))}
        </div>
        <p className="theme-text-muted mt-6 text-sm leading-6">
          Include a description of the issue and any relevant post or conversation link.
          Do not send passwords, verification codes, or payment credentials.
        </p>
        <Link to="/help" className="theme-btn-accent mt-6 inline-block rounded-lg px-4 py-2 text-sm font-semibold">
          Visit Help Center
        </Link>
      </section>
      <Footer />
    </>
  );
}
