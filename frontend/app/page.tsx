"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, Trophy, Zap, AlertCircle } from "lucide-react";
import { DailyPlanCard } from "@/components/cards/DailyPlanCard";
import { ProgressChart } from "@/components/charts/ProgressChart";
import { StudyCard } from "@/components/cards/StudyCard";
import { getTodayPlan, getProgressOverview, getSyllabusTree } from "@/lib/api";
import { DailyPlan, UserProgressOverview, Paper } from "@/types";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function ExamCard({ id, title, description, papers, color, icon }: { 
  id: string, title: string, description: string, papers: number, color: string, icon: React.ReactNode 
}) {
  const colorMap: Record<string, string> = {
    indigo: "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/20 dark:border-indigo-900/50 dark:text-indigo-400",
    purple: "bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-950/20 dark:border-purple-900/50 dark:text-purple-400",
    amber: "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/20 dark:border-amber-900/50 dark:text-amber-400",
  };

  const accentMap: Record<string, string> = {
    indigo: "bg-indigo-600",
    purple: "bg-purple-600",
    amber: "bg-amber-600",
  };

  return (
    <Link href={`/study?exam=${id}`}>
      <motion.div 
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "relative group overflow-hidden p-8 rounded-[2rem] border-2 transition-all cursor-pointer h-full flex flex-col justify-between shadow-sm hover:shadow-xl",
          colorMap[color]
        )}
      >
        <div className="space-y-4">
          <div className={cn(
            "h-14 w-14 rounded-2xl flex items-center justify-center shadow-inner",
            accentMap[color], "text-white"
          )}>
            {icon}
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black tracking-tight leading-none">{title}</h3>
            <p className="text-sm font-medium opacity-80 leading-tight">{description}</p>
          </div>
        </div>
        
        <div className="mt-8 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-black leading-none">{papers}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Papers</span>
          </div>
          <div className={cn(
            "p-3 rounded-xl bg-white/20 dark:bg-black/20 backdrop-blur-sm group-hover:bg-white group-hover:text-black transition-all",
            "border border-white/30 dark:border-white/10"
          )}>
            <ArrowRight className="h-5 w-5" />
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-current opacity-[0.03] group-hover:scale-150 transition-transform duration-700" />
      </motion.div>
    </Link>
  );
}

export default function Dashboard() {
  const [selectedExamId, setSelectedExamId] = useState("Group_II");
  const [todayPlan, setTodayPlan] = useState<DailyPlan | null>(null);
  const [progress, setProgress] = useState<UserProgressOverview | null>(null);
  const [syllabus, setSyllabus] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [planData, progressData, syllabusData] = await Promise.all([
          getTodayPlan(selectedExamId),
          getProgressOverview(selectedExamId),
          getSyllabusTree(selectedExamId)
        ]);
        setTodayPlan(planData);
        setProgress(progressData);
        setSyllabus(syllabusData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
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

  const todayTasks = todayPlan?.tasks.slice(0, 3) || [];
  const continueTopic = syllabus[0]?.subjects[0]?.topics[0];
  
  const chartData = [
    { subject: "History", progress: 45 },
    { subject: "Polity", progress: 30 },
    { subject: "Economy", progress: 20 },
    { subject: "Geography", progress: 65 },
    { subject: "Telangana", progress: 15 },
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground/90">Good morning, Aspirant!</h1>
          <p className="text-muted-foreground mt-1 font-medium">
            You're on a <span className="text-primary font-bold">{progress?.streakDays || 0} day streak</span>. Keep it up!
          </p>
        </div>
        <div className="flex items-center gap-4 bg-primary/5 border border-primary/10 rounded-3xl px-6 py-4 shadow-sm">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Overall Mastery</div>
            <div className="text-2xl font-black text-primary">{progress?.overallCompletion || 0}%</div>
          </div>
        </div>
      </div>

      {/* Exam Selection Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary fill-primary" />
            Mastery Paths
          </h2>
          <div className="flex p-1 bg-secondary/50 rounded-xl border border-border/50">
            {[
              {id: "Group_II", label: "GII"},
              {id: "Group_III", label: "GIII"},
              {id: "Group_IV", label: "GIV"},
            ].map((e: { id: string, label: string }) => (
              <button 
                key={e.id}
                onClick={() => setSelectedExamId(e.id)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                  selectedExamId === e.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ExamCard 
            id="Group_II"
            title="TSPSC Group II"
            description="Executive & Non-Executive Posts"
            papers={4}
            color="indigo"
            icon={<Trophy className="h-6 w-6" />}
          />
          <ExamCard 
            id="Group_III"
            title="TSPSC Group III"
            description="Upper & Lower Division Clerks"
            papers={3}
            color="purple"
            icon={<Zap className="h-6 w-6" />}
          />
          <ExamCard 
            id="Group_IV"
            title="TSPSC Group IV"
            description="Secretariat & Revenue Services"
            papers={2}
            color="amber"
            icon={<ArrowRight className="h-6 w-6" />}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Today's Plan & Continue Learning */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />
                Today's Plan
              </h2>
              <Link href="/daily-plan" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                View full schedule <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {todayTasks.length > 0 ? todayTasks.map((task) => (
                <DailyPlanCard key={task.id} task={task} />
              )) : (
                <div className="p-8 border border-dashed border-border rounded-xl text-center text-muted-foreground">
                  No tasks generated for today.
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Continue Learning</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {continueTopic ? (
                <StudyCard 
                  title={continueTopic.title}
                  description={`Picking up where you left off in ${syllabus[0].subjects[0].title}.`}
                  progress={40}
                />
              ) : (
                <div className="p-8 border border-dashed border-border rounded-xl text-center text-muted-foreground">
                  Start your first module today.
                </div>
              )}
              <div className="hidden md:flex flex-col justify-center p-6 rounded-2xl border-2 border-dashed border-border bg-secondary/30">
                <p className="text-sm text-center text-muted-foreground italic">
                  "Success is the sum of small efforts, repeated day in and day out."
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Analytics & Highlights */}
        <div className="space-y-8">
          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Progress Overview
            </h2>
            <ProgressChart data={chartData} height={200} />
            <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Time studied:</div>
              <div className="text-sm font-bold">{((progress?.totalTimeStudied || 0) / 60).toFixed(1)} hrs</div>
            </div>
          </section>

          <section className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-amber-800 dark:text-amber-400">
              <AlertCircle className="h-5 w-5" />
              Focus Areas
            </h2>
            <div className="space-y-3">
              {(progress?.weakAreas || []).map((area: string, i: number) => (
                <div key={i} className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  {area}
                </div>
              ))}
            </div>
            <button className="mt-6 w-full py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-medium transition-colors">
              Start Revision Quiz
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

