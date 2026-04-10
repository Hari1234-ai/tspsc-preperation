"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/providers/user-context";
import { getSyllabusTree } from "@/lib/api";
import { 
  ArrowLeft, 
  ArrowRight, 
  Layers,
  GraduationCap
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

export default function TopicsGridPage() {
  const { profile } = useUser();
  const params = useParams();
  const subjectId = params.subjectId as string;
  const [subject, setSubject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const selectedExamId = profile?.exam || "Group_II";

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const syllabus = await getSyllabusTree(selectedExamId);
        // Find the subject and its topics
        let foundSubject = null;
        for (const paper of syllabus) {
          const sub = paper.subjects.find(s => s.id === subjectId);
          if (sub) {
            foundSubject = sub;
            break;
          }
        }
        setSubject(foundSubject);
      } catch (error) {
        console.error("Error fetching topics:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedExamId, subjectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold">Subject not found</h2>
        <Link href="/study" className="text-primary hover:underline">Return to subjects</Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-12 max-w-7xl mx-auto py-4">
      <header className="space-y-6">
        <Link 
          href="/study" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold text-sm uppercase tracking-wider"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Subjects
        </Link>
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
                <Layers className="h-6 w-6" />
                <span className="text-xs font-black uppercase tracking-[0.2em]">{subject.title}</span>
            </div>
            <h1 className="text-5xl font-black tracking-tight">Select a Topic</h1>
            <p className="text-xl text-muted-foreground max-w-2xl font-medium">
              Dive deeper into {subject.title} by selecting one of the core academic topics below.
            </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subject.topics?.map((topic: any, i: number) => (
          <Link key={topic.id} href={`/study/${subjectId}/${topic.id}`}>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="group p-8 rounded-[2.5rem] bg-card border border-border/50 hover:border-primary/40 transition-all shadow-sm flex flex-col justify-between h-full"
            >
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                   <span className="font-black text-lg">{i + 1}</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight">{topic.title}</h3>
              </div>
              
              <div className="mt-8 flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">{topic.subtopics?.length || 0} Sub-topics</span>
                <div className="p-2 rounded-lg bg-secondary text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
