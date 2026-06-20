import { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  Sparkles, 
  MapPin, 
  Coins, 
  CheckCircle2, 
  Compass, 
  ShieldAlert, 
  Clock, 
  Radio, 
  Wrench, 
  ChevronRight,
  Info
} from 'lucide-react';
import { User } from '../types';
import { useAppSelector } from '../store/hooks';
import { useAppDispatch } from '../store/hooks';
import { fetchPosts } from '../store/postsSlice';

interface LandingPageProps {
  onExplore: () => void;
  onPostRequirement: () => void;
  onExplorePost: (postId: string) => void;
  onInitiateChat: (recipient: User) => void;
}

export default function LandingPage({ 
  onExplore, 
  onPostRequirement, 
  onExplorePost,
  onInitiateChat 
}: LandingPageProps) {
  const posts = useAppSelector((s) => s.posts);
  const dispatch = useAppDispatch();
  const [selectedMapPin, setSelectedMapPin] = useState<string | null>(null);
  const [activeCharterTab, setActiveCharterTab] = useState<'fees' | 'trust' | 'safety'>('fees');

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  // Find live requirements for map linkage & carousel
  const activePosts = posts.filter(p => p.status === 'open');

  // Derive map pins from live API posts
  const mapCoordinates = activePosts.slice(0, 6).map((post, i) => ({
    id: post.id,
    name: post.title,
    x: 15 + (i % 3) * 30,
    y: 20 + Math.floor(i / 3) * 45,
    category: post.category,
    budget: post.budget || 'Negotiable',
  }));

  return (
    <div className="text-zinc-100 py-2 font-sans animate-in fade-in duration-300 space-y-8">
      
      {/* MAIN HERO COCKPIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-gradient-to-br from-[#121214] via-[#121214] to-[#1a1a1f] rounded-3xl border border-[#232327] p-6 sm:p-12 relative overflow-hidden">
        {/* Futuristic Red Laser Flare Glow in the back */}
        <div className="absolute top-0 right-10 w-[500px] h-[500px] bg-[#FF3F3F]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-[300px] h-[300px] bg-[#FF3F3F]/5 rounded-full blur-[90px] pointer-events-none" />

        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/40 border border-[#FF3F3F]/40 text-[#FF3F3F] text-[10px] sm:text-[11px] font-black tracking-widest uppercase rounded">
            <Radio className="w-3.5 h-3.5 animate-pulse text-[#FF3F3F]" />
            <span>● SECTOR 62 FREELANCE HUB</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-none">
            Find Help.<br />
            <span className="text-[#FF3F3F]">Trade Services.</span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed max-w-xl">
            Welcome to the HuntInTown sector board. We cut out expensive middlemen by connecting residents, 
            freelancers, and specialty craftsmen directly inside Noida coordinates.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              id="landing-post-btn-extended"
              onClick={onPostRequirement}
              className="px-5 py-3.5 bg-[#FF3F3F] hover:bg-[#E53535] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-[#FF3F3F]/30 cursor-pointer flex items-center gap-2"
            >
              <span>Post Requirement</span>
              <ArrowUpRight className="w-4.5 h-4.5" />
            </button>
            <button
              id="landing-explore-btn-extended"
              onClick={onExplore}
              className="px-5 py-3.5 bg-zinc-850 hover:bg-zinc-800 text-zinc-100 rounded-xl font-black text-xs uppercase tracking-wider border border-zinc-700 transition cursor-pointer"
            >
              Explore Feed
            </button>
          </div>

          {/* Resident trust summary widget */}
          <div className="pt-6 border-t border-[#1e1e22]/80 flex items-center gap-4 flex-wrap">
            <div className="flex -space-x-2">
              <img className="w-8.5 h-8.5 rounded-full border-2 border-zinc-900 object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80" alt="resident-1" />
              <img className="w-8.5 h-8.5 rounded-full border-2 border-zinc-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80" alt="resident-2" />
              <img className="w-8.5 h-8.5 rounded-full border-2 border-zinc-900 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80" alt="resident-3" />
              <div className="w-8.5 h-8.5 rounded-full bg-[#FF3F3F] text-[9px] text-white flex items-center justify-center border-2 border-zinc-900 font-bold tracking-widest">+12k</div>
            </div>
            <div>
              <p className="text-xs font-bold text-white tracking-tight">12,000+ Verified Noida Residents</p>
              <p className="text-[10px] text-zinc-500 font-medium font-mono">No service margins • Transparent local exchanges</p>
            </div>
          </div>
        </div>

        {/* STATS DECORATOR COLUMN */}
        <div className="lg:col-span-12 xl:col-span-5 grid grid-cols-2 gap-4">
          <div className="bg-[#0b0b0c] p-4 rounded-xl border border-zinc-800 text-center space-y-1 hover:border-[#FF3F3F]/30 transition">
            <Compass className="w-5 h-5 text-[#FF3F3F] mx-auto" />
            <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Active Needs</span>
            <span className="block text-2xl font-black text-zinc-100">{activePosts.length} Live</span>
            <span className="block text-[9px] text-zinc-650">Urgent furniture & coaching demands</span>
          </div>

          <div className="bg-[#0b0b0c] p-4 rounded-xl border border-zinc-800 text-center space-y-1 hover:border-[#FF3F3F]/30 transition">
            <Wrench className="w-5 h-5 text-[#FF3F3F] mx-auto" />
            <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Local Experts</span>
            <span className="block text-2xl font-black text-zinc-100">12 Verified</span>
            <span className="block text-[9px] text-zinc-650">Carpenters, designers & tutors</span>
          </div>

          <div className="bg-[#0b0b0c] p-4 rounded-xl border border-zinc-800 text-center space-y-1 hover:border-[#FF3F3F]/30 transition">
            <Coins className="block w-5 h-5 text-[#FF3F3F] mx-auto" />
            <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Commission Tag</span>
            <span className="block text-2xl font-black text-zinc-100">0% Fees</span>
            <span className="block text-[9px] text-zinc-650">All value belongs to responders</span>
          </div>

          <div className="bg-[#0b0b0c] p-4 rounded-xl border border-zinc-800 text-center space-y-1 hover:border-[#FF3F3F]/30 transition">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
            <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Trade Swaps</span>
            <span className="block text-2xl font-black text-zinc-100">100% Rate</span>
            <span className="block text-[9px] text-zinc-650">With active escrow assurance</span>
          </div>
        </div>
      </div>

      {/* NOIDA CODES GRID AND INTERACTIVE ACTIVE RADAR MAP */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* INTERACTIVE COORDINATE RADAR SCREEN */}
        <div className="lg:col-span-7 bg-[#121214] rounded-2xl border border-[#232327] p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase text-zinc-200 tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#FF3F3F]" />
                <span>Sector 62 Interactive Signal Map</span>
              </h2>
              <span className="px-2 py-0.5 bg-red-950/40 border border-red-900/30 text-[#FF3F3F] text-[9px] font-mono rounded tracking-widest uppercase">
                Active Coordinate Pinning
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              Select any highlighted red coordinate ping below to immediately inspect current neighborhood requirements!
            </p>
          </div>

          {/* SVG / HTML grid mockup of coordinate map representing sector lines */}
          <div className="relative h-[250px] bg-[#0b0b0c] rounded-xl border border-[#202023] overflow-hidden flex items-center justify-center select-none group">
            {/* Sector lines pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#141418_1px,transparent_1px),linear-gradient(to_bottom,#141418_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />
            
            {/* Animated Sector scan sweeping ring */}
            <div className="absolute inset-0 bg-radial-gradient from-[#FF3F3F]/5 to-transparent pointer-events-none animate-ping duration-[6000ms]" />

            {/* Glowing compass focal point */}
            <div className="absolute w-2 h-2 rounded-full bg-[#FF3F3F] opacity-75" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
            <div className="absolute w-36 h-36 border border-[#FF3F3F]/10 rounded-full animate-pulse flex items-center justify-center pointer-events-none" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
              <div className="w-20 h-20 border border-[#FF3F3F]/5 rounded-full" />
            </div>

            {/* Outer Cardinal Markers */}
            <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-zinc-650 font-bold">N COORDINATE SECTOR BORDERS</span>
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-zinc-650 font-bold">S SECTOR 62 LINES</span>
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-mono text-zinc-650 font-bold origin-center -rotate-90">WEST BLOCKS</span>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-mono text-zinc-650 font-bold origin-center rotate-90">EAST BLOCKS</span>

            {/* Pins rendering */}
            {mapCoordinates.map(pin => (
              <button
                key={pin.id}
                id={`map-coordinate-pin-${pin.id}`}
                onClick={() => setSelectedMapPin(selectedMapPin === pin.id ? null : pin.id)}
                className="absolute group/pin cursor-pointer flex flex-col items-center"
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              >
                {/* Ping ring animation */}
                <span className="absolute inline-flex h-6 w-6 rounded-full bg-[#FF3F3F]/30 animate-ping opacity-75" />
                
                {/* Pin core */}
                <div className={`w-3.5 h-3.5 rounded-full border-2 border-[#09090b] transition ${
                  selectedMapPin === pin.id ? 'bg-[#FF3F3F] scale-125 ring-2 ring-white/10' : 'bg-red-500 hover:bg-[#FF3F3F]'
                }`} />

                {/* Always-on label preview tag */}
                <div className="mt-1 px-1.5 py-0.5 bg-[#121214]/90 border border-zinc-800 text-[8px] font-mono text-zinc-300 font-bold rounded shadow-lg opacity-80 group-hover/pin:opacity-100 whitespace-nowrap">
                  {pin.category} ({pin.budget})
                </div>
              </button>
            ))}

            {/* Selected map coordinate details pop up inside the actual map viewport */}
            {selectedMapPin && (() => {
              const activePinObj = mapCoordinates.find(x => x.id === selectedMapPin);
              if (!activePinObj) return null;
              return (
                <div className="absolute bottom-3 left-3 right-3 bg-[#121214] border-2 border-[#FF3F3F]/40 p-3 rounded-lg shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-2 duration-150">
                  <div className="min-w-0">
                    <span className="text-[8px] font-mono uppercase bg-red-950 text-[#FF3F3F] px-1 py-0.5 rounded font-black">ACTIVE SIGNAL DISCOVERED</span>
                    <h4 className="text-xs font-black text-white truncate mt-1 leading-none">{activePinObj.name}</h4>
                    <p className="text-[10px] text-zinc-400 mt-1">Region location coordinates: Sector 62, Block {activePinObj.x > 50 ? 'G' : 'C'}</p>
                  </div>
                  <button
                    id="map-detail-inspect-btn"
                    onClick={() => onExplorePost(activePinObj.id)}
                    className="px-3 py-1.5 bg-[#FF3F3F] hover:bg-[#E53535] text-white font-black text-[10px] uppercase rounded transition cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <span>Lodge Bid</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              );
            })()}
          </div>

          <div className="text-[10px] text-zinc-500 flex gap-4 items-center justify-center font-mono">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-pulse" />
              <span>Glows indicate outstanding service needs</span>
            </span>
            <span>•</span>
            <span>Refreshed live every 15s</span>
          </div>
        </div>

      </section>

      {/* ACTIVE SECTION DEMANDS SPOTLIGHT VIEW (Carousel/Pills) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xs font-black uppercase text-zinc-200 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FF3F3F]" />
              <span>Live Demands Calling response Bids</span>
            </h2>
            <p className="text-[11px] text-zinc-400 mt-0.5">Verified local requests. Lodge your custom pricing proposals to proceed.</p>
          </div>
          <button
            id="view-all-demands-bottom"
            onClick={onExplore}
            className="text-xs font-black text-[#FF3F3F] hover:underline flex items-center gap-0.5 uppercase tracking-wide"
          >
            <span>View All Requirements Feed ({activePosts.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activePosts.slice(0, 3).map(post => {
            const daysLeft = post.expiryDays || 7;
            const commentsCount = post.comments.length;
            
            return (
              <div 
                key={post.id} 
                id={`spotlight-demand-card-${post.id}`}
                className="bg-[#121214] border border-[#232327] rounded-xl hover:border-[#FF3F3F]/35 transition p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-[9px] font-extrabold uppercase bg-red-950/40 text-[#FF3F3F] border border-red-950 px-2 py-0.5 rounded tracking-wider">
                      {post.category}
                    </span>
                    <span className="text-[9px] text-zinc-500 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#FF3F3F]" />
                      {daysLeft}d remaining
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-white block truncate leading-relaxed">{post.title}</h3>
                  <p className="text-11px text-zinc-400 leading-normal line-clamp-2">{post.description}</p>
                </div>

                {/* Mini details & action button */}
                <div className="pt-2 border-t border-[#1a1a1d] flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-[9px] font-mono text-zinc-500 uppercase">Budget Bracket</p>
                    <p className="text-xs font-black text-[#FF3F3F]">{post.budget || 'Negotiable'}</p>
                  </div>
                  <button
                    id={`spotlight-inspect-post-${post.id}`}
                    onClick={() => onExplorePost(post.id)}
                    className="px-3.5 py-1.5 bg-[#FF3F3F] hover:bg-[#E53535] text-white font-black text-[10px] uppercase rounded-lg transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>Lodge Quote ({commentsCount})</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>



      {/* COMPREHENSIVE PLEDGE BOARD AND COMMUNITY CHARTER */}
      <section className="bg-zinc-900/40 rounded-2xl border border-zinc-800 p-6 space-y-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-6 h-6 text-[#FF3F3F] shrink-0" />
          <div className="space-y-1">
            <h3 className="text-xs font-black uppercase text-zinc-200 tracking-wider">HuntInTown Verified Escrow Guarantee Principles</h3>
            <p className="text-xs text-zinc-400">Our sector boards have three simple strict rules regarding resident collaboration rules:</p>
          </div>
        </div>

        {/* Dynamic Charter Switching Header Tabs */}
        <div className="flex border-b border-zinc-800 pb-1.5 gap-1 pt-2">
          <button
            onClick={() => setActiveCharterTab('fees')}
            className={`px-3 py-1 text-[10px] sm:text-xs font-bold rounded-t-lg transition tracking-wide cursor-pointer uppercase ${
              activeCharterTab === 'fees' ? 'bg-[#FF3F3F] text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            0% Platform Margin Commission Guarantee
          </button>
          <button
            onClick={() => setActiveCharterTab('trust')}
            className={`px-3 py-1 text-[10px] sm:text-xs font-bold rounded-t-lg transition tracking-wide cursor-pointer uppercase ${
              activeCharterTab === 'trust' ? 'bg-[#FF3F3F] text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            How Resident self-verification protects trade rules
          </button>
          <button
            onClick={() => setActiveCharterTab('safety')}
            className={`px-3 py-1 text-[10px] sm:text-xs font-bold rounded-t-lg transition tracking-wide cursor-pointer uppercase ${
              activeCharterTab === 'safety' ? 'bg-[#FF3F3F] text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Safe Coordinate Meeting Guidelines
          </button>
        </div>

        {/* Selected Charter dynamic text panel content */}
        <div className="p-4 bg-[#0b0b0c] border border-zinc-800 rounded-lg text-xs leading-relaxed text-zinc-300">
          {activeCharterTab === 'fees' && (
            <div id="charter-panel-fees" className="space-y-2 animate-in fade-in duration-150">
              <p className="font-bold text-white flex items-center gap-1">
                <Coins className="w-4 h-4 text-[#FF3F3F]" />
                <span>True Peer-to-Peer local transactions with zero split cuts!</span>
              </p>
              <p>
                HuntInTown does NOT process, extract, or withhold platform cuts. Every single Indian Rupee agreed upon inside the quotation bid flows entirely into the pockets of the local freelance responder. The system is funded purely by local workshop sponsor bulletin pins.
              </p>
            </div>
          )}

          {activeCharterTab === 'trust' && (
            <div id="charter-panel-trust" className="space-y-2 animate-in fade-in duration-150">
              <p className="font-bold text-white flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Sector Residents are verified via building coordination and mobile matches</span>
              </p>
              <p>
                All posters and experts are residents of nearby Noida sectors. Users can look at reputations, successful orders completed, and positive rating statistics to verify that a participant actually has active woodworking tools, coaching classrooms, or interior design expertise in the area.
              </p>
            </div>
          )}

          {activeCharterTab === 'safety' && (
            <div id="charter-panel-safety" className="space-y-2 animate-in fade-in duration-150">
              <p className="font-bold text-white flex items-center gap-1">
                <Info className="w-4 h-4 text-amber-500" />
                <span>Follow standard local meeting protocols inside public coordinate pins</span>
              </p>
              <p>
                To provide safe transactions, we recommend that final size measurements, material selections, and cash handshakes happen in public Sector coffee spaces, or verified residential block community offices. Use our secure Chat portal to log clear delivery timelines first.
              </p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
