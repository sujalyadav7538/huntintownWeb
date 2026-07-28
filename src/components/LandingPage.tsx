// import { useState, useEffect } from "react";
// import {
//   ArrowUpRight,
//   Sparkles,
//   MapPin,
//   Coins,
//   CheckCircle2,
//   Compass,
//   ShieldAlert,
//   Clock,
//   Radio,
//   Wrench,
//   ChevronRight,
//   Info,
// } from "lucide-react";
// import { User } from "../types";
// import { useAppSelector } from "../store/hooks";
// import { useAppDispatch } from "../store/hooks";
// import { fetchPosts } from "../store/postsSlice";
// import HuntMap from "./map/HuntMap";
// import Footer from "./footer/Footer";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import Footer from "./footer/Footer";
import CommunityPrinciples from "./home/CommunityPrinciples";
import HeroSection from "./home/HeroSection";
import HowItWorks from "./home/HowItWorks";
import TrustSystem from "./home/TrustSystem";
import WhyHuntInTown from "./home/WhyHuntInTown";
import { fetchPosts } from "../store/postsSlice";
import { MapPin } from "lucide-react";
import HuntMap from "./map/HuntMap";
import MapSection from "./map/MapSection";

interface HomePageProps {
  onExplore: () => void;
  onPostRequirement: () => void;
  onExplorePost: (postId: string) => void;
  onInitiateChat: () => void;
}

// export default function LandingPage({
//   onExplore,
//   onPostRequirement,
//   onExplorePost,
// }: LandingPageProps) {
//   const posts = useAppSelector((s) => s.posts);
//   const dispatch = useAppDispatch();
//   const [selectedMapPin, setSelectedMapPin] = useState<string | null>(null);
//   const [activeCharterTab, setActiveCharterTab] = useState<
//     "fees" | "trust" | "safety"
//   >("fees");

//   useEffect(() => {
//     console.log("Calling Post ");
//     dispatch(fetchPosts());
//   }, []);

//   // Find live requirements for map linkage & carousel
//   const activePosts = posts.filter((p) => p.status === "live");

//   // Derive map pins from live API posts
//   const mapCoordinates = activePosts.slice(0, 6).map((post, i) => ({
//     id: post.id,
//     name: post.title,
//     x: 15 + (i % 3) * 30,
//     y: 20 + Math.floor(i / 3) * 45,
//     category: post.category,
//     budget: post.budget || "Negotiable",
//   }));
//   return (
//     <div className="text-zinc-100 py-2 font-sans animate-in fade-in duration-300 space-y-8">
//       {/* MAIN HERO COCKPIT */}
//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-gradient-to-br from-[#121214] via-[#121214] to-[#1a1a1f] rounded-3xl border border-[#232327] p-6 sm:p-12 relative overflow-hidden">
//         {/* Futuristic Red Laser Flare Glow in the back */}
//         <div className="absolute top-0 right-10 w-[500px] h-[500px] bg-[#FF3F3F]/10 rounded-full blur-[120px] pointer-events-none" />
//         <div className="absolute -bottom-10 -left-10 w-[300px] h-[300px] bg-[#FF3F3F]/5 rounded-full blur-[90px] pointer-events-none" />

//         <div className="lg:col-span-12 xl:col-span-7 space-y-6">
//           <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/40 border border-[#FF3F3F]/40 text-[#FF3F3F] text-[10px] sm:text-[11px] font-black tracking-widest uppercase rounded">
//             <Radio className="w-3.5 h-3.5 animate-pulse text-[#FF3F3F]" />
//             <span>● SECTOR 62 FREELANCE HUB</span>
//           </div>

//           <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-none">
//             Find Help.
//             <br />
//             <span className="text-[#FF3F3F]">Trade Services.</span>
//           </h1>

//           <p className="text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed max-w-xl">
//             Welcome to the HuntInTown sector board. We cut out expensive
//             middlemen by connecting residents, freelancers, and specialty
//             craftsmen directly inside Noida coordinates.
//           </p>

//           <div className="flex flex-wrap gap-3 pt-2">
//             <button
//               id="landing-post-btn-extended"
//               onClick={onPostRequirement}
//               className="px-5 py-3.5 bg-[#FF3F3F] hover:bg-[#E53535] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-[#FF3F3F]/30 cursor-pointer flex items-center gap-2"
//             >
//               <span>Post Requirement</span>
//               <ArrowUpRight className="w-4.5 h-4.5" />
//             </button>
//             <button
//               id="landing-explore-btn-extended"
//               onClick={onExplore}
//               className="px-5 py-3.5 bg-zinc-850 hover:bg-zinc-800 text-zinc-100 rounded-xl font-black text-xs uppercase tracking-wider border border-zinc-700 transition cursor-pointer"
//             >
//               Explore Feed
//             </button>
//           </div>

