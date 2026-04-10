"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard,
  GraduationCap, 
  ChevronDown, 
  ChevronRight,
  BookOpen,
  Users,
  PenTool,
  Box
} from "lucide-react";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSyllabusOpen, setIsSyllabusOpen] = useState(true);
  const isDashboardActive = pathname === "/home";

  const contentItems = [
    { name: "Exams", href: "/home/exam", icon: BookOpen },
    { name: "Subjects", href: "/home/subject", icon: Users },
    { name: "Topics", href: "/home/topic", icon: PenTool },
    { name: "Sub-topics", href: "/home/sub-topic", icon: Box },
  ];

  return (
    <div className="min-h-screen bg-[#0a0c10] flex flex-col font-sans text-white">
      <div className="flex flex-1 overflow-hidden p-0 gap-0">
        
        {/* Left Sidebar */}
        <aside className="w-72 bg-[#0d1117] border-r border-gray-800 flex flex-col shrink-0 overflow-y-auto">
          <div className="p-8 pb-4">
            {/* Branding */}
            <div className="mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#6366f1] rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <span className="text-white font-black text-xl italic">C</span>
              </div>
              <span className="text-white text-2xl font-black tracking-tighter italic">CrackSarkar <span className="text-[#6366f1]">Admin</span></span>
            </div>
            
            <nav className="space-y-1">
              <Link href="/home" 
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-md font-bold transition-all duration-300 ${
                  isDashboardActive 
                  ? 'bg-[#6366f1] text-white shadow-xl shadow-indigo-500/20' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <LayoutDashboard size={22} strokeWidth={2.5} />
                Dashboard Hub
              </Link>

              <div>
                <button 
                  onClick={() => setIsSyllabusOpen(!isSyllabusOpen)}
                  className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
                    isSyllabusOpen ? 'text-white' : 'text-gray-500 hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <GraduationCap size={20} className={isSyllabusOpen ? "text-[#6366f1]" : "text-gray-500"} />
                    Syllabus CMS
                  </div>
                  {isSyllabusOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>

                {isSyllabusOpen && (
                  <div className="mt-1 ml-4 pl-4 border-l border-gray-800 space-y-1">
                    {contentItems.map(item => {
                      const isActive = pathname.startsWith(item.href);
                      return (
                        <Link href={item.href} key={item.name}
                          className={`flex items-center gap-3 text-sm py-3 px-4 rounded-xl font-bold transition-all duration-300 ${
                            isActive 
                            ? 'text-[#6366f1] bg-indigo-500/5' 
                            : 'text-gray-500 hover:text-white hover:bg-gray-800'
                          }`}
                        >
                          <item.icon size={18} />
                          {item.name}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>

            </nav>
          </div>

          <div className="mt-auto p-8">
            <div className="bg-[#161b22] rounded-2xl p-6 border border-gray-800 shadow-sm">
              <p className="text-[10px] font-black text-[#6366f1] mb-2 uppercase tracking-[0.2em]">Syllabus Logic</p>
              <p className="text-[11px] text-gray-400 leading-relaxed font-medium">Map global entities to create custom exam trees.</p>
            </div>
          </div>
        </aside>

        {/* Main Canvas */}
        <main className="flex-1 bg-[#0a0c10] overflow-y-auto relative text-white">
          {/* Subtle Top Indicator */}
          <div className="h-1 w-full bg-indigo-500/20"></div>
          
          <div className="relative z-10 w-full p-12">
            {children}
          </div>
          
          <div className="absolute inset-0 pattern-grid-xl text-indigo-500 opacity-[0.05] pointer-events-none"></div>
        </main>

      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .pattern-grid-xl {
          background-size: 100px 100px;
          background-image: linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px);
        }
      `}} />
    </div>
  );
}
