"use client";

import React, { useEffect, useState } from "react";
import { ProgressChart } from "@/components/charts/ProgressChart";
import { getProgressOverview } from "@/lib/api";
import { UserProgressOverview } from "@/types";
import { TrendingUp, Clock, Target, Calendar, Trophy, ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

import { useSearchParams, useRouter } from "next/navigation";

export default function ProgressPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedExamId, setSelectedExamId] = useState(searchParams.get("exam") || "Group_II");
  const [progress, setProgress] = useState<UserProgressOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProgress() {
      setLoading(true);
      try {
        const data = await getProgressOverview(selectedExamId);
        setProgress(data);
      } catch (error) {
        console.error("Error fetching progress:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProgress();
  }, [selectedExamId]);

  const handleExamChange = (id: string) => {
    setSelectedExamId(id);
    router.push(`/progress?exam=${id}`, { scroll: false });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const chartData = [
    { subject: "Indian History", progress: 65, color: "#4f46e5" },
    { subject: "Polity & Gov.", progress: 42, color: "#0ea5e9" },
    { subject: "Economy", progress: 38, color: "#10b981" },
    { subject: "Geography", progress: 78, color: "#f59e0b" },
    { subject: "Telangana Mov.", progress: 24, color: "#ec4899" },
    { subject: "Gen. Science", progress: 56, color: "#8b5cf6" },
  ];

  return (
    <div className="space-y-12 pb-20 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight">Analytics & Insights</h1>
          <p className="text-muted-foreground text-lg italic">"What gets measured gets improved."</p>
        </div>
        
        <div className="flex p-1.5 bg-secondary/50 rounded-2xl w-fit h-fit border border-border/50">
          {[
            { id: "Group_II", label: "Group II" },
            { id: "Group_III", label: "Group III" },
            { id: "Group_IV", label: "Group IV" },
          ].map((exam: { id: string, label: string }) => (
            <button
              key={exam.id}
              onClick={() => handleExamChange(exam.id)}
              className={cn(
                "px-6 py-2 rounded-xl text-xs font-black transition-all uppercase tracking-widest",
                selectedExamId === exam.id 
                  ? "bg-card text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {exam.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          icon={<TrendingUp className="h-5 w-5 text-green-500" />}
          label="Overall Mastery"
          value={`${progress?.overallCompletion || 0}%`}
          desc="+4% from last week"
        />
        <MetricCard 
          icon={<Clock className="h-5 w-5 text-blue-500" />}
          label="Time Studied"
          value={`${Math.round((progress?.totalTimeStudied || 0) / 60)} hrs`}
          desc="12.5 hrs this month"
        />
        <MetricCard 
          icon={<Target className="h-5 w-5 text-purple-500" />}
          label="Avg. Accuracy"
          value="74%"
          desc="Based on 420 MCQs"
        />
        <MetricCard 
          icon={<Calendar className="h-5 w-5 text-amber-500" />}
          label="Current Streak"
          value={`${progress?.streakDays || 0} days`}
          desc="Personal best: 14"
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Subject Breakdown Chart */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Syllabus Completion
            </h3>
            <ProgressChart data={chartData} height={400} />
          </div>

          <div className="bg-card border border-border rounded-3xl p-8 shadow-sm overflow-hidden">
            <h3 className="text-xl font-bold mb-6">Mastery Heatmap</h3>
            <div className="grid grid-cols-12 gap-2 opacity-30">
              {/* Mock Heatmap */}
              {Array.from({ length: 36 }).map((_: any, i: number) => (
                <div key={i} className={cn(
                  "aspect-square rounded-sm border border-border/50",
                  i % 3 === 0 ? "bg-primary/20" : i % 5 === 0 ? "bg-primary/40" : i % 7 === 0 ? "bg-primary" : "bg-secondary"
                )} />
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground mt-4 italic font-medium">Activity intensity over the last 30 days</p>
          </div>
        </div>

        {/* Right Sidebar: Topics */}
        <div className="space-y-8">
          <section className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-3xl p-8">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-red-900 dark:text-red-400">
              <Zap className="h-5 w-5 fill-current" />
              Critical Redos
            </h3>
            <div className="space-y-4">
              {(progress?.weakAreas || []).map((area: string, i: number) => (
                <div key={i} className="flex flex-col gap-1 p-3 bg-white dark:bg-black/20 rounded-xl border border-red-100 dark:border-red-900/40">
                  <span className="text-sm font-bold truncate">{area}</span>
                  <div className="h-1 w-full bg-red-100 rounded-full mt-1">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: '30%' }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 rounded-3xl p-8">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-green-900 dark:text-green-400">
              <Trophy className="h-5 w-5 fill-current" />
              Top Strengths
            </h3>
            <div className="space-y-4">
              {(progress?.strongAreas || []).map((area: string, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white dark:bg-black/20 rounded-xl border border-green-100 dark:border-green-900/40">
                  <span className="text-sm font-bold truncate">{area}</span>
                  <ChevronRight className="h-4 w-4 text-green-500" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, desc }: { icon: React.ReactNode, label: string, value: string, desc: string }) {
  return (
    <div className="bg-card border border-border p-6 rounded-3xl shadow-sm hover:border-primary/20 transition-all group">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-secondary group-hover:bg-primary/10 transition-colors">
          {icon}
        </div>
        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">{label}</span>
      </div>
      <div className="text-4xl font-black tracking-tight mb-1">{value}</div>
      <div className="text-xs text-muted-foreground font-medium">{desc}</div>
    </div>
  );
}
