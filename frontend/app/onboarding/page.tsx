"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Target, ChevronRight, CheckCircle2 } from "lucide-react";
import { useUser } from "@/providers/user-context";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function OnboardingPage() {
  const { user, completeOnboarding, profile } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [exam, setExam] = useState("Group_II");

  useEffect(() => {
    // If user is not logged in, they shouldn't be here
    if (!user) {
      router.push("/login");
    }
    // If profile is already complete, go to dashboard
    if (profile) {
      router.push("/dashboard");
    }
  }, [user, profile, router]);

  const exams = [
    { id: "Group_II", label: "Group II", desc: "Executive & Non-Executive posts across various departments." },
    { id: "Group_III", label: "Group III", desc: "Upper Division Clerks and Lower Division assistants." },
    { id: "Group_IV", label: "Group IV", desc: "Secretariat, Treasury, and District Level Junior Assistants." }
  ];

  const handleComplete = () => {
    if (name.trim()) {
      completeOnboarding({ name: name.trim(), exam });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-30" />

      <div className="w-full max-w-xl z-10">
        <div className="mb-12 flex justify-center gap-2">
           {[1, 2].map(s => (
             <div key={s} className={cn(
               "h-1.5 w-12 rounded-full transition-all duration-500",
               step >= s ? "bg-primary" : "bg-white/10"
             )} />
           ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
               <div className="space-y-4">
                  <h1 className="text-5xl font-black text-white tracking-tighter leading-none text-center">
                    What should we <br/><span className="text-primary">call you?</span>
                  </h1>
                  <p className="text-slate-400 text-lg font-medium text-center">
                    Your name will be used to personalize your study dashboard.
                  </p>
               </div>

               <div className="bg-white/5 border border-white/10 p-1 rounded-3xl flex items-center gap-4 focus-within:ring-2 ring-primary transition-all">
                  <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center ml-1">
                     <User className="h-6 w-6 text-primary" />
                  </div>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="flex-1 bg-transparent border-none outline-none text-2xl font-bold text-white placeholder:text-slate-600 px-2"
                  />
               </div>

               <button 
                 onClick={() => name.trim() && setStep(2)}
                 disabled={!name.trim()}
                 className="w-full py-5 bg-primary text-primary-foreground font-black rounded-3xl text-xl flex items-center justify-center gap-3 hover:bg-primary/90 transition-all disabled:opacity-50 group"
               >
                 Next Step <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
               </button>
            </motion.div>
          ) : (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
               <div className="space-y-4">
                  <h1 className="text-5xl font-black text-white tracking-tighter leading-none text-center">
                    Target <br/><span className="text-primary">Examination</span>
                  </h1>
                  <p className="text-slate-400 text-lg font-medium text-center">
                    Choose the syllabus you want to master. You can change this later.
                  </p>
               </div>

               <div className="grid grid-cols-1 gap-4">
                  {exams.map(ex => (
                    <button 
                      key={ex.id}
                      onClick={() => setExam(ex.id)}
                      className={cn(
                        "p-6 rounded-[2rem] border-2 text-left transition-all relative group overflow-hidden",
                        exam === ex.id 
                          ? "bg-primary/10 border-primary shadow-[0_0_40px_rgba(79,70,229,0.2)]" 
                          : "bg-white/5 border-white/10 hover:border-white/20"
                      )}
                    >
                       <div className="flex justify-between items-start z-10 relative">
                          <div className="space-y-2">
                             <h3 className={cn(
                               "text-2xl font-black tracking-tight",
                               exam === ex.id ? "text-primary" : "text-white"
                             )}>{ex.label}</h3>
                             <p className="text-slate-400 text-sm font-medium leading-tight max-w-[200px]">
                               {ex.desc}
                             </p>
                          </div>
                          {exam === ex.id && (
                             <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                                <CheckCircle2 className="h-5 w-5" />
                             </div>
                          )}
                       </div>
                    </button>
                  ))}
               </div>

               <div className="flex gap-4">
                 <button 
                   onClick={() => setStep(1)}
                   className="flex-1 py-5 bg-white/5 text-white font-black rounded-3xl text-xl border border-white/10 hover:bg-white/10 transition-all"
                 >
                   Back
                 </button>
                 <button 
                   onClick={handleComplete}
                   className="flex-[2] py-5 bg-primary text-primary-foreground font-black rounded-3xl text-xl flex items-center justify-center gap-3 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
                 >
                   Start Learning <ChevronRight className="h-6 w-6" />
                 </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