//           {/* Resident trust summary widget */}
//           <div className="pt-6 border-t border-[#1e1e22]/80 flex items-center gap-4 flex-wrap">
//             <div className="flex -space-x-2">
//               <img
//                 className="w-8.5 h-8.5 rounded-full border-2 border-zinc-900 object-cover"
//                 src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80"
//                 alt="resident-1"
//               />
//               <img
//                 className="w-8.5 h-8.5 rounded-full border-2 border-zinc-900 object-cover"
//                 src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80"
//                 alt="resident-2"
//               />
//               <img
//                 className="w-8.5 h-8.5 rounded-full border-2 border-zinc-900 object-cover"
//                 src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80"
//                 alt="resident-3"
//               />
//               <div className="w-8.5 h-8.5 rounded-full bg-[#FF3F3F] text-[9px] text-white flex items-center justify-center border-2 border-zinc-900 font-bold tracking-widest">
//                 +12k
//               </div>
//             </div>
//             <div>
//               <p className="text-xs font-bold text-white tracking-tight">
//                 12,000+ Verified Noida Residents
//               </p>
//               <p className="text-[10px] text-zinc-500 font-medium font-mono">
//                 No service margins • Transparent local exchanges
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* STATS DECORATOR COLUMN */}
//         <div className="lg:col-span-12 xl:col-span-5 grid grid-cols-2 gap-4">
//           <div className="bg-[#0b0b0c] p-4 rounded-xl border border-zinc-800 text-center space-y-1 hover:border-[#FF3F3F]/30 transition">
//             <Compass className="w-5 h-5 text-[#FF3F3F] mx-auto" />
//             <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
//               Active Needs
//             </span>
//             <span className="block text-2xl font-black text-zinc-100">
//               {activePosts.length} Live
//             </span>
//             <span className="block text-[9px] text-zinc-650">
//               Urgent furniture & coaching demands
//             </span>
//           </div>

//           <div className="bg-[#0b0b0c] p-4 rounded-xl border border-zinc-800 text-center space-y-1 hover:border-[#FF3F3F]/30 transition">
//             <Wrench className="w-5 h-5 text-[#FF3F3F] mx-auto" />
//             <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
//               Local Experts
//             </span>
//             <span className="block text-2xl font-black text-zinc-100">
//               12 Verified
//             </span>
//             <span className="block text-[9px] text-zinc-650">
//               Carpenters, designers & tutors
//             </span>
//           </div>

//           <div className="bg-[#0b0b0c] p-4 rounded-xl border border-zinc-800 text-center space-y-1 hover:border-[#FF3F3F]/30 transition">
//             <Coins className="block w-5 h-5 text-[#FF3F3F] mx-auto" />
//             <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
//               Commission Tag
//             </span>
//             <span className="block text-2xl font-black text-zinc-100">
//               0% Fees
//             </span>
//             <span className="block text-[9px] text-zinc-650">
//               All value belongs to responders
//             </span>
//           </div>

//           <div className="bg-[#0b0b0c] p-4 rounded-xl border border-zinc-800 text-center space-y-1 hover:border-[#FF3F3F]/30 transition">
//             <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
//             <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
//               Trade Swaps
//             </span>
//             <span className="block text-2xl font-black text-zinc-100">
//               100% Rate
//             </span>
//             <span className="block text-[9px] text-zinc-650">
//               With active escrow assurance
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* NOIDA CODES GRID AND INTERACTIVE ACTIVE RADAR MAP */}
//       <section className="lg:col-span-7 bg-[#121214] rounded-2xl border border-[#232327] p-5 flex flex-col justify-between space-y-4">
//         <div className="flex items-center justify-between">
//           <h2 className="text-xs font-black uppercase text-zinc-200 tracking-wider flex items-center gap-1.5">
//             <MapPin className="w-4 h-4 text-[#FF3F3F]" />
//             <span>Explore Opportunities In Your Domain....... </span>
//           </h2>

//         </div>

//         <HuntMap posts={posts} />
//       </section>

