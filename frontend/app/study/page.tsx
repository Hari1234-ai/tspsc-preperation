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

const subjectThemes: Record<string, { icon: any, color: string, bg: string, border: string }> = {
  "POLITY": { icon: Gavel, color: "#6366f1", bg: "rgba(99, 102, 241, 0.1)", border: "rgba(99, 102, 241, 0.3)" },
  "HISTORY": { icon: Landmark, color: "#d97706", bg: "rgba(217, 119, 6, 0.1)", border: "rgba(217, 119, 6, 0.3)" },
  "INDIAN ECONOMY": { icon: Coins, color: "#10b981", bg: "rgba(16, 185, 129, 0.1)", border: "rgba(16, 185, 129, 0.3)" },
  "TELANGANA ECONOMY": { icon: TrendingUp, color: "#2563eb", bg: "rgba(37, 99, 235, 0.1)", border: "rgba(37, 99, 235, 0.3)" },
  "SOCIETY": { icon: Users, color: "#14b8a6", bg: "rgba(20, 184, 166, 0.1)", border: "rgba(20, 184, 166, 0.3)" },
  "TELANGANA MOVEMENT": { icon: Flag, color: "#f97316", bg: "rgba(249, 115, 22, 0.1)", border: "rgba(249, 115, 22, 0.3)" },
  "GENERAL STUDIES & GENERAL ABILITIES": { icon: LayoutGrid, color: "#475569", bg: "rgba(71, 85, 105, 0.1)", border: "rgba(71, 85, 105, 0.3)" },
  "SECRETARIAL ABILITIES": { icon: Zap, color: "#9333ea", bg: "rgba(147, 51, 234, 0.1)", border: "rgba(147, 51, 234, 0.3)" },
  "DEVELOPMENT ISSUES": { icon: TrendingUp, color: "#e11d48", bg: "rgba(225, 29, 72, 0.1)", border: "rgba(225, 29, 72, 0.3)" },
};

function SubjectCard({ subject, examId }: { subject: any, examId: string }) {
  const theme = subjectThemes[subject.title.toUpperCase()] || { icon: BookOpen, color: "#4f46e5", bg: "rgba(79, 70, 229, 0.1)", border: "rgba(79, 70, 229, 0.2)" };
  const Icon = theme.icon;
  
  return (
    <Link href={`/study/${subject.id}`}>
      <motion.div 
        whileHover={{ y: -8, scale: 1.02, borderColor: theme.color }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "bg-card border-2 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden h-full flex flex-col justify-between"
        )}
        style={{ borderColor: "transparent" }}
      >
        <div className="space-y-6">
          <div 
            className="h-14 w-14 rounded-2xl flex items-center justify-center transition-colors"
            style={{ backgroundColor: theme.bg, color: theme.color }}
          >
            <Icon className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black tracking-tight leading-none uppercase" style={{ color: theme.color }}>{subject.title}</h3>
            <p className="text-sm text-muted-foreground font-medium leading-tight line-clamp-2">
              {subject.description || `Explore modules and detailed academic content for ${subject.title}.`}
            </p>
          </div>
        </div>
        
        <div className="mt-8 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-60" style={{ color: theme.color }}>Explore Content</span>
          <div className="p-3 rounded-xl bg-secondary text-muted-foreground transition-all group-hover:bg-primary group-hover:text-white">
            <ArrowRight className="h-5 w-5" />
          </div>
        </div>

        {/* Decoration */}
        <div 
          className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" 
          style={{ backgroundColor: theme.bg }}
        />
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
           <BookOpen className="h-6 w-6" />
           <span className="text-xs font-black uppercase tracking-[0.3em] opacity-80">Subject Catalog</span>
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
