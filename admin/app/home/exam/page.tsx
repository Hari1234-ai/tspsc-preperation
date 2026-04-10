"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Edit, BookOpen, ArrowRight, X } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";

const API_URL = "http://localhost:8000/api/v1";

export default function GlobalExamsPage() {
  const router = useRouter();
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Edit logic
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<any>(null);
   const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ title: "", message: "", onConfirm: () => {} });

  const fetchExams = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/syllabus/papers/all`);
      const data = await res.json();
      setExams(data || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const openEditDrawer = (exam: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingExam(exam);
    setEditTitle(exam.title);
    setEditDescription(exam.description || "");
    setIsDrawerOpen(true);
  };

  const handleUpdateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle || !editingExam) return;
    setIsSubmitting(true);
    try {
      await fetch(`${API_URL}/syllabus/papers/${editingExam.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: editTitle,
          description: editDescription
        })
      });
      setIsDrawerOpen(false);
      fetchExams();
    } catch (err) {
      console.error(err);
    }
    setIsSubmitting(false);
  };

  const handleDeleteExam = () => {
    if (!editingExam) return;
    setConfirmConfig({
      title: "Delete Exam",
      message: `Are you sure you want to permanently delete "${editingExam.title}"? This action cannot be undone.`,
      onConfirm: async () => {
        setIsConfirmOpen(false);
        setIsSubmitting(true);
        try {
          await fetch(`${API_URL}/syllabus/papers/${editingExam.id}`, {
            method: "DELETE"
          });
          setIsDrawerOpen(false);
          fetchExams();
        } catch (err) {
          console.error(err);
        }
        setIsSubmitting(false);
      }
    });
    setIsConfirmOpen(true);
  };

  const filteredExams = exams.filter(e => e.title.toLowerCase().includes(search.toLowerCase()));

  if (loading) return (
    <div className="flex items-center justify-center py-32">
       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6366f1]"></div>
    </div>
  );

  return (
    <div className="font-sans max-w-6xl mx-auto pb-20 text-white">
      {/* ... (rest of the breadcrumbs and header remain same) ... */}
      <div className="flex justify-between items-end mb-14">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight flex items-center gap-4 italic">
            <span className="w-3 h-10 bg-[#6366f1] rounded-full shadow-lg shadow-indigo-500/20"></span>
            Exams Repository
          </h1>
          <p className="text-gray-500 font-bold">Manage core curriculum anchors for CrackSarkar.</p>
        </div>
      </div>

      <div className="relative mb-16">
        <input 
          type="text" 
          placeholder="Search exams profile..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#0d1117] border border-gray-800 rounded-2xl py-6 px-8 outline-none focus:border-[#6366f1] shadow-2xl text-lg font-bold text-white placeholder:text-gray-700 transition-all font-sans"
        />
        <div className="absolute right-6 top-1/2 -translate-y-1/2 bg-[#6366f1] p-3 rounded-xl shadow-lg shadow-indigo-500/20">
          <Search className="text-white" size={24} strokeWidth={3} />
        </div>
      </div>

      {filteredExams.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center bg-[#0d1117] rounded-[3rem] border border-gray-800 border-dashed">
          <div className="w-24 h-24 bg-[#161b22] border border-gray-800 rounded-3xl shadow-lg flex items-center justify-center mb-8 rotate-3">
             <BookOpen size={48} className="text-[#6366f1] opacity-50" />
          </div>
          <h2 className="text-2xl font-black text-white mb-3 tracking-tight">No Exams Found</h2>
          <p className="text-gray-500 font-bold max-w-sm leading-relaxed italic">"Wait for administrator to unlock content pipelines."</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 pb-20">
          {filteredExams.map((exam, i) => (
            <div 
              key={exam.id} 
              onClick={() => router.push(`/home/exam/${exam.id}/subject`)}
              className="group bg-[#0d1117] border border-gray-800 p-10 rounded-[2.5rem] shadow-sm flex items-center cursor-pointer hover:border-[#6366f1]/50 hover:shadow-3xl hover:shadow-indigo-500/10 transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#6366f1] opacity-[0.01] blur-3xl -mr-16 -mt-16 group-hover:opacity-[0.04] transition-opacity"></div>
              
              <div className="flex items-center gap-10 flex-1">
                <div className="w-20 h-20 bg-[#161b22] border border-gray-800 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#6366f1] transition-all duration-500 shadow-inner">
                  <span className="text-3xl font-black text-gray-700 group-hover:text-white transition-colors duration-500">{i + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-black text-3xl text-white tracking-tight group-hover:text-[#6366f1] transition-colors">{exam.title}</h3>
                    <button 
                      onClick={(e) => openEditDrawer(exam, e)}
                      className="bg-[#161b22] border border-gray-800 p-3 rounded-xl text-gray-500 hover:bg-[#6366f1] hover:text-white hover:border-[#6366f1] transition-all shadow-sm"
                    >
                      <Edit size={18} />
                    </button>
                  </div>
                  {exam.description && (
                    <p className="text-sm text-gray-500 font-bold mb-4 italic line-clamp-1">{exam.description}</p>
                  )}
                  <div className="flex gap-4 items-center">
                    <span className="bg-indigo-500/10 text-[#6366f1] text-[10px] font-black uppercase tracking-widest py-1 px-3 rounded-lg border border-indigo-500/5">{exam.id}</span>
                    <span className="text-gray-800 text-xs font-black">/</span>
                    <p className="text-sm text-gray-500 font-bold italic">{exam.subjects?.length || 0} Subjects Assigned</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-8 pl-12 pr-4">
                <div className="text-gray-800 group-hover:text-[#6366f1] transform group-hover:translate-x-1 transition-all">
                  <ArrowRight size={32} strokeWidth={3} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Drawer */}
      {isDrawerOpen && (
        <>
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] animate-in fade-in transition-all duration-500" onClick={() => setIsDrawerOpen(false)}></div>
          <div className="fixed top-0 right-0 h-full w-[480px] bg-[#0a0c10] border-l border-gray-800 z-[101] p-12 shadow-3xl animate-in slide-in-from-right duration-700 ease-out flex flex-col">
            <div className="flex items-center justify-between mb-16">
               <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3 italic">
                 <span className="w-2 h-8 bg-[#6366f1] rounded-full"></span>
                 Edit Exam
               </h2>
               <button onClick={() => setIsDrawerOpen(false)} className="w-12 h-12 rounded-full bg-[#161b22] border border-gray-800 flex items-center justify-center text-gray-500 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 transition-all">
                 <X size={24} />
               </button>
            </div>
            
            <form onSubmit={handleUpdateExam} className="flex-1 space-y-10 group text-white">
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Exam Title</label>
                <input 
                  autoFocus
                  type="text" 
                  placeholder="e.g. Group I Services"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-[#161b22] border border-gray-800 rounded-[2rem] p-6 text-xl font-bold text-white placeholder:text-gray-800 outline-none focus:border-[#6366f1] focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-inner"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Description</label>
                <textarea 
                  placeholder="Describe the exam scope..."
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full bg-[#161b22] border border-gray-800 rounded-[2rem] p-6 text-sm font-bold text-white placeholder:text-gray-800 outline-none focus:border-[#6366f1] focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-inner min-h-[120px] resize-none"
                />
              </div>

              <div className="bg-[#6366f1]/5 p-8 rounded-[2rem] border border-indigo-500/10">
                 <p className="text-[10px] font-black text-[#6366f1] uppercase tracking-[0.2em] mb-3">Architect Note</p>
                 <p className="text-xs text-gray-400 leading-relaxed font-bold italic">"Changing the title updates the global anchor name. The unique ID remains immutable for backend stability."</p>
              </div>

              <div className="mt-auto pt-10 border-t border-gray-900 flex flex-col gap-4">
                 <button 
                   type="submit"
                   disabled={isSubmitting}
                   className="w-full bg-[#6366f1] text-white py-6 rounded-[2rem] font-black text-lg shadow-2xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                 >
                   {isSubmitting ? "Syncing..." : "Save Exam"}
                 </button>
                 <button 
                   type="button"
                   onClick={handleDeleteExam}
                   disabled={isSubmitting}
                   className="w-full bg-red-500/5 text-red-500 border border-red-500/20 py-6 rounded-[2rem] font-black text-sm hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                 >
                   Delete Exam
                 </button>
              </div>
            </form>
          </div>
        </>
      )}

      <ConfirmModal 
        isOpen={isConfirmOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}
