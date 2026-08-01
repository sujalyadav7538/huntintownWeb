import { useAppSelector } from "../store/hooks";
import MobileLivePosts from "./home/mobile/MobileLivePosts";
import MobileMapSection from "./home/mobile/MobileMapSection";

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
