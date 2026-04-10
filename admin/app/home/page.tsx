"use client";

import Link from "next/link";
import { Users, Box, PenTool, BookOpen, ArrowRight } from "lucide-react";

export default function AdminHome() {
  const cards = [
    { title: "Exams", desc: "Manage core curriculum anchors and paper structures", link: "/home/exam", icon: BookOpen, color: "text-[#6366f1] bg-[#161b22]" },
    { title: "Subjects", desc: "Orchestrate global subject profiles and academic modules", link: "/home/subject", icon: Users, color: "text-[#10b981] bg-[#161b22]" },
    { title: "Topics", desc: "Define strategic chapters and theoretical blocks", link: "/home/topic", icon: PenTool, color: "text-[#8b5cf6] bg-[#161b22]" },
    { title: "Sub-topics", desc: "Architect granular learning resource nodes and content", link: "/home/sub-topic", icon: Box, color: "text-[#f59e0b] bg-[#161b22]" }
  ];

  return (
    <div className="font-sans max-w-6xl">
      <div className="mb-14">
        <h1 className="text-[3.5rem] font-black mb-4 text-white tracking-tight leading-none">Good morning, <span className="text-[#6366f1]">Admin!</span></h1>
        <p className="text-gray-400 font-bold text-xl drop-shadow-sm">
          You are crafting excellence for <span className="text-[#6366f1] bg-[#6366f1]/10 px-3 py-1 rounded-lg">CrackSarkar aspirants</span>. Keep going!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((card) => (
          <Link href={card.link} key={card.title}>
            <div className="group p-10 border border-gray-800 rounded-[3rem] bg-[#0d1117] hover:border-[#6366f1]/50 hover:shadow-3xl hover:shadow-indigo-500/10 transition-all duration-500 cursor-pointer h-full flex flex-col justify-between overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#6366f1] opacity-[0.02] blur-3xl -mr-16 -mt-16 group-hover:opacity-[0.05] transition-opacity"></div>
              <div>
                <div className={`w-16 h-16 rounded-2xl ${card.color} border border-gray-800 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-[#6366f1] transition-all duration-500`}>
                  <card.icon size={28} strokeWidth={2.5} className="group-hover:text-white transition-colors" />
                </div>
                <h2 className="text-2xl font-black text-white mb-3 tracking-tight">{card.title}</h2>
                <p className="text-gray-500 text-sm leading-relaxed font-bold">{card.desc}</p>
              </div>
              <div className="mt-12 flex items-center gap-3 text-[#6366f1] font-black text-sm opacity-0 group-hover:opacity-100 transition-all duration-400 transform translate-x-2 group-hover:translate-x-0">
                Workspace <ArrowRight size={18} strokeWidth={3} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
