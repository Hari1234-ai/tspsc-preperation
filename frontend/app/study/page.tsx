"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/providers/user-context";
import { getSyllabusTree } from "@/lib/api";
import { Paper, Subject } from "@/types";
import { 
  BookOpen, 
  ArrowRight, 
  History, 
  Landmark, 
  Gavel, 
  Coins, 
  Move, 
  Tent,
  Zap,
  GraduationCap,
  TrendingUp,
  Users,
  Flag,
  LayoutGrid
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const subjectStyles: Record<string, { icon: any, color: string, bg: string }> = {
  "POLITY": { icon: Gavel, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-950/20" },
  "HISTORY": { icon: Landmark, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/20" },
  "INDIAN ECONOMY": { icon: Coins, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/20" },
  "TELANGANA ECONOMY": { icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/20" },
  "SOCIETY": { icon: Users, color: "text-teal-600", bg: "bg-teal-50 dark:bg-teal-950/20" },
  "TELANGANA MOVEMENT": { icon: Flag, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-950/20" },
  "GENERAL STUDIES & GENERAL ABILITIES": { icon: LayoutGrid, color: "text-slate-600", bg: "bg-slate-100 dark:bg-slate-900/40" },
  "SECRETARIAL ABILITIES": { icon: Zap, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950/20" },
  "DEVELOPMENT ISSUES": { icon: TrendingUp, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-950/20" },
};

function SubjectCard({ subject, examId }: { subject: any, examId: string }) {
  const style = subjectStyles[subject.title.toUpperCase()] || { icon: BookOpen, color: "text-primary", bg: "bg-primary/5" };
  const Icon = style.icon;
  
  return (
    <Link href={`/study/${subject.id}`}>
      <motion.div 
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "bg-card border-2 border-border/50 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden h-full flex flex-col justify-between",
          "hover:border-current"
        )}
        style={{ color: style.color.includes('indigo') ? undefined : style.color.split('-')[1] }}
      >
        <div className="space-y-6">
          <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center transition-colors", style.bg, style.color)}>
            <Icon className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black tracking-tight leading-none uppercase">{subject.title}</h3>
            <p className="text-sm text-muted-foreground font-medium leading-tight line-clamp-2">
              {subject.description || `Explore modules and detailed academic content for ${subject.title}.`}
            </p>
          </div>
        </div>
        
        <div className="mt-8 flex items-center justify-between">
          <span className={cn("text-[10px] font-black uppercase tracking-widest opacity-60", style.color)}>Explore Content</span>
          <div className="p-3 rounded-xl bg-secondary text-muted-foreground transition-all group-hover:bg-primary group-hover:text-white">
            <ArrowRight className="h-5 w-5" />
          </div>
        </div>

        {/* Decoration */}
        <div className={cn("absolute -right-8 -bottom-8 h-32 w-32 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity", style.bg)} />
      </motion.div>
    </Link>
  );
}

export default function StudyLandingPage() {
  const { profile } = useUser();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const selectedExamId = profile?.exam || "Group_II";

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const syllabusData = await getSyllabusTree(selectedExamId);
        // Extract unique subjects across all papers
        const allSubjects: any[] = [];
        const seenIds = new Set();
        
        syllabusData.forEach((paper: any) => {
          paper.subjects?.forEach((sub: any) => {
            if (!seenIds.has(sub.id)) {
              allSubjects.push(sub);
              seenIds.add(sub.id);
            }
          });
        });
        
        setSubjects(allSubjects);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedExamId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-12 max-w-7xl mx-auto py-4">
      <header className="space-y-4">
        <div className="flex items-center gap-3 text-primary">
           <GraduationCap className="h-8 w-8" />
           <span className="text-xs font-black uppercase tracking-[0.3em] opacity-80">Syncing with CMS</span>
        </div>
        <h1 className="text-5xl font-black tracking-tight">Academic Subjects</h1>
        <p className="text-xl text-muted-foreground max-w-2xl font-medium">
          Select a subject to begin your drill-down into focused study topics for {selectedExamId.replace("_", " ")}.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {subjects.map((subject, i) => (
          <motion.div
            key={subject.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <SubjectCard 
                subject={subject} 
                examId={selectedExamId}
            />
          </motion.div>
        ))}
      </div>

      {subjects.length === 0 && (
        <div className="p-20 border-2 border-dashed border-border rounded-[3rem] text-center space-y-4">
           <BookOpen className="h-16 w-16 text-muted-foreground mx-auto opacity-20" />
           <p className="text-muted-foreground font-medium italic">No subjects have been linked to this exam yet.</p>
        </div>
      )}
    </div>
  );
}
