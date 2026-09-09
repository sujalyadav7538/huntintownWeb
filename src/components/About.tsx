import { CheckCircle, MapPin, Shield, Target, Zap } from "lucide-react";

interface AboutPageProps {
  theme?: "dark" | "light";
}

const stats = [
  { value: "10K+", label: "Early Signups" },
  { value: "50+", label: "Cities Targeted" },
  { value: "3x", label: "Faster Connections" },
  { value: "100%", label: "Free to Post" },
];

const values = [
  {
    icon: <Target className="h-6 w-6 text-red-400" />,
    title: "Precision Matching",
    desc: "Smart algorithms surface the most relevant providers for your specific requirement.",
  },
  {
    icon: <Shield className="h-6 w-6 text-red-400" />,
    title: "Verified Network",
    desc: "Every provider goes through a verification process so you always connect with trust.",
  },
  {
    icon: <Zap className="h-6 w-6 text-red-400" />,
    title: "Instant Responses",
    desc: "Post a requirement and start receiving responses within minutes, not days.",
  },
  {
    icon: <MapPin className="h-6 w-6 text-red-400" />,
    title: "Hyper-Local Focus",
    desc: "Built for Indian cities — your neighbourhood, your language, your needs.",
  },
];

const visionItems = [
  "Small businesses can reach more customers.",
  "Skilled individuals can find more work.",
  "People can access better services and better deals.",
  "Communities can grow stronger through collaboration.",
  "Trust and recommendations become more valuable than advertising.",
];

const changeItems = [
  "Reduce dependency on middlemen.",
  "Help local businesses grow.",
  "Create side-income opportunities.",
  "Improve access to quality services.",
  "Build stronger local economies.",
  "Enable communities to help one another more effectively.",
];

const whyItems = [
  "Compare different options.",
  "Understand market pricing.",
  "Evaluate expertise.",
  "Receive better recommendations.",
  "Choose the solution that best fits their needs.",
];

