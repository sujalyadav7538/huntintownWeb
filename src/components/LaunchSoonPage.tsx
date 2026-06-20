"use client";

import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  Mail, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Share2, 
  Copy, 
  Check, 
  ChevronRight, 
  Sparkles, 
  Coins, 
  ShieldCheck,
  Flame,
  MousePointerClick
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Post } from '../types';

interface LaunchSoonPageProps {
  posts: Post[];
  onEnterSandbox: () => void;
}

export default function LaunchSoonPage({ posts, onEnterSandbox }: LaunchSoonPageProps) {
  // Calculated Target Launch: set to exactly 7 days, 14 hours, 32 minutes from initial load
  const [timeLeft, setTimeLeft] = useState({
    days: 7,
    hours: 14,
    minutes: 32,
    seconds: 45
  });

  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(1242);
  const [copierState, setCopierState] = useState(false);

  // Load subscriptions & setup countdown
  useEffect(() => {
    // Subscriber logic
    if (typeof window !== 'undefined') {
      const subs = localStorage.getItem('neighbourly_subscribers');
      if (subs) {
        const list = JSON.parse(subs);
        setSubscribersCount(1242 + list.length);
        if (list.includes(email)) {
          setIsSubscribed(true);
        }
      }
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;

    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem('neighbourly_subscribers');
      const list = existing ? JSON.parse(existing) : [];
      if (!list.includes(email)) {
        list.push(email);
        localStorage.setItem('neighbourly_subscribers', JSON.stringify(list));
        setSubscribersCount(prev => prev + 1);
      }
      setIsSubscribed(true);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText('https://HuntInTown.com/launch?ref=VIP_Noida62');
      setCopierState(true);
      setTimeout(() => setCopierState(false), 2000);
    }
  };

  const launchMilestones = [
    { name: 'Core Match Machine Protocol', status: 'Completed', percent: 100 },
    { name: 'Sector 62 Location Coordinate Radar', status: 'Completed', percent: 100 },
    { name: 'Secure Private Direct Messaging Tunnel', status: 'Completed', percent: 100 },
    { name: 'Zero Commission Escrow Verification Rules', status: 'In Tuning', percent: 92 },
    { name: 'Community Security Audits & Beta', status: 'In Progress', percent: 85 }
  ];

  // Active highlighted requirements sneakpeek
  const activeSneakPeeks = posts.slice(0, 2);

  // Stagger configurations for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="text-zinc-100 py-4 max-w-5xl mx-auto space-y-10 font-sans select-text">
      
      {/* GLOW DECORATOR SPHERES */}
      <div className="absolute top-12 right-[10%] w-[400px] h-[400px] bg-[#FF3F3F]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-24 left-[5%] w-[350px] h-[350px] bg-[#FF3F3F]/5 rounded-full blur-[110px] pointer-events-none" />

      {/* ROCKED HEADER TITLE */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-red-950/45 border border-[#FF3F3F]/40 text-[#FF3F3F] text-[10px] sm:text-[11px] font-black tracking-widest uppercase rounded-full">
          <Rocket className="w-3.5 h-3.5 animate-bounce text-[#FF3F3F]" />
          <span>PROJECT STATUS: PRE-LAUNCH BEACON</span>
        </div>
        
        <h1 className="text-4xl sm:text-7xl font-extrabold tracking-tight text-white leading-none font-display">
          HuntInTown <span className="text-[#FF3F3F]">IS COMING.</span>
        </h1>
        
        <p className="text-xs sm:text-base text-zinc-400 font-normal max-w-2xl mx-auto leading-relaxed">
          The ultimate peer-to-peer neighborhood transaction network designed with zero middleman commissions, verified local residents, and hyper-accurate location matchmaking.
        </p>
      </motion.div>

      {/* INTERACTIVE COUNTDOWN GRID */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 bg-[#121214]/55 border border-[#232327] p-6 sm:p-8 rounded-3xl backdrop-blur-md"
      >
        <motion.div id="timer-days" variants={itemVariants} className="bg-[#0b0b0c] rounded-2xl border border-zinc-800 p-4 sm:p-6 text-center space-y-1">
          <span className="block text-4xl sm:text-6xl font-black text-white font-mono tracking-tight">{String(timeLeft.days).padStart(2, '0')}</span>
          <span className="block text-[10px] sm:text-xs font-bold text-[#FF3F3F] uppercase tracking-wider font-mono">Days To Go</span>
        </motion.div>

        <motion.div id="timer-hours" variants={itemVariants} className="bg-[#0b0b0c] rounded-2xl border border-zinc-800 p-4 sm:p-6 text-center space-y-1">
          <span className="block text-4xl sm:text-6xl font-black text-white font-mono tracking-tight">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="block text-[10px] sm:text-xs font-bold text-[#FF3F3F] uppercase tracking-wider font-mono">Hours Left</span>
        </motion.div>

        <motion.div id="timer-minutes" variants={itemVariants} className="bg-[#0b0b0c] rounded-2xl border border-zinc-800 p-4 sm:p-6 text-center space-y-1">
          <span className="block text-4xl sm:text-6xl font-black text-white font-mono tracking-tight">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="block text-[10px] sm:text-xs font-bold text-[#FF3F3F] uppercase tracking-wider font-mono">Minutes</span>
        </motion.div>

        <motion.div id="timer-seconds" variants={itemVariants} className="bg-[#0b0b0c] rounded-2xl border border-zinc-800 p-4 sm:p-6 text-center space-y-1 relative overflow-hidden">
          {/* subtle heartbeat indicator inside seconds container */}
          <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#FF3F3F] rounded-full animate-ping" />
          <span className="block text-4xl sm:text-6xl font-black text-[#FF3F3F] font-mono tracking-tight">{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className="block text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-wider font-mono">Seconds</span>
        </motion.div>
      </motion.div>

      {/* NOTIFY ME & SNEAK PEEK SPLIT COCKPIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT CARD: VIP WAITLIST REGISTRATION */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-6 bg-gradient-to-br from-[#121214] via-[#121214] to-[#1d1212] rounded-3xl border border-[#232327] p-6 sm:p-8 flex flex-col justify-between space-y-6"
        >
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-[#FF3F3F] uppercase tracking-widest font-mono flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#FF3F3F]" />
              <span>Verified VIP Reservation</span>
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">Secure Early Founding Resident Access</h2>
            <p className="text-xs text-zinc-400 font-normal leading-relaxed">
              Register now to claim your verified badge rank, receive launch reminders instantly directly on email release, and gain free priority coordinate listing slots.
            </p>
          </div>

          <div className="bg-[#0b0b0c] p-4 rounded-2xl border border-zinc-900 space-y-4">
            <AnimatePresence mode="wait">
              {!isSubscribed ? (
                <motion.form 
                  key="subscribe-form"
                  onSubmit={handleSubscribe} 
                  className="space-y-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">Email Address</label>
                  <div className="flex gap-2">
                    <input
                      id="launch-email-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. resident@HuntInTown.com"
                      className="flex-1 text-xs px-3.5 py-2.5 bg-[#121214] border border-[#232327] rounded-xl focus:border-[#FF3F3F] focus:outline-hidden text-zinc-100 placeholder-zinc-650 font-sans"
                      required
                    />
                    <button
                      id="launch-notify-btn"
                      type="submit"
                      className="px-5 py-2.5 bg-[#FF3F3F] hover:bg-[#E53535] text-white font-black text-xs uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      Notify Me
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div 
                  key="success-banner"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-2 space-y-2"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-1">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Waitlist Registration Confirmed!</h4>
                  <p className="text-[11px] text-zinc-400 max-w-xs mx-auto">
                    Welcome to the founding co-op! We have reserved your rank under coordinate base slot. Launch sequence directions will be forwarded shortly to your inbox.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between pt-3 border-t border-zinc-800/60 text-[10px] text-zinc-500 font-mono">
              <span>ACTIVE WAITING FOUNDERS</span>
              <span className="font-bold text-zinc-300">{subscribersCount} Sector Residents</span>
            </div>
          </div>

          <div className="space-y-2.5">
            <span className="text-[10px] font-mono text-zinc-500 uppercase font-black tracking-widest block">Invite Your Neighbor</span>
            <div className="flex items-center gap-2 bg-[#09090b] p-2.5 rounded-xl border border-zinc-850">
              <span className="text-[10px] font-mono text-zinc-400 select-all truncate flex-1 pl-1">
                https://HuntInTown.com/launch?ref=VIP_Noida62
              </span>
              <button
                id="launch-copy-btn"
                onClick={handleCopyLink}
                className="p-2 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-lg transition border border-zinc-700 cursor-pointer flex items-center justify-center gap-1"
              >
                {copierState ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[9px] font-mono font-bold text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#FF3F3F]" />
                    <span className="text-[9px] font-mono font-bold text-zinc-400">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* RIGHT CARD: EXPLORE PREVIEW SANDBOX ACCELERATOR */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="lg:col-span-6 bg-[#121214] rounded-3xl border border-[#232327] p-6 sm:p-8 flex flex-col justify-between space-y-6"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#FF3F3F] uppercase tracking-widest font-mono flex items-center gap-1.5">
                <MousePointerClick className="w-3.5 h-3.5 text-[#FF3F3F]" />
                <span>Interim Sandbox Sneak Peek</span>
              </span>
              <span className="px-2 py-0.5 bg-red-950/45 border border-red-900/35 text-[#FF3F3F] text-[9px] font-mono rounded font-black animate-pulse">
                STATE: PLAYABLE
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">Inspect Live Capability Sandbox</h2>
            <p className="text-xs text-zinc-400 font-normal leading-relaxed">
              We believe in design transparency! Tap the Sandbox explorer button below to access our modular feed stream, private mock-bidding channels, dashboard listings, and chats ahead of release.
            </p>
          </div>

          <div className="space-y-3 bg-[#0b0b0c] p-4 rounded-2xl border border-zinc-900">
            <span className="text-[9px] font-mono text-zinc-500 uppercase font-black tracking-widest block mb-1">Incoming Sector Demands Sneak Peak</span>
            
            <div className="space-y-2.5">
              {activeSneakPeeks.map(p => (
                <div key={p.id} className="p-3 bg-[#121214] border border-zinc-800 rounded-xl space-y-1.5 text-xs text-left">
                  <div className="flex justify-between items-center gap-2">
                    <span className="px-1.5 py-0.5 bg-red-950 border border-red-900 text-[#FF3F3F] text-[8px] font-black uppercase rounded tracking-wider">
                      {p.category}
                    </span>
                    <span className="text-[9px] text-[#FF3F3F] font-bold font-mono">{p.budget || 'Negotiable'}</span>
                  </div>
                  <h3 className="font-bold text-white text-[11px] truncate leading-none">{p.title}</h3>
                  <div className="flex items-center gap-1 text-[8px] text-zinc-500 font-mono">
                    <MapPin className="w-2.5 h-2.5 text-[#FF3F3F]" />
                    <span>Noida Sector 62</span>
                    <span>•</span>
                    <span>{p.comments.length} Responses ready</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            id="launch-sandbox-btn"
            onClick={onEnterSandbox}
            className="w-full py-4 bg-[#FF3F3F] hover:bg-[#E53535] text-white rounded-2xl transition shadow-xl hover:shadow-[#FF3F3F]/25 text-center font-extrabold text-xs uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Enter Applet Preview Sandbox</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>

      </div>

      {/* COMPREHENSIVE ROADMAP PROGRESS LIST */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-[#121214] rounded-3xl border border-[#232327] p-6 sm:p-8 space-y-6"
      >
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="space-y-1">
            <h3 className="text-xs font-black uppercase text-zinc-400 tracking-widest font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#FF3F3F]" />
              <span>Launch Readiness Checklist</span>
            </h3>
            <p className="text-xs text-zinc-400">Inspecting current coordination goals & deployment tasks.</p>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Total Platform Score</span>
            <span className="text-xl sm:text-2xl font-black text-[#FF3F3F] font-mono">96.4% READY</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {launchMilestones.map((m, idx) => (
            <div key={idx} className="bg-[#0b0b0c] p-4 rounded-xl border border-zinc-900 flex justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${m.percent === 100 ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                <div className="space-y-0.5">
                  <span className="block text-xs font-bold text-white leading-normal">{m.name}</span>
                  <span className="block text-[10px] text-zinc-500 font-mono">{m.status}</span>
                </div>
              </div>
              <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                m.percent === 100 ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' : 'bg-amber-950 text-amber-400 border border-amber-900'
              }`}>
                {m.percent}%
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* PLATFORM CHARTER PLEDGES ACCORDION TEASERS */}
      <section className="bg-zinc-900/40 rounded-3xl border border-zinc-800 p-6 sm:p-8 space-y-6">
        <h3 className="text-xs font-black uppercase text-zinc-400 tracking-widest text-center font-mono flex items-center justify-center gap-1.5">
          <Flame className="w-4 h-4 text-[#FF3F3F]" />
          <span>Core HuntInTown Pledges</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-center">
          <div className="space-y-2 bg-[#0b0b0c] p-5 rounded-2xl border border-zinc-900 text-center">
            <div className="w-10 h-10 rounded-full bg-red-950/40 text-[#FF3F3F] flex items-center justify-center mx-auto border border-red-900/20">
              <Coins className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white tracking-tight">Zero Commissions</h4>
            <p className="text-zinc-400 leading-relaxed font-normal">
              Unlike huge corporate aggregators, we cut out transaction commissions completely. Responders keep 100% of their quote.
            </p>
          </div>

          <div className="space-y-2 bg-[#0b0b0c] p-5 rounded-2xl border border-zinc-900 text-center">
            <div className="w-10 h-10 rounded-full bg-red-950/40 text-[#FF3F3F] flex items-center justify-center mx-auto border border-red-900/20">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white tracking-tight">Noida Sector Coordinates</h4>
            <p className="text-zinc-400 leading-relaxed font-normal">
              Tailored specifically for Noida resident bases. Meet in public community centers or verified sector landmarks comfortably.
            </p>
          </div>

          <div className="space-y-2 bg-[#0b0b0c] p-5 rounded-2xl border border-zinc-900 text-center">
            <div className="w-10 h-10 rounded-full bg-red-950/40 text-[#FF3F3F] flex items-center justify-center mx-auto border border-red-900/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white tracking-tight">Secure Chat Portals</h4>
            <p className="text-zinc-400 leading-relaxed font-normal">
              Communicate private delivery schedules and bid nuances inside verified resident chats. Safety remains absolute.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
