import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "@/src/store/hooks";
import { useSeo } from "@/src/shared/hooks/useSeo";
import { SITE_URL } from "@/src/shared/lib/seo";
import Footer from "@/src/shared/components/layout/Footer";
import CommunityPrinciples from "@/src/features/home/components/CommunityPrinciples";
import HeroSection from "@/src/features/home/components/HeroSection";
import HowItWorks from "@/src/features/home/components/HowItWorks";
import TrustSystem from "@/src/features/home/components/TrustSystem";
import WhyHuntInTown from "@/src/features/home/components/WhyHuntInTown";
import AnimatedContent from "@/src/shared/components/AnimatedContent";

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
  const location = useLocation();

  useEffect(() => {
    const sectionId = location.hash.slice(1);
    if (!sectionId) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({ block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [location.hash, location.key]);

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
      logo: SITE_URL ? `${SITE_URL}/logo.png` : undefined,
      description:
        "A hyperlocal community network connecting neighbours who need help with skilled local helpers.",
    },
  });

  return (
    <div className="w-full overflow-x-hidden">
      <HeroSection
        activePosts={activePosts}
        onPostRequirement={onPostRequirement}
        onExplore={onExplore}
      />

      <div className="px-2 sm:px-6 lg:px-10">
        <AnimatedContent revealOnScroll duration={0.5}>
          <WhyHuntInTown />
        </AnimatedContent>
        <AnimatedContent revealOnScroll duration={0.5}>
          <HowItWorks />
        </AnimatedContent>
        <AnimatedContent revealOnScroll duration={0.5}>
          <TrustSystem />
        </AnimatedContent>
        <AnimatedContent revealOnScroll duration={0.5}>
          <CommunityPrinciples />
        </AnimatedContent>
      </div>

      <Footer />
    </div>
  );
}