//       {/* ACTIVE SECTION DEMANDS SPOTLIGHT VIEW (Carousel/Pills) */}
//       <section className="space-y-4">
//         <div className="flex items-center justify-between flex-wrap gap-2">
//           <div>
//             <h2 className="text-xs font-black uppercase text-zinc-200 tracking-wider flex items-center gap-1.5">
//               <Sparkles className="w-4 h-4 text-[#FF3F3F]" />
//               <span>Live Demands Calling response Bids</span>
//             </h2>
//             <p className="text-[11px] text-zinc-400 mt-0.5">
//               Verified local requests. Lodge your custom pricing proposals to
//               proceed.
//             </p>
//           </div>
//           <button
//             id="view-all-demands-bottom"
//             onClick={onExplore}
//             className="text-xs font-black text-[#FF3F3F] hover:underline flex items-center gap-0.5 uppercase tracking-wide"
//           >
//             <span>View All Requirements Feed ({activePosts.length})</span>
//             <ChevronRight className="w-4 h-4" />
//           </button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//           {activePosts.slice(0, 3).map((post) => {
//             const daysLeft = post.expiryDays || 7;
//             const commentsCount = post.comments.length;

//             return (
//               <div
//                 key={post.id}
//                 id={`spotlight-demand-card-${post.id}`}
//                 className="bg-[#121214] border border-[#232327] rounded-xl hover:border-[#FF3F3F]/35 transition p-5 flex flex-col justify-between space-y-4"
//               >
//                 <div className="space-y-2">
//                   <div className="flex justify-between items-center gap-2">
//                     <span className="text-[9px] font-extrabold uppercase bg-red-950/40 text-[#FF3F3F] border border-red-950 px-2 py-0.5 rounded tracking-wider">
//                       {post.category}
//                     </span>
//                     <span className="text-[9px] text-zinc-500 font-mono flex items-center gap-1">
//                       <Clock className="w-3 h-3 text-[#FF3F3F]" />
//                       {daysLeft}d remaining
//                     </span>
//                   </div>
//                   <h3 className="text-xs font-bold text-white block truncate leading-relaxed">
//                     {post.title}
//                   </h3>
//                   <p className="text-11px text-zinc-400 leading-normal line-clamp-2">
//                     {post.description}
//                   </p>
//                 </div>

//                 {/* Mini details & action button */}
//                 <div className="pt-2 border-t border-[#1a1a1d] flex items-center justify-between">
//                   <div className="text-left">
//                     <p className="text-[9px] font-mono text-zinc-500 uppercase">
//                       Budget Bracket
//                     </p>
//                     <p className="text-xs font-black text-[#FF3F3F]">
//                       {post.budget || "Negotiable"}
//                     </p>
//                   </div>
//                   <button
//                     id={`spotlight-inspect-post-${post.id}`}
//                     onClick={() => onExplorePost(post.id)}
//                     className="px-3.5 py-1.5 bg-[#FF3F3F] hover:bg-[#E53535] text-white font-black text-[10px] uppercase rounded-lg transition-all cursor-pointer flex items-center gap-1"
//                   >
//                     <span>Lodge Quote ({commentsCount})</span>
//                     <ChevronRight className="w-3 h-3" />
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </section>

//       {/* COMPREHENSIVE PLEDGE BOARD AND COMMUNITY CHARTER */}
//       {/* <section className="bg-zinc-900/40 rounded-2xl border border-zinc-800 p-6 space-y-4">
//         <div className="flex items-start gap-3">
//           <ShieldAlert className="w-6 h-6 text-[#FF3F3F] shrink-0" />
//           <div className="space-y-1">
//             <h3 className="text-xs font-black uppercase text-zinc-200 tracking-wider">
//               HuntInTown Verified Escrow Guarantee Principles
//             </h3>
//             <p className="text-xs text-zinc-400">
//               Our sector boards have three simple strict rules regarding
//               resident collaboration rules:
//             </p>
//           </div>
//         </div>

