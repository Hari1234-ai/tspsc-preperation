"use client";

import React, { Suspense, useEffect, useState } from "react";
import { TopicNavigator } from "@/components/navigation/TopicNavigator";
import { getSyllabusTree, updateProgress, getSubtopicDetails, getTopicDetails } from "@/lib/api";
import { Paper, Subtopic, Concept, Topic } from "@/types";
import { 
  CheckCircle2, BookOpen, Clock, ChevronRight, Play, 
  Maximize2, Minimize2, Languages, Move, 
  Tent,
  GraduationCap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { useSearchParams, useRouter } from "next/navigation";

function StudyPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedExamId, setSelectedExamId] = useState<string>(searchParams.get("exam") || "Group_II");
  const [syllabus, setSyllabus] = useState<Paper[]>([]);
  const [selectedItem, setSelectedItem] = useState<{ id: string, title: string, concepts: Concept[] } | null>(null);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [contentLoading, setContentLoading] = useState<boolean>(false);
  const [globalLanguage, setGlobalLanguage] = useState<"english" | "telugu">("english");

  useEffect(() => {
    async function fetchSyllabus() {
      setLoading(true);
      try {
        const data = await getSyllabusTree(selectedExamId);
        setSyllabus(data);
        // Default to first subtopic if available
        const subjectId = searchParams.get("subject");
        
        // Find specific subject if specified, else generic default logic
        if (subjectId) {
          let found = false;
          for (const paper of data) {
            const subject = paper.subjects.find(s => s.id === subjectId);
            if (subject && subject.topics.length > 0) {
              const firstTopic = subject.topics[0];
              if (firstTopic.subtopics && firstTopic.subtopics.length > 0) {
                handleSelectItem(firstTopic.subtopics[0], "subtopic");
              } else {
                handleSelectItem(firstTopic, "topic");
              }
              found = true;
              break;
            }
          }
          if (!found && data.length > 0) {
            handleDefaultSelection(data);
          }
        } else if (data.length > 0) {
          handleDefaultSelection(data);
        }
      } catch (error) {
        console.error("Error fetching syllabus:", error);
      } finally {
        setLoading(false);
      }
    }

    const handleDefaultSelection = (data: Paper[]) => {
      if (data[0].subjects.length > 0 && data[0].subjects[0].topics.length > 0) {
        const firstTopic = data[0].subjects[0].topics[0];
        if (firstTopic.subtopics && firstTopic.subtopics.length > 0) {
          handleSelectItem(firstTopic.subtopics[0], "subtopic");
        } else {
          handleSelectItem(firstTopic, "topic");
        }
      } else {
        setSelectedItem(null);
      }
    };

    fetchSyllabus();
  }, [selectedExamId]);

  const handleSelectItem = async (item: any, type: "topic" | "subtopic") => {
    setSelectedItem({ ...item, concepts: item.concepts || [] });
    setContentLoading(true);
    try {
      if (type === "subtopic") {
        const details = await getSubtopicDetails(item.id);
        setSelectedItem(details as any);
      } else {
        const details = await getTopicDetails(item.id);
        setSelectedItem(details as any);
      }
    } catch (error) {
      console.error("Error fetching elaborate content:", error);
    } finally {
      setContentLoading(false);
    }
  };

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
                selectedItemId={selectedItem?.id}
                onSelectItem={handleSelectItem}
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
        {selectedItem ? (
          <>
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase font-bold tracking-widest">
                  <span>Study Material</span>
                  <ChevronRight className="h-4 w-4" />
                  <span>Bilingual Deep Dive</span>
                </div>
                <h1 className="text-4xl font-black tracking-tight">{selectedItem.title}</h1>
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
              {contentLoading ? (
                <div className="space-y-8 animate-pulse">
                  <div className="h-8 w-1/3 bg-muted rounded-xl" />
                  <div className="space-y-4">
                    <div className="h-4 w-full bg-muted rounded" />
                    <div className="h-4 w-full bg-muted rounded" />
                    <div className="h-4 w-3/4 bg-muted rounded" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 bg-muted rounded-2xl" />
                    <div className="h-24 bg-muted rounded-2xl" />
                  </div>
                </div>
              ) : (
                selectedItem.concepts && selectedItem.concepts.length > 0 ? (
                  selectedItem.concepts.map((concept: Concept, index: number) => (
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
                  ))
                ) : (
                  <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border text-muted-foreground italic">
                    No detailed academic explanation uploaded for this section yet. 
                    <br/>You can add content via the CMS dashboard.
                  </div>
                )
              )}
              
              <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <h3 className="text-xl font-bold">Ready to test your knowledge?</h3>
                  <p className="text-muted-foreground">
                    Take a quick 5-minute quiz on {selectedItem.title} to solidify your learning.
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
            Select a topic or subtopic from the syllabus to start studying.
          </div>
        )}
      </main>
    </div>
  );
}

function ConceptSection({ concept, language, onComplete }: { concept: Concept, language: "english" | "telugu", onComplete: () => void }) {

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
        </div>

        <div className="space-y-6">
          {concept.modules?.filter((m: any) => !m.lang || m.lang === (language === "english" ? "en" : "te")).map((mod: any, i: number) => {
            switch (mod.type) {
              case "text":
                return (
                  <div key={i} className={cn(
                    "prose prose-slate dark:prose-invert max-w-none text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap",
                    language === "telugu" && "font-telugu leading-loose"
                  )}>
                    {mod.content}
                  </div>
                );
              case "image":
                return (
                  <div key={i} className="my-4 rounded-xl overflow-hidden shadow-sm border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={mod.url} alt="Concept graphic" className="w-full h-auto object-cover" />
                  </div>
                );
              case "video":
                return (
                  <div key={i} className="my-4 rounded-xl overflow-hidden shadow-sm border border-border bg-black aspect-video">
                    <video src={mod.url} controls className="w-full h-full" preload="metadata" />
                  </div>
                );
              case "audio":
                return (
                  <div key={i} className="my-4 bg-secondary/30 p-4 rounded-xl border border-border">
                    <audio src={mod.url} controls className="w-full" preload="metadata" />
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>
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
