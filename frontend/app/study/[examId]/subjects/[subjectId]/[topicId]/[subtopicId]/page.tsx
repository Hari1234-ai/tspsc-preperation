"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/providers/user-context";
import { getSubtopicDetails, getSubjectDetails } from "@/lib/api";
import { 
  ArrowLeft, 
  CheckCircle2, 
  BookOpen, 
  Languages,
  Maximize2,
  Minimize2,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { subjectThemes, defaultTheme } from "@/lib/constants";
import AudioPlayer from "@/components/study/AudioPlayer";

export default function SubtopicContentViewer() {
  const { profile } = useUser();
  const params = useParams();
  const examId = params.examId as string;
  const subjectId = params.subjectId as string;
  const topicId = params.topicId as string;
  const subtopicId = params.subtopicId as string;
  
  const [subtopic, setSubtopic] = useState<any>(null);
  const [subject, setSubject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<"english" | "telugu">("english");
  const [isFocusMode, setIsFocusMode] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [subtopicData, subjectData] = await Promise.all([
          getSubtopicDetails(subtopicId),
          getSubjectDetails(subjectId)
        ]);
        setSubtopic(subtopicData);
        setSubject(subjectData);
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [subtopicId, subjectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!subtopic) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Content not found</h2>
        <Link href={`/study/${examId}/subjects/${subjectId}/${topicId}`} className="text-primary hover:underline">Return to list</Link>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen pb-20 transition-all duration-500",
      isFocusMode ? "bg-background" : "pt-4"
    )}>
      <div className={cn(
        "max-w-4xl mx-auto space-y-12",
        isFocusMode ? "pt-12" : ""
      )}>
        {/* Breadcrumbs & Navigation */}
        {!isFocusMode && (
          <header className="space-y-6">
            <Link 
              href={`/study/${examId}/subjects/${subjectId}/${topicId}`} 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold text-sm uppercase tracking-wider"
            >
              <ArrowLeft className="h-4 w-4" /> Back to sub-topics
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase font-bold tracking-widest leading-none">
                  <span>Study Material</span>
                  <ChevronRight className="h-4 w-4" />
                  <span>Interactive Manuscript</span>
                </div>
                <h1 className="text-5xl font-black tracking-tight">{subtopic.title}</h1>
              </div>

              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-1 bg-card border border-border rounded-xl p-1 shadow-sm">
                   <button 
                     onClick={() => setLanguage("english")}
                     className={cn(
                       "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                       language === "english" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-secondary"
                     )}
                   >
                     English
                   </button>
                   <button 
                     onClick={() => setLanguage("telugu")}
                     className={cn(
                       "px-4 py-2 rounded-lg text-xs font-bold transition-all font-telugu",
                       language === "telugu" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-secondary"
                     )}
                   >
                     తెలుగు
                   </button>
                 </div>

                 <button 
                   onClick={() => setIsFocusMode(!isFocusMode)}
                   className="p-3 bg-secondary hover:bg-primary/10 hover:text-primary rounded-xl transition-all border border-border"
                   title="Focus Mode"
                 >
                   <Maximize2 className="h-5 w-5" />
                 </button>
              </div>
            </div>
          </header>
        )}

        {isFocusMode && (
           <div className="fixed top-8 right-8 z-50 flex items-center gap-4">
              <div className="bg-background/80 backdrop-blur-md border border-border p-1 rounded-xl shadow-xl flex items-center gap-1">
                 <button onClick={() => setLanguage("english")} className={cn("px-4 py-2 rounded-lg text-xs font-bold", language === "english" ? "bg-primary text-white" : "hover:bg-secondary")}>EN</button>
                 <button onClick={() => setLanguage("telugu")} className={cn("px-4 py-2 rounded-lg text-xs font-bold font-telugu", language === "telugu" ? "bg-primary text-white" : "hover:bg-secondary")}>తె</button>
              </div>
              <button 
                onClick={() => setIsFocusMode(false)}
                className="p-3 bg-background border border-border rounded-xl shadow-xl hover:bg-secondary transition-all"
              >
                <Minimize2 className="h-5 w-5" />
              </button>
           </div>
        )}

        {/* Content Modules */}
        <section className="space-y-12">
           {subtopic.concepts && subtopic.concepts.length > 0 ? (
             subtopic.concepts.map((concept: any, idx: number) => (
               <motion.div 
                 key={concept.id}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: idx * 0.1 }}
                 className="bg-card border border-border/50 rounded-[3rem] p-12 shadow-sm relative group hover:border-primary/20 transition-all"
               >
                 
                 <div className="space-y-8">
                    {concept.modules?.filter((m: any) => !m.lang || m.lang === (language === "english" ? "en" : "te")).map((mod: any, mIdx: number) => (
                      <div key={mIdx}>
                        {mod.type === 'text' && (
                          <div 
                            className={cn(
                              "prose prose-slate dark:prose-invert max-w-none text-xl leading-relaxed text-foreground/80",
                              language === "telugu" && "font-telugu leading-loose"
                            )}
                            dangerouslySetInnerHTML={{ __html: mod.content }}
                          />
                        )}
                        {mod.type === 'image' && (
                          <div className="my-8 rounded-3xl overflow-hidden shadow-2xl border border-border">
                             <img 
                               src={mod.url.startsWith('http') ? mod.url : `http://localhost:8000${mod.url}`} 
                               alt="Concept visualization" 
                               className="w-full h-auto" 
                             />
                          </div>
                        )}
                        {mod.type === 'video' && (
                          <div className="my-8 rounded-3xl overflow-hidden shadow-2xl border border-border bg-black aspect-video">
                             {mod.url.includes('youtube.com') || mod.url.includes('youtu.be') ? (
                               <iframe
                                 src={mod.url.replace('watch?v=', 'embed/').split('&')[0]}
                                 className="w-full h-full"
                                 allowFullScreen
                               />
                             ) : (
                               <video 
                                 controls 
                                 playsInline
                                 preload="metadata"
                                 className="w-full h-full"
                               >
                                 <source 
                                   src={mod.url.startsWith('http') ? mod.url : `http://localhost:8000${mod.url}`} 
                                   type="video/mp4" 
                                 />
                                 Your browser does not support the video tag.
                               </video>
                             )}
                          </div>
                        )}
                        {mod.type === 'audio' && (
                          <div className="my-8">
                             <AudioPlayer 
                               url={mod.url.startsWith('http') ? mod.url : `http://localhost:8000${mod.url}`} 
                               themeColor={subject ? (subjectThemes[subject.title.toUpperCase()]?.color || "#4f46e5") : "#4f46e5"}
                             />
                          </div>
                        )}
                      </div>
                    ))}
                 </div>
               </motion.div>
             ))
           ) : (
             <div className="py-32 px-12 border-2 border-dashed border-border rounded-[4rem] text-center space-y-8 bg-secondary/20">
                <div className="h-24 w-24 rounded-[2rem] bg-primary/10 flex items-center justify-center mx-auto shadow-inner">
                   <BookOpen className="h-12 w-12 text-primary opacity-40" />
                </div>
                <div className="space-y-4 max-w-lg mx-auto">
                   <h3 className="text-3xl font-black tracking-tight">Academic Content En Route</h3>
                   <p className="text-xl text-muted-foreground font-medium leading-relaxed italic">
                      "We are working hard to provide the best academic content for this sub-topic. Stay tuned as our educators secure the highest-fidelity manuscripts for your preparation."
                   </p>
                </div>
             </div>
           )}
        </section>

      </div>
    </div>
  );
}
