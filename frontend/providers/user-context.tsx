"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Target, ChevronRight } from "lucide-react";

interface UserProfile {
  name: string;
  exam: string;
}

interface UserContextType {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  resetProfile: () => void;
  updateExam: (exam: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Onboarding states
  const [inputName, setInputName] = useState("");
  const [selectedExam, setSelectedExam] = useState("Group_II");

  useEffect(() => {
    const saved = localStorage.getItem("cracksarkar_profile");
    if (saved) {
      setProfileState(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, []);

  const setProfile = (newProfile: UserProfile) => {
    localStorage.setItem("cracksarkar_profile", JSON.stringify(newProfile));
    setProfileState(newProfile);
  };

  const resetProfile = () => {
    localStorage.removeItem("cracksarkar_profile");
    setProfileState(null);
  };

  const updateExam = (exam: string) => {
    if (profile) {
      const newProfile = { ...profile, exam };
      setProfile(newProfile);
    }
  };

  const handleOnboard = () => {
    if (inputName.trim().length < 2) return;
    setProfile({ name: inputName.trim(), exam: selectedExam });
  };

  if (!isLoaded) return null;

  return (
    <UserContext.Provider value={{ profile, setProfile, resetProfile, updateExam }}>
      {children}
      <AnimatePresence>
        {!profile && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-card w-full max-w-md p-8 rounded-3xl shadow-xl border border-border"
            >
              <div className="text-center space-y-2 mb-8">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-black">Welcome to CrackSarkar</h2>
                <p className="text-muted-foreground text-sm">Let's set up your study profile to get started.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" /> Your Name
                  </label>
                  <input 
                    type="text" 
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    placeholder="e.g. Aravind"
                    className="w-full p-4 rounded-xl bg-secondary/50 border border-border outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" /> Target Exam
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: "Group_II", label: "Group II (Executive & Non-Executive)" },
                      { id: "Group_III", label: "Group III (Upper & Lower Division)" },
                      { id: "Group_IV", label: "Group IV (Secretariat Services)" }
                    ].map(exam => (
                      <button
                        key={exam.id}
                        onClick={() => setSelectedExam(exam.id)}
                        className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                          selectedExam === exam.id 
                            ? "border-primary bg-primary/5 ring-1 ring-primary" 
                            : "border-border bg-secondary/30 hover:bg-secondary"
                        }`}
                      >
                        <span className="font-semibold text-sm">{exam.label}</span>
                        {selectedExam === exam.id && <div className="h-2 w-2 rounded-full bg-primary" />}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleOnboard}
                  disabled={inputName.trim().length < 2}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Start Preparing <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