//         {/* Dynamic Charter Switching Header Tabs */}
//         <div className="flex border-b border-zinc-800 pb-1.5 gap-1 pt-2">
//           <button
//             onClick={() => setActiveCharterTab("fees")}
//             className={`px-3 py-1 text-[10px] sm:text-xs font-bold rounded-t-lg transition tracking-wide cursor-pointer uppercase ${
//               activeCharterTab === "fees"
//                 ? "bg-[#FF3F3F] text-white"
//                 : "text-zinc-400 hover:text-zinc-200"
//             }`}
//           >
//             0% Platform Margin Commission Guarantee
//           </button>
//           <button
//             onClick={() => setActiveCharterTab("trust")}
//             className={`px-3 py-1 text-[10px] sm:text-xs font-bold rounded-t-lg transition tracking-wide cursor-pointer uppercase ${
//               activeCharterTab === "trust"
//                 ? "bg-[#FF3F3F] text-white"
//                 : "text-zinc-400 hover:text-zinc-200"
//             }`}
//           >
//             How Resident self-verification protects trade rules
//           </button>
//           <button
//             onClick={() => setActiveCharterTab("safety")}
//             className={`px-3 py-1 text-[10px] sm:text-xs font-bold rounded-t-lg transition tracking-wide cursor-pointer uppercase ${
//               activeCharterTab === "safety"
//                 ? "bg-[#FF3F3F] text-white"
//                 : "text-zinc-400 hover:text-zinc-200"
//             }`}
//           >
//             Safe Coordinate Meeting Guidelines
//           </button>
//         </div>

//         {/* Selected Charter dynamic text panel content */}
//         <div className="p-4 bg-[#0b0b0c] border border-zinc-800 rounded-lg text-xs leading-relaxed text-zinc-300">
//           {activeCharterTab === "fees" && (
//             <div
//               id="charter-panel-fees"
//               className="space-y-2 animate-in fade-in duration-150"
//             >
//               <p className="font-bold text-white flex items-center gap-1">
//                 <Coins className="w-4 h-4 text-[#FF3F3F]" />
//                 <span>
//                   True Peer-to-Peer local transactions with zero split cuts!
//                 </span>
//               </p>
//               <p>
//                 HuntInTown does NOT process, extract, or withhold platform cuts.
//                 Every single Indian Rupee agreed upon inside the quotation bid
//                 flows entirely into the pockets of the local freelance
//                 responder. The system is funded purely by local workshop sponsor
//                 bulletin pins.
//               </p>
//             </div>
//           )}

//           {activeCharterTab === "trust" && (
//             <div
//               id="charter-panel-trust"
//               className="space-y-2 animate-in fade-in duration-150"
//             >
//               <p className="font-bold text-white flex items-center gap-1">
//                 <CheckCircle2 className="w-4 h-4 text-emerald-400" />
//                 <span>
//                   Sector Residents are verified via building coordination and
//                   mobile matches
//                 </span>
//               </p>
//               <p>
//                 All posters and experts are residents of nearby Noida sectors.
//                 Users can look at reputations, successful orders completed, and
//                 positive rating statistics to verify that a participant actually
//                 has active woodworking tools, coaching classrooms, or interior
//                 design expertise in the area.
//               </p>
//             </div>
//           )}

//           {activeCharterTab === "safety" && (
//             <div
//               id="charter-panel-safety"
//               className="space-y-2 animate-in fade-in duration-150"
//             >
//               <p className="font-bold text-white flex items-center gap-1">
//                 <Info className="w-4 h-4 text-amber-500" />
//                 <span>
//                   Follow standard local meeting protocols inside public
//                   coordinate pins
//                 </span>
//               </p>
//               <p>
//                 To provide safe transactions, we recommend that final size
//                 measurements, material selections, and cash handshakes happen in
//                 public Sector coffee spaces, or verified residential block
//                 community offices. Use our secure Chat portal to log clear
//                 delivery timelines first.
//               </p>
//             </div>
//           )}
//         </div>
//       {/* </section> */}
//       <Footer/>
//     </div>
//   );
// }

export default function HomePage({
  onExplore,
  onPostRequirement,
  onExplorePost,
}: HomePageProps) {
  const posts = useAppSelector((s) => s.posts);
  const dispatch = useAppDispatch();
  const [selectedMapPin, setSelectedMapPin] = useState<string | null>(null);
  const [activeCharterTab, setActiveCharterTab] = useState<
    "fees" | "trust" | "safety"
  >("fees");

  useEffect(() => {
    console.log("Calling Post ");
    dispatch(fetchPosts());
  }, []);

  // Find live requirements for map linkage & carousel
  const activePosts = posts.filter((p) => p.status === "live");

  // Derive map pins from live API posts
  const mapCoordinates = activePosts.slice(0, 6).map((post, i) => ({
    id: post.id,
    name: post.title,
    x: 15 + (i % 3) * 30,
    y: 20 + Math.floor(i / 3) * 45,
    category: post.category,
    budget: post.budget || "Negotiable",
  }));
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
