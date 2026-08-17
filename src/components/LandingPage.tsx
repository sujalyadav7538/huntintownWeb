import { useAppSelector } from "../store/hooks";
import Footer from "./footer/Footer";
import CommunityPrinciples from "./home/CommunityPrinciples";
import HeroSection from "./home/HeroSection";
import HowItWorks from "./home/HowItWorks";
import TrustSystem from "./home/TrustSystem";
import WhyHuntInTown from "./home/WhyHuntInTown";
import MapSection from "./map/MapSection";

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

  return (
    <main className="min-h-screen bg-[#171717] text-white overflow-x-hidden">
      {/* Hero */}
      <HeroSection
        activePosts={activePosts}
        onPostRequirement={onPostRequirement}
        onExplore={onExplore}
      />

      {/* Main Content */}
      <div className="">
        <MapSection posts={activePosts} />

        <WhyHuntInTown />

        <HowItWorks />

        <TrustSystem />

        <CommunityPrinciples />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
