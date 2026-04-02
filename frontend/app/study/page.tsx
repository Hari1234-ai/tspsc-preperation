"use client";

import React, { Suspense, useEffect, useState } from "react";
import { TopicNavigator } from "@/components/navigation/TopicNavigator";
import { getSyllabusTree, updateProgress, getAIExplanation } from "@/lib/api";
import { Paper, Subtopic, Concept, AIInsight } from "@/types";
import { 
  CheckCircle2, BookOpen, Clock, ChevronRight, Play, 
  Maximize2, Minimize2, Sparkles, Languages, Lightbulb 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { useSearchParams, useRouter } from "next/navigation";

function StudyPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedExamId, setSelectedExamId] = useState<string>(searchParams.get("exam") || "Group_II");
  const [syllabus, setSyllabus] = useState<Paper[]>([]);
  const [selectedSubtopic, setSelectedSubtopic] = useState<Subtopic | null>(null);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [globalLanguage, setGlobalLanguage] = useState<"english" | "telugu">("english");

  useEffect(() => {
    async function fetchSyllabus() {
      setLoading(true);
      try {
        const data = await getSyllabusTree(selectedExamId);
        setSyllabus(data);
        // Default to first subtopic if available
        if (data.length > 0 && data[0].subjects.length > 0 && data[0].subjects[0].topics.length > 0) {
          setSelectedSubtopic(data[0].subjects[0].topics[0].subtopics[0]);
        } else {
          setSelectedSubtopic(null);
        }
      } catch (error) {
        console.error("Error fetching syllabus:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSyllabus();
  }, [selectedExamId]);

  const handleExamChange = (id: string) => {
    setSelectedExamId(id);
    router.push(`/study?exam=${id}`, { scroll: false });
  };

  const handleCompleteConcept = async (conceptId: string) => {
    try {
      await updateProgress(conceptId, "concept", true);
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex flex-col md:flex-row gap-8 min-h-screen pb-12 transition-all duration-500",
      isFocusMode ? "md:gap-0" : "md:gap-8"
    )}>
      {/* Syllabus Sidebar */}
      <AnimatePresence mode="wait">
        {!isFocusMode && (
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full md:w-80 shrink-0"
          >
            <div className="sticky top-20 bg-card border border-border rounded-2xl p-4 shadow-sm max-h-[calc(100vh-6rem)] overflow-y-auto">
              <h2 className="text-lg font-bold mb-4 px-2">Syllabus</h2>
              <TopicNavigator 
                papers={syllabus}
                selectedSubtopicId={selectedSubtopic?.id}
                onSelectSubtopic={(st) => setSelectedSubtopic(st)}
                selectedExamId={selectedExamId}
                onSelectExam={handleExamChange}
              />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Content Area */}
      <main className={cn(
        "flex-1 space-y-8 transition-all duration-500 mx-auto",
        isFocusMode ? "max-w-3xl" : "w-full"
      )}>
        {selectedSubtopic ? (
          <>
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase font-bold tracking-widest">
                  <span>Study Material</span>
                  <ChevronRight className="h-4 w-4" />
                  <span>Bilingual Deep Dive</span>
                </div>
                <h1 className="text-4xl font-black tracking-tight">{selectedSubtopic.title}</h1>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-card border border-border rounded-xl p-1 shadow-sm">
                  <button 
                    onClick={() => setGlobalLanguage("english")}
                    className={cn(
                      "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                      globalLanguage === "english" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-secondary"
                    )}
                  >
                    English
                  </button>
                  <button 
                    onClick={() => setGlobalLanguage("telugu")}
                    className={cn(
                      "px-4 py-2 rounded-lg text-xs font-bold transition-all font-telugu",
                      globalLanguage === "telugu" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-secondary"
                    )}
                  >
                    తెలుగు
                  </button>
                </div>

                <button 
                  onClick={() => setIsFocusMode(!isFocusMode)}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-primary/10 hover:text-primary rounded-xl text-sm font-bold transition-all border border-border"
                >
                  {isFocusMode ? (
                    <>
                      <Minimize2 className="h-4 w-4" /> Exit
                    </>
                  ) : (
                    <>
                      <Maximize2 className="h-4 w-4" /> Focus
                    </>
                  )}
                </button>
              </div>
            </header>

            <motion.section 
              layout
              className="space-y-12"
            >
              {selectedSubtopic.concepts.map((concept: Concept, index: number) => (
                <motion.div
                  key={concept.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ConceptSection 
                    concept={concept} 
                    language={globalLanguage}
                    onComplete={() => handleCompleteConcept(concept.id)}
                  />
                </motion.div>
              ))}
              
              <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <h3 className="text-xl font-bold">Ready to test your knowledge?</h3>
                  <p className="text-muted-foreground">
                    Take a quick 5-minute quiz on {selectedSubtopic.title} to solidify your learning.
                  </p>
                </div>
                <button className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all scale-105 active:scale-100 shadow-lg shadow-primary/20">
                  <Play className="h-5 w-5 fill-current" />
                  Start Mini Quiz
                </button>
              </div>
            </motion.section>
          </>
        ) : (
          <div className="flex items-center justify-center h-64 text-muted-foreground italic">
            Select a subtopic from the syllabus to start studying.
          </div>
        )}
      </main>
    </div>
  );
}

function ConceptSection({ concept, language, onComplete }: { concept: Concept, language: "english" | "telugu", onComplete: () => void }) {
  const [aiData, setAiData] = useState<{ english: any, telugu: any } | null>(null);
  const [showAI, setShowAI] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const handleFetchAI = async () => {
    if (aiData) {
      setShowAI(!showAI);
      return;
    }
    setAiLoading(true);
    setShowAI(true);
    try {
      const data = await getAIExplanation(concept.id);
      setAiData(data);
    } catch (error) {
      console.error("Error fetching AI insight:", error);
    } finally {
      setAiLoading(false);
    }
  };

  const currentContent = language === "telugu" ? (concept.content_telugu || concept.content) : concept.content;
  const currentKeyPoints = language === "telugu" ? (concept.key_points_telugu || concept.key_points) : concept.key_points;
  const currentExamples = language === "telugu" ? (concept.examples_telugu || concept.examples) : concept.examples;

  return (
    <div className="relative pl-8 border-l-2 border-border mb-12 last:mb-0">
      <div 
        className={cn(
          "absolute -left-[11px] top-0 h-5 w-5 rounded-full bg-background border-2 flex items-center justify-center cursor-pointer transition-colors",
          concept.completed ? "border-primary bg-primary text-white" : "border-muted-foreground"
        )}
        onClick={onComplete}
      >
        {concept.completed && <CheckCircle2 className="h-3 w-3" />}
      </div>
      
      <div className="space-y-6 bg-card border border-border rounded-3xl p-8 shadow-sm hover:border-primary/30 transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className={cn(
            "text-2xl font-bold flex items-center gap-3",
            language === "telugu" && "font-telugu"
          )}>
            {concept.title}
            {concept.completed && <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Completed</span>}
          </h2>
          
          <button 
            onClick={handleFetchAI}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border",
              showAI ? "bg-primary text-primary-foreground border-primary" : "bg-primary/5 text-primary border-primary/20 hover:bg-primary/10"
            )}
          >
            <Sparkles className={cn("h-4 w-4", aiLoading && "animate-pulse")} />
            {aiLoading ? "Thinking..." : showAI ? "Hide AI Insight" : "✨ AI Insight"}
          </button>
        </div>

        <AnimatePresence>
          {showAI && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-transparent border border-primary/20 rounded-2xl p-6 space-y-4 my-2 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                    <Lightbulb className="h-4 w-4" />
                    AI Intelligence Agent
                  </div>
                </div>

                {aiLoading ? (
                  <div className="space-y-3 py-4">
                    <div className="h-4 w-full bg-primary/10 animate-pulse rounded" />
                    <div className="h-4 w-3/4 bg-primary/10 animate-pulse rounded" />
                  </div>
                ) : aiData ? (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <p className={cn(
                      "text-sm md:text-base leading-relaxed text-foreground/90 font-medium",
                      language === "telugu" && "font-telugu leading-loose"
                    )}>
                      {aiData[language].simplified}
                    </p>
                    <div className="bg-primary/10 rounded-xl p-4 border border-primary/10">
                      <div className="text-[10px] font-black uppercase tracking-tighter text-primary/60 mb-1">Mnemonic Device</div>
                      <p className={cn("text-sm font-bold text-primary italic", language === "telugu" && "font-telugu")}>
                        {aiData[language].mnemonic}
                      </p>
                    </div>
                  </motion.div>
                ) : null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="prose prose-slate dark:prose-invert max-w-none pt-2">
          <p className={cn(
            "text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap",
            language === "telugu" && "font-telugu leading-loose"
          )}>
            {currentContent}
          </p>
        </div>
        
        {currentKeyPoints && currentKeyPoints.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground border-b border-border pb-2 w-fit">Key Aspects</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentKeyPoints.map((point: string, i: number) => (
                <li key={i} className="flex items-start gap-4 p-4 bg-secondary/30 rounded-2xl text-sm font-semibold border border-border group hover:bg-primary/5 hover:border-primary/20 transition-all">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
                  <span className={cn(language === "telugu" && "font-telugu")}>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {currentExamples && currentExamples.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground border-b border-border pb-2 w-fit">Quick Examples</h4>
            <div className="grid grid-cols-1 gap-4">
              {currentExamples.map((ex: string, i: number) => (
                <div key={i} className="p-6 border border-dashed border-primary/20 bg-primary/5 rounded-2xl text-base italic font-serif relative">
                  <span className="absolute top-2 left-3 text-4xl text-primary/20 font-serif leading-none">“</span>
                  <span className={cn(language === "telugu" && "font-telugu")}>{ex}</span>
                  <span className="absolute bottom-2 right-3 text-4xl text-primary/20 font-serif leading-none">”</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StudyPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" /></div>}>
      <StudyPageInner />
    </Suspense>
  );
}
