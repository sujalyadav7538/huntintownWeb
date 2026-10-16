import { Link } from "react-router-dom";
import Footer from "@/src/shared/components/layout/Footer";
import { useSeo } from "@/src/shared/hooks/useSeo";
import { absoluteUrl } from "@/src/shared/lib/seo";

const questions = [
  {
    question: "How do I post a requirement?",
    answer: "Sign in and choose Post. Select a category, describe what you need, add your budget and timeline, then review and publish your requirement.",
    to: "/create-post",
    label: "Post a requirement",
  },
  {
    question: "How do I offer help?",
    answer: "Browse requirements in Explore, open a post that matches your skills, and submit an offer. You need to sign in before applying.",
    to: "/explore",
    label: "Browse requirements",
  },
  {
    question: "Where can I manage my posts and offers?",
    answer: "Your dashboard shows your published requirements and submitted offers. Open a requirement to review incoming offers.",
    to: "/dashboard",
    label: "Open dashboard",
  },
  {
    question: "Where do I find my conversations?",
    answer: "Open Chat. My Posts contains conversations on requirements you published; My Chats contains conversations where you are the helper. Chat becomes available after an offer is accepted.",
    to: "/messaging",
    label: "Open messages",
  },
  {
    question: "How can I stay safe?",
    answer: "Review profiles and reputation before agreeing to work. Confirm the scope, budget, and timeline in chat. Never share passwords or verification codes. Contact us about suspicious activity or inappropriate content.",
    to: "/contact",
    label: "Contact support",
  },
  {
    question: "How do I update my profile?",
    answer: "Open your profile and choose Edit Profile to update your details, location, profile photo, and cover image.",
    to: "/profile",
    label: "Open profile",
  },
];

export default function HelpCenterPage() {
  useSeo({
    title: "Help Center",
    description: "Find help with posting requirements, offering your skills, managing conversations, and staying safe on HuntInTown.",
    path: "/help",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      url: absoluteUrl("/help"),
      name: "HuntInTown Help Center",
      mainEntity: questions.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  });

  return (
    <>
      <section className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <Link to="/" className="theme-text-secondary text-sm underline underline-offset-4">
          Back to home
        </Link>
        <h1 className="theme-text-primary mt-6 text-3xl font-bold">Help Center</h1>
        <p className="theme-text-muted mt-3 text-sm leading-6">
          Answers to common questions about using HuntInTown.
        </p>
        <div className="mt-8 space-y-3">
          {questions.map((item) => (
            <details key={item.question} className="theme-panel theme-divider rounded-xl border p-5">
              <summary className="theme-text-primary cursor-pointer text-sm font-semibold">
                {item.question}
              </summary>
              <p className="theme-text-secondary mt-3 text-sm leading-6">{item.answer}</p>
              <Link to={item.to} className="theme-text-primary mt-3 inline-block text-sm underline underline-offset-4">
                {item.label}
              </Link>
            </details>
          ))}
        </div>
        <div className="theme-panel theme-divider mt-8 rounded-xl border p-5">
          <h2 className="theme-text-primary font-semibold">Still need help?</h2>
          <p className="theme-text-muted mt-2 text-sm">Find the right contact for your question.</p>
          <Link to="/contact" className="theme-btn-accent mt-4 inline-block rounded-lg px-4 py-2 text-sm font-semibold">
            Contact Us
          </Link>
        </div>
      </section>
      <Footer />
    </>
  );
}
