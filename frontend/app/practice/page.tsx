"use client";

import React, { useState, useEffect } from "react";
import { Trophy, HelpCircle, Layers, Settings2, Sparkles, ChevronRight, CheckCircle2, XCircle, RefreshCcw, Play, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { getRandomQuestions } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Question } from "@/types";

export default function PracticeHub() {
  const [activeTab, setActiveTab] = useState<"quizzes" | "flashcards" | "revision">("quizzes");
  const [sessionActive, setSessionActive] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const startQuiz = async () => {
    setLoading(true);
    try {
      const data = await getRandomQuestions(5);
      setQuestions(data);
      setSessionActive(true);
      setCurrentIndex(0);
      setScore(0);
      setShowResult(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;
    
    setSelectedAnswer(answer);
    const correct = answer === questions[currentIndex].correct_answer;
    setIsCorrect(correct);
    if (correct) setScore((s: number) => s + 1);

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((i: number) => i + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setShowResult(true);
      }
    }, 2000);
  };

  if (sessionActive && questions.length > 0) {
    if (showResult) {
      return (
        <div className="flex flex-col items-center justify-center py-20 px-6 max-w-2xl mx-auto text-center space-y-8 bg-card border border-border rounded-[3rem] shadow-2xl">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Trophy className="h-12 w-12" />
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-black tracking-tight">Session Complete!</h2>
            <p className="text-xl text-muted-foreground font-medium underline underline-offset-8 decoration-primary/30">You mastered {score} out of {questions.length} concepts.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full px-12">
            <button 
              onClick={startQuiz}
              className="flex-1 bg-primary text-white py-4 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl shadow-primary/20"
            >
              TRY AGAIN
            </button>
            <button 
              onClick={() => setSessionActive(false)}
              className="flex-1 bg-secondary text-foreground py-4 rounded-2xl font-black text-lg hover:bg-secondary/80 transition-all border border-border"
            >
              EXIT TO HUB
            </button>
          </div>
        </div>
      );
    }

    const q = questions[currentIndex];
    return (
      <div className="max-w-3xl mx-auto space-y-10 py-12">
        <div className="flex items-center justify-between px-2">
          <div className="space-y-1">
            <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">Question {currentIndex + 1} of {questions.length}</div>
            <div className="h-1.5 w-64 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500" 
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
          <div className="text-sm font-black text-primary bg-primary/10 px-4 py-2 rounded-full">Score: {score}</div>
        </div>

        <motion.div 
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card border border-border p-10 rounded-[3rem] shadow-sm space-y-8"
        >
          <div className="space-y-4">
            <div className="capitalize text-[10px] font-black tracking-[0.2em] text-primary/60 px-3 py-1 bg-primary/5 rounded-full w-fit border border-primary/10">{q.type.replace("_", " ")}</div>
            <h3 className="text-2xl font-bold leading-tight">{q.question_text}</h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {q.type === "mcq" && (q.options as string[]).map((opt) => (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                disabled={!!selectedAnswer}
                className={cn(
                  "text-left p-5 rounded-2xl border-2 transition-all font-bold text-sm flex items-center justify-between group",
                  selectedAnswer === opt 
                    ? (isCorrect ? "bg-green-50 border-green-500 text-green-700" : "bg-red-50 border-red-500 text-red-700")
                    : "bg-background border-border hover:border-primary/50 hover:bg-primary/5"
                )}
              >
                {opt}
                {selectedAnswer === opt && (
                  isCorrect ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />
                )}
              </button>
            ))}

            {q.type === "true_false" && ["True", "False"].map((opt) => (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                disabled={!!selectedAnswer}
                className={cn(
                  "text-center p-6 rounded-2xl border-2 transition-all font-black text-lg",
                  selectedAnswer === opt 
                    ? (isCorrect ? "bg-green-50 border-green-500 text-green-700" : "bg-red-50 border-red-500 text-red-700")
                    : "bg-background border-border hover:border-primary"
                )}
              >
                {opt}
              </button>
            ))}

            {q.type === "matching" && (
              <div className="p-8 bg-secondary/30 rounded-3xl border border-dashed border-border text-center space-y-4">
                <p className="text-sm font-medium text-muted-foreground italic">Matching questions are best played in Mock Exam mode. For now, select the primary match defined in the key.</p>
                <div className="grid grid-cols-2 gap-4">
                  {(q.options as any).Left.map((l: string, i: number) => (
                    <div key={i} className="p-3 bg-card border border-border rounded-xl text-xs font-bold">{l} ↔ {(q.options as any).Right[i]}</div>
                  ))}
                </div>
                <button 
                  onClick={() => handleAnswer(q.correct_answer)}
                  className="mt-4 px-6 py-2 bg-primary text-white rounded-xl text-xs font-bold"
                >
                  I've studied these pairs
                </button>
              </div>
            )}
          </div>

          <AnimatePresence>
            {selectedAnswer && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "p-6 rounded-2xl border flex gap-4",
                  isCorrect ? "bg-green-50 border-green-100 text-green-800" : "bg-amber-50 border-amber-100 text-amber-800"
                )}
              >
                <Sparkles className="h-5 w-5 shrink-0" />
                <div className="space-y-1">
                  <div className="font-black text-xs uppercase tracking-widest">{isCorrect ? "Brilliant!" : "Keep Learning"}</div>
                  <p className="text-sm font-medium leading-relaxed">{q.explanation}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Practice Hub</h1>
        <p className="text-muted-foreground text-lg">Retain more information through active recall and spaced repetition.</p>
      </header>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-secondary/50 rounded-2xl w-fit">
        <TabButton 
          active={activeTab === "quizzes"} 
          onClick={() => setActiveTab("quizzes")}
          icon={<HelpCircle className="h-4 w-4" />}
          label="Quizzes"
        />
        <TabButton 
          active={activeTab === "flashcards"} 
          onClick={() => setActiveTab("flashcards")}
          icon={<Layers className="h-4 w-4" />}
          label="Flashcards"
        />
        <TabButton 
          active={activeTab === "revision"} 
          onClick={() => setActiveTab("revision")}
          icon={<Sparkles className="h-4 w-4" />}
          label="Smart Revision"
        />
      </div>

      {activeTab === "quizzes" && (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           <div 
            onClick={startQuiz}
            className="group cursor-pointer bg-primary text-white p-10 rounded-[3rem] shadow-xl shadow-primary/20 hover:scale-105 transition-all flex flex-col justify-between h-[320px] relative overflow-hidden"
          >
            <div className="space-y-4 relative z-10">
              <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                <Play className="h-8 w-8 fill-current" />
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl font-black leading-tight">Quick Fire Session</h3>
                <p className="text-primary-foreground/80 font-medium tracking-tight">Random 5-question blast across all yours subjects.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 font-black text-sm relative z-10">
              START NOW <ChevronRight className="h-4 w-4" />
            </div>
            <Zap className="absolute -right-8 -bottom-8 h-48 w-48 text-white/10 rotate-12" />
          </div>

          <div className="col-span-1 md:col-span-2 bg-card border-2 border-dashed border-border rounded-[3rem] p-10 flex flex-col items-center justify-center text-center space-y-6">
            <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center text-primary">
              <Trophy className="h-10 w-10 opacity-40" />
            </div>
            <div className="max-w-md">
              <h3 className="text-2xl font-black tracking-tight">Topic-Specific Challenges</h3>
              <p className="text-muted-foreground mt-2 font-medium">
                Finish a study module to unlock targeted quizzes for those specific topics.
              </p>
            </div>
            <button className="px-10 py-3 bg-secondary text-foreground rounded-2xl font-bold hover:bg-secondary/80 transition-all">
              Browse Topics
            </button>
          </div>
        </section>
      )}

      {loading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <RefreshCcw className="h-10 w-10 text-primary animate-spin" />
            <span className="font-black tracking-widest text-xs uppercase text-primary">Preparing Exam Paper...</span>
          </div>
        </div>
      )}

      {(activeTab === "flashcards" || activeTab === "revision") && (
        <div className="py-20 text-center space-y-4 bg-secondary/20 rounded-[3rem] border border-dashed border-border">
          <Settings2 className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
          <p className="text-muted-foreground font-medium italic">Advanced AI Spaced Repetition modules are being optimized for the new syllabus.</p>
        </div>
      )}
    </div>
  );
}

function TabButton({ active, label, icon, onClick }: { active: boolean, label: string, icon: React.ReactNode, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-black transition-all",
        active ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
