"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Github } from "lucide-react";
import { useUser } from "@/providers/user-context";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useUser();
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      login(email, "email");
    }
  };

  const handleGoogleLogin = () => {
    login("user@google.com", "google");
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950 px-4">
      {/* Background Glows */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10 space-y-4">
           <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                 <img src="/favicon.svg" alt="Logo" className="h-6 w-6 invert" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">CrackSarkar</span>
           </Link>
           <h1 className="text-4xl font-black text-white tracking-tight leading-none">
             {isLogin ? "Welcome Back" : "Start your Journey"}
           </h1>
           <p className="text-slate-400 font-medium">
             Unlock high-fidelity academic manuscripts and master your exams.
           </p>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl space-y-8">
            {/* Social Login */}
            <button 
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-4 bg-white text-black font-bold rounded-2xl hover:bg-slate-100 transition-all border border-white/20 active:scale-95"
            >
               <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 w-5" />
               Continue with Google
            </button>

            <div className="relative">
               <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
               <div className="relative flex justify-center text-xs uppercase"><span className="bg-transparent px-2 text-slate-500 font-bold tracking-widest">Or with email</span></div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="space-y-1">
                  <div className="relative group">
                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                     <input 
                       type="email" 
                       required
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       placeholder="Email Address"
                       className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-white/10 rounded-2xl focus:border-primary outline-none text-white font-medium transition-all"
                     />
                  </div>
               </div>
               
               <div className="space-y-1">
                  <div className="relative group">
                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                     <input 
                       type="password" 
                       required
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       placeholder="Password"
                       className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-white/10 rounded-2xl focus:border-primary outline-none text-white font-medium transition-all"
                     />
                  </div>
               </div>

               <button 
                 type="submit"
                 className="w-full py-4 bg-primary text-primary-foreground font-black rounded-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary/20 active:scale-95"
               >
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
               </button>
            </form>

            <div className="text-center">
               <button 
                 onClick={() => setIsLogin(!isLogin)}
                 className="text-slate-400 text-sm font-bold hover:text-white transition-colors"
               >
                 {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
               </button>
            </div>
        </div>
      </motion.div>
    </div>
  );
}
