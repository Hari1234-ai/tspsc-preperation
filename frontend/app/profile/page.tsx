"use client";

import React, { useState } from "react";
import { useUser } from "@/providers/user-context";
import { User, Target, Save, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { profile, setProfile } = useUser();
  const [name, setName] = useState(profile?.name || "");
  const [exam, setExam] = useState(profile?.exam || "Group_II");
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const handleSave = () => {
    if (name.trim().length < 2) return;
    setProfile({ name, exam });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black mb-2">Your Profile</h1>
        <p className="text-muted-foreground">Manage your personal settings and active exam group.</p>
      </div>

      <div className="bg-card border rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
        <div className="space-y-3">
          <label className="text-sm font-bold flex items-center gap-2">
            <User className="h-4 w-4 text-primary" /> Display Name
          </label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-4 rounded-xl bg-secondary/30 border focus:border-primary outline-none transition-colors"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" /> Active Target Exam
          </label>
          <p className="text-xs text-muted-foreground mb-4">
            Changing this will reset your dashboard and study progress to focus exclusively on the selected exam.
          </p>
          <div className="grid grid-cols-1 gap-3">
            {[
              { id: "Group_II", label: "Group II (Executive & Non-Executive)" },
              { id: "Group_III", label: "Group III (Upper & Lower Division)" },
              { id: "Group_IV", label: "Group IV (Secretariat Services)" }
            ].map(e => (
              <button
                key={e.id}
                onClick={() => setExam(e.id)}
                className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                  exam === e.id 
                    ? "border-primary bg-primary/5 ring-1 ring-primary" 
                    : "border-border bg-secondary/30 hover:bg-secondary"
                }`}
              >
                <span className="font-semibold">{e.label}</span>
                {exam === e.id && <div className="h-2 w-2 rounded-full bg-primary" />}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6">
          <button 
            onClick={handleSave}
            disabled={name.trim().length < 2}
            className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 flex items-center justify-center gap-2 transition-all"
          >
            {saved ? (
              <>
                <CheckCircle className="h-5 w-5" /> Saved Successfully!
              </>
            ) : (
              <>
                <Save className="h-5 w-5" /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