export default function AboutPage({ theme = "dark" }: AboutPageProps) {
  return (
    <main className="theme-page-shell min-h-screen overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="relative px-4 sm:px-6 md:px-12 lg:px-20 pt-24 pb-16 md:pb-24 text-center overflow-hidden">
        {/* <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-150 h-150 bg-red-600/15 rounded-full blur-[120px] pointer-events-none" /> */}
        <div className="absolute top-20 -right-40 w-100 h-100 bg-red-800/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-1.5 rounded-full mb-5">
            Our Story
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight">
            Connecting People. <span className="text-red-500">Creating</span>{" "}
            Opportunities.
          </h1>

          <p className="theme-text-secondary mx-auto mt-5 max-w-2xl text-base leading-relaxed sm:text-lg md:text-xl">
            HuntIn<span className="text-red-500">Town</span> is built on a
            simple belief: no one should miss an opportunity just because they
            don&apos;t know the right person.
          </p>

          <div className="theme-text-muted mt-6 flex items-center justify-center gap-2 text-sm">
            <span>Powered by</span>
            <img
              src={theme === "dark" ? "/dark_logo.png" : "/light_logo.png"}
              alt="HuntInTown"
              className="
            h-7 w-auto            
          "
            />
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="theme-divider border-y px-4 py-8 sm:px-6 md:px-12 md:py-10 lg:px-20">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="theme-text-primary text-3xl font-extrabold sm:text-4xl md:text-5xl">
                {s.value}
              </p>
              <p className="theme-text-muted mt-1 text-xs tracking-wide sm:text-sm">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT / CORE BELIEF ── */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-20 py-14 md:py-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-red-400">
              About HuntIn<span className="text-red-400">Town</span>
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
              No one should miss an opportunity because they don&apos;t know the
              right person
            </h2>
            <p className="theme-text-secondary mt-4 text-base leading-relaxed sm:text-lg">
              Every day, people need services, recommendations, skilled
              professionals, business connections, workers, freelancers,
              suppliers, and trusted contacts. Most of the time, the challenge
              isn&apos;t finding a solution — it&apos;s finding the{" "}
              <span className="theme-text-primary font-medium">right connection</span>.
            </p>
            <p className="theme-text-secondary mt-3 text-sm leading-relaxed sm:text-base">
              HuntIn<span className="text-red-500">Town</span> bridges that gap.
              We are building a community-driven platform where people can post
              their requirements and connect with genuine individuals,
              businesses, and professionals who can help.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 sm:p-6">
              <h3 className="text-red-400 font-semibold text-base sm:text-lg mb-2">
                The Problem
              </h3>
              <p className="theme-text-secondary text-sm leading-relaxed">
                People often rely on a limited circle of contacts — ending up
                choosing the first person they find, paying more than necessary,
                or receiving poor-quality work.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 sm:p-6">
              <h3 className="text-green-400 font-semibold text-base sm:text-lg mb-2">
                Our Solution
              </h3>
              <p className="theme-text-secondary text-sm leading-relaxed">
                Post your requirement once and hear from multiple verified
                professionals and businesses, whether it&apos;s a small personal
                need or a large business opportunity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY HUNTINTOWN ── */}
      <section className="theme-panel-soft px-4 py-14 sm:px-6 md:px-12 md:py-20 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-red-400">
              Why HuntIn<span className="text-red-400">Town</span>?
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold">
              Finding a service is easy.{" "}
              <span className="text-red-500">Finding the right one</span> is
              harder.
            </h2>
            <p className="theme-text-secondary mx-auto mt-4 max-w-3xl text-sm leading-relaxed sm:text-base">
              Many people need work done in domains they know very little about
              — website development, construction, digital marketing, legal
              services, manufacturing, design, repairs, logistics. Most
              don&apos;t know who to trust or how to evaluate quality. HuntIn
              <span className="text-red-500">Town</span> changes that.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* left — explanation */}
            <div className="theme-card rounded-2xl border p-6 sm:p-8">
              <p className="theme-text-secondary text-sm leading-relaxed sm:text-base">
                Instead of relying on a single contact or random recommendation,
                users can post their requirement and receive responses from
                multiple professionals, businesses, and experienced individuals
                in that domain.
              </p>
              <p className="theme-text-secondary mt-4 text-sm leading-relaxed sm:text-base">
                Even if you know nothing about a particular field, HuntIn
                <span className="text-red-500">Town</span> helps you connect
                with people who do.
              </p>
              <p className="theme-text-muted mt-5 border-l-2 border-red-500/50 pl-4 text-sm italic">
                &quot;Because everyone deserves access to the right expertise,
                the right connections, and the best possible solution.&quot;
              </p>
            </div>

            {/* right — benefits list */}
            <div>
              <p className="theme-text-muted mb-4 text-sm sm:text-base">
                This allows people to:
              </p>
              <div className="space-y-3">
                {whyItems.map((item) => (
                  <div
                    key={item}
                    className="theme-card flex items-center gap-3 rounded-xl border px-4 py-3 sm:px-5 sm:py-4"
                  >
                    <CheckCircle className="h-4 w-4 shrink-0 text-red-500 sm:h-5 sm:w-5" />
                    <span className="theme-text-secondary text-sm sm:text-base">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-20 py-14 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-red-400">
              What drives us
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold">
              Built around you
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
            {values.map((v) => (
              <div
                key={v.title}
                className="theme-card cursor-pointer rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/40 hover:shadow-[0_0_30px_rgba(239,68,68,0.08)] sm:p-7"
              >
                <div className="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
                  {v.icon}
                </div>
                <h3 className="font-semibold text-base mb-2">{v.title}</h3>
                <p className="theme-text-muted text-sm leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VISION ── */}
      <section className="theme-panel-soft px-4 py-14 sm:px-6 md:px-12 md:py-24 lg:px-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-14 items-start">
          <div className="md:sticky md:top-24">
            <span className="text-xs font-semibold uppercase tracking-widest text-red-400">
              Our Vision
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
              A connected India where every opportunity is within reach
            </h2>
            <p className="theme-text-secondary mt-4 text-sm leading-relaxed sm:text-base">
              We envision an India where opportunities are not limited by
              contacts, geography, or social circles. Our mission is to build
              India&apos;s most trusted network of opportunities, services, and
              connections — empowering people to solve problems, discover
              possibilities, and grow together.
            </p>
            <p className="theme-text-muted mt-5 border-l-2 border-red-500/50 pl-4 text-sm italic sm:text-base">
              &quot;Because when people connect, opportunities multiply.&quot;
            </p>
          </div>

          <div className="space-y-3 mt-2 md:mt-0">
            <p className="theme-text-muted mb-4 text-xs uppercase tracking-widest sm:text-sm">
              A place where:
            </p>
            {visionItems.map((item) => (
              <div
                key={item}
                className="theme-card flex items-start gap-3 rounded-xl border px-4 py-4 sm:gap-4 sm:px-6 sm:py-5"
              >
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500 sm:h-5 sm:w-5" />
                <span className="theme-text-secondary text-sm sm:text-base">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE CHANGE WE WANT TO CREATE ── */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-20 py-14 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 text-center md:mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-red-400">
              Our Impact
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold">
              The change we want to create
            </h2>
            <p className="theme-text-secondary mx-auto mt-4 max-w-2xl text-sm leading-relaxed sm:text-base">
              India is full of talent, skills, businesses, and opportunities.
              Yet millions still rely on a limited circle of contacts. HuntIn
              <span className="text-red-500">Town</span> aims to change that.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {changeItems.map((item, i) => (
              <div
                key={i}
                className="theme-card group relative cursor-pointer overflow-hidden rounded-2xl border p-5 transition hover:border-red-500/30 sm:p-7"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-red-500 to-transparent rounded-l-2xl" />
                <p className="theme-text-secondary pl-1 text-sm leading-relaxed sm:text-base">
                  {item}
                </p>
              </div>
            ))}
          </div>

          {/* closing tagline */}
          <div className="mt-12 sm:mt-16 text-center space-y-2">
            <p className="theme-text-muted text-sm sm:text-base">
              A single connection can change a person&apos;s day.
            </p>
            <p className="theme-text-secondary text-base font-medium sm:text-lg">
              A strong network can change a city.
            </p>
            <p className="theme-text-primary text-lg font-bold sm:text-xl">
              A connected India can change the future.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
