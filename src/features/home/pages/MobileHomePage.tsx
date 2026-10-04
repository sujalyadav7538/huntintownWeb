import { useAppSelector } from "@/src/store/hooks";
import MobileLivePosts from "@/src/features/home/components/MobileLivePosts";
import MobileMapSection from "@/src/features/home/components/MobileMapSection";

const MobileHomePage = ({setActiveTab}) => {
  const posts = useAppSelector((s) => s.posts);
  const activePosts = posts.filter((p) => p.status === "live");
  return (
    <div>
      <MobileMapSection posts={activePosts} />
      <MobileLivePosts posts={activePosts} onViewAll={()=>setActiveTab("explore")}/>
    </div>
  );
};

export default MobileHomePage;
