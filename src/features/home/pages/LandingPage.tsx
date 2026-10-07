import { useAppSelector } from "@/src/store/hooks";
import { useSeo } from "@/src/shared/hooks/useSeo";
import { SITE_URL } from "@/src/shared/lib/seo";
import Footer from "@/src/shared/components/layout/Footer";
import CommunityPrinciples from "@/src/features/home/components/CommunityPrinciples";
import HeroSection from "@/src/features/home/components/HeroSection";
import HowItWorks from "@/src/features/home/components/HowItWorks";
import TrustSystem from "@/src/features/home/components/TrustSystem";
import WhyHuntInTown from "@/src/features/home/components/WhyHuntInTown";
import Reveal from "@/src/shared/components/Reveal";

interface HomePageProps {
  onExplore: () => void;
  onPostRequirement: () => void;
  onExplorePost: (postId: string) => void;
  onInitiateChat: () => void;
}

export default function HomePage({
  onExplore,
  onPostRequirement,
}: HomePageProps) {
  const posts = useAppSelector((s) => s.posts);

  // Find live requirements for map linkage & carousel
  const activePosts = posts.filter((p) => p.status === "live");

  useSeo({
    // Home keeps the untruncated brand title rather than "Home · HuntInTown".
    title: "Find Local Help, Offer Your Skills",
    description:
      "HuntInTown connects people within local communities to post requirements, discover skilled helpers, and build lasting reputation through verified interactions.",
    path: "/",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "HuntInTown",
      url: SITE_URL || undefined,
      logo: SITE_URL ? `${SITE_URL}/logo.jpeg` : undefined,
      description:
        "A hyperlocal community network connecting neighbours who need help with skilled local helpers.",
    },
  });

  return (
    <main className="min-h-screen overflow-x-hidden">
      <HeroSection
        activePosts={activePosts}
        onPostRequirement={onPostRequirement}
        onExplore={onExplore}
      />

      <div className="px-2 sm:px-6 lg:px-10">
        <Reveal>
          <WhyHuntInTown />
        </Reveal>

        <Reveal>
          <HowItWorks />
        </Reveal>

        <Reveal>
          <TrustSystem />
        </Reveal>

        <Reveal>
          <CommunityPrinciples />
        </Reveal>
      </div>

      <Reveal>
        <Footer />
      </Reveal>
    </main>
  );
}
