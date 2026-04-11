"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  GraduationCap, 
  Users,
  Trophy,
  Star
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const features = [
    {
      title: "High-Fidelity Manuscripts",
      desc: "Deeply researched, academic-grade content tailored specifically for TSPSC examination standards.",
      icon: BookOpen,
      color: "blue"
    },
    {
      title: "Interactive Deep Dives",
      desc: "Go beyond text with audio summaries, interactive maps, and visual concept visualizations.",
      icon: Zap,
      color: "amber"
    },
    {
      title: "Smart Study Planning",
      desc: "AI-driven schedules that adapt to your pace and focus on high-weightage topics first.",
      icon: Sparkles,
      color: "purple"
    }
  ];

  const stats = [
    { label: "Active Aspirants", value: "10K+", icon: Users },
    { label: "Study Topics", value: "400+", icon: GraduationCap },
    { label: "Success Rate", value: "94%", icon: Trophy }
  ];

  return (
    <div className="bg-slate-950 text-white selection:bg-primary selection:text-white">
      {/* Premium Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <img src="/favicon.svg" alt="Logo" className="h-6 w-6 invert" />
             </div>
             <span className="text-xl font-black tracking-tighter">CrackSarkar</span>
          </div>

          <div className="hidden md:flex items-center gap-10">
             <a href="#features" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Features</a>
             <a href="#results" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Results</a>
             <a href="#about" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">About</a>
          </div>

          <Link href="/login">
             <motion.button 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               className="px-6 py-2.5 bg-white text-black font-bold rounded-full text-sm hover:bg-slate-100 transition-all border border-white/10"
             >
               Get Access
             </motion.button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 overflow-hidden px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-primary/20 rounded-full blur-[140px] opacity-20" />
        
        <div className="max-w-5xl mx-auto text-center space-y-12 relative z-10">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 rounded-full bg-white/5 backdrop-blur-md"
           >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-black uppercase tracking-widest text-primary/80">The standard for TSPSC Mastery</span>
           </motion.div>

           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40"
           >
             Master Every Concept. <br/>
             <span className="text-primary italic">Crack Your Exam.</span>
           </motion.h1>

           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-xl md:text-2xl text-slate-400 font-medium max-w-3xl mx-auto leading-relaxed"
           >
             The ultimate interactive academic manuscript platform for competitive aspirants. High-fidelity content designed to guarantee retention and success.
           </p>

           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             className="flex flex-col md:flex-row items-center justify-center gap-6"
           >
              <Link href="/login" className="w-full md:w-auto">
                 <button className="w-full md:w-auto px-10 py-5 bg-primary text-primary-foreground font-black rounded-3xl text-xl flex items-center justify-center gap-3 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 group">
                    Start Preparing Now <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                 </button>
              </Link>
              <a href="#features" className="w-full md:w-auto px-10 py-5 bg-white/5 text-white font-black rounded-3xl text-xl flex items-center justify-center gap-3 border border-white/10 hover:bg-white/10 transition-all">
                Explore Features
              </a>
           </motion.div>
        </div>
      </section>

      {/* Trust & Verification Bar */}
      <section className="border-y border-white/5 bg-white/[0.02] backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-wrap items-center justify-around gap-12 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
           {stats.map((s, i) => (
             <div key={i} className="flex items-center gap-4">
                <div className="h-10 w-10 bg-white/5 rounded-full flex items-center justify-center">
                   <s.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                   <div className="text-2xl font-black text-white">{s.value}</div>
                   <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{s.label}</div>
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto space-y-24">
           <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">Designed for <span className="text-primary italic">Aspirants</span></h2>
              <p className="text-slate-400 font-medium max-w-xl mx-auto px-4 leading-relaxed italic">
                "We don't just provide content. We provide a path to mastery."
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((f, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -10 }}
                  className="p-10 rounded-[3rem] bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-all group relative overflow-hidden"
                >
                   <div className="h-16 w-16 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                      <f.icon className="h-8 w-8" />
                   </div>
                   <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                   <p className="text-slate-400 leading-relaxed font-medium">
                     {f.desc}
                   </p>
                   
                   <div className="absolute -right-8 -bottom-8 h-32 w-32 bg-primary/20 rounded-full blur-[40px] opacity-0 group-hover:opacity-20 transition-opacity" />
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* Testimonial / Success Section */}
      <section id="results" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-gradient-to-t from-primary/10 to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-[4rem] p-16 text-center space-y-10 backdrop-blur-sm relative z-10">
            <div className="flex justify-center gap-1">
               {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-6 w-6 fill-amber-400 text-amber-400" />)}
            </div>
            <h3 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              "The most comprehensive platform I've used. The manuscripts are high-fidelity and the UI is beautiful."
            </h3>
            <div className="flex flex-col items-center gap-3">
               <div className="h-16 w-16 rounded-3xl bg-slate-800 border-2 border-primary" />
               <div>
                  <div className="font-bold text-lg">Srinivas Rao</div>
                  <div className="text-sm font-medium text-primary">Group II Executive Aspirant</div>
               </div>
            </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
         <div className="max-w-5xl mx-auto rounded-[4rem] bg-primary p-16 text-center space-y-8 shadow-2xl shadow-primary/40">
            <h2 className="text-5xl md:text-7xl font-black text-primary-foreground tracking-tighter leading-none">
              Your future <br/> starts today.
            </h2>
            <p className="text-primary-foreground/80 text-xl font-bold max-w-xl mx-auto uppercase tracking-wider">
              Join thousands of aspirants mastering the TSPSC Syllabus.
            </p>
            <Link href="/login" className="inline-block mt-4">
               <button className="px-12 py-6 bg-white text-black font-black rounded-full text-2xl hover:bg-slate-50 transition-all flex items-center gap-3 shadow-xl">
                  Get Unlimited Access <ArrowRight className="h-6 w-6" />
               </button>
            </Link>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10 opacity-50 font-medium">
           <div className="flex items-center gap-2">
              <img src="/favicon.svg" alt="Logo" className="h-6 w-6" />
              <span className="font-black text-lg tracking-tight">CrackSarkar</span>
           </div>
           <div className="flex gap-10 text-sm">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
           </div>
           <div className="text-sm">
             &copy; 2026 CrackSarkar. Excellence in Preparation.
           </div>
        </div>
      </footer>
    </div>
  );
}
