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
  GraduationCap
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const subjectIcons: Record<string, any> = {
  "General Studies": Landmark,
  "History": History,
  "Polity": Gavel,
  "Economy": Coins,
  "Geography": Tent,
  "Telangana Movement": Move,
  "Secretarial Abilities": Zap,
};

function SubjectCard({ subject, examId, color }: { subject: any, examId: string, color: string }) {
  const Icon = subjectIcons[subject.title] || BookOpen;
  
  return (
    <Link href={`/study?exam=${examId}&subject=${subject.id}`}>
      <motion.div 
        whileHover={{ y: -5, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "p-8 rounded-[2rem] border-2 bg-card transition-all cursor-pointer h-full flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-primary/50",
        )}
      >
        <div className="space-y-6">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <Icon className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black tracking-tight leading-none">{subject.title}</h3>
            <p className="text-sm text-muted-foreground font-medium leading-tight">
              {subject.description || `Explore modules and detailed academic content for ${subject.title}.`}
            </p>
          </div>
        </div>
        
        <div className="mt-8 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">Explore Content</span>
          <div className="p-3 rounded-xl bg-secondary text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all">
            <ArrowRight className="h-5 w-5" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default function SubjectsPage() {
  const { profile } = useUser();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const selectedExamId = profile?.exam || "Group_II";

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const syllabus = await getSyllabusTree(selectedExamId);
        // Extract unique subjects across all papers
        const allSubjects: any[] = [];
        const seenIds = new Set();
        
        syllabus.forEach(paper => {
          paper.subjects?.forEach(sub => {
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
           <span className="text-xs font-black uppercase tracking-[0.3em] opacity-80">Academic Curriculum</span>
        </div>
        <h1 className="text-5xl font-black tracking-tight">Academic Subjects</h1>
        <p className="text-xl text-muted-foreground max-w-2xl font-medium">
          Select a core subject to explore topics and elaborate study material tailored for {selectedExamId.replace("_", " ")}.
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
                color="indigo"
            />
          </motion.div>
        ))}
      </div>

      {subjects.length === 0 && (
        <div className="p-20 border-2 border-dashed border-border rounded-[3rem] text-center space-y-4">
           <BookOpen className="h-16 w-16 text-muted-foreground mx-auto opacity-20" />
           <p className="text-muted-foreground font-medium italic italic">No subjects have been linked to this exam yet.</p>
        </div>
      )}
    </div>
  );
}
