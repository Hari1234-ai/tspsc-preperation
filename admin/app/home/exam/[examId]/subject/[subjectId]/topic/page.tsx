"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Layers, Edit, ChevronUp, ChevronDown, ArrowRight, Unlink, Plus, Search, X, Check, Box } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";
import { SkeletonListRow } from "@/components/Skeleton";

import { API_URL } from "@/lib/constants";

export default function SubjectTopicsPage() {
  const { examId, subjectId } = useParams();
  const router = useRouter();
  
  const [exam, setExam] = useState<any>(null);
  const [subject, setSubject] = useState<any>(null);
  const [allGlobalTopics, setAllGlobalTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Drawer & Multi-select State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ title: "", message: "", onConfirm: () => {} });

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Subject details directly (with topics)
      const subRes = await fetch(`${API_URL}/syllabus/subject/${subjectId}`);
      if (subRes.ok) {
        const subData = await subRes.json();
        setSubject(subData);
      }

      // Still need exam title for breadcrumbs (optional, but keep for UX)
      const papersRes = await fetch(`${API_URL}/syllabus/papers/all`);
      if (papersRes.ok) {
        const papersData = await papersRes.json();
        const currentExam = papersData.find((p: any) => p.id === examId);
        setExam(currentExam);
      }

      // Fetch all global topics for the drawer
      const topRes = await fetch(`${API_URL}/syllabus/topics/all`);
      if (topRes.ok) {
        const topData = await topRes.json();
        setAllGlobalTopics(topData || []);
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => {
    if (examId && subjectId) fetchData();
  }, [examId, subjectId]);

  const handleBulkAssign = async () => {
    if (selectedTopicIds.length === 0) return;
    setIsSubmitting(true);
    try {
      await fetch(`${API_URL}/subjects/${subjectId}/topics/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedTopicIds })
      });
      setIsDrawerOpen(false);
      setSelectedTopicIds([]);
      fetchData();
    } catch (err) { console.error(err); }
    setIsSubmitting(false);
  };

  const toggleTopicSelection = (id: string) => {
    setSelectedTopicIds(prev => 
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  const handleUnassign = (topicId: string, e: any) => {
    e.stopPropagation();
    setConfirmConfig({
      title: "Unlink Topic",
      message: "Are you sure you want to unassign this topic from this subject profile?",
      onConfirm: async () => {
        setIsConfirmOpen(false);
        await fetch(`${API_URL}/syllabus/papers/${examId}/subjects/${subjectId}/topics/${topicId}`, { method: "DELETE" });
        fetchData();
      }
    });
    setIsConfirmOpen(true);
  };

  const filteredGlobalTopics = allGlobalTopics.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="font-sans max-w-6xl mx-auto text-white">
      <div className="text-[10px] font-black text-gray-500 mb-12 flex items-center gap-3 uppercase tracking-[0.2em] animate-pulse">
        <div className="h-3 w-64 bg-gray-800/50 rounded-lg"></div>
      </div>
      <div className="group bg-[#0d1117] rounded-[3rem] p-12 mb-16 border border-gray-800 flex gap-10 items-center animate-pulse">
        <div className="w-32 h-32 rounded-[2rem] bg-gray-800/50 border border-gray-800 flex-shrink-0"></div>
        <div className="flex-1 space-y-4">
          <div className="h-10 w-64 bg-gray-800/50 rounded-2xl"></div>
          <div className="h-4 w-1/2 bg-gray-800/30 rounded-lg"></div>
        </div>
      </div>
      <div className="flex justify-between items-center mb-10 px-4">
        <div className="h-8 w-48 bg-gray-800/50 rounded-xl animate-pulse"></div>
        <div className="h-14 w-40 bg-gray-800/50 rounded-2xl animate-pulse"></div>
      </div>
      <div className="space-y-6 pb-20">
        {[1, 2, 3, 4].map(i => <SkeletonListRow key={i} />)}
      </div>
    </div>
  );
  
  if (!subject) return <div className="p-8 text-red-500 font-black">Subject blueprint not found.</div>;

  return (
    <div className="font-sans max-w-6xl mx-auto text-white">
      {/* Breadcrumbs */}
      <div className="text-[10px] font-black text-gray-500 mb-12 flex items-center gap-3 uppercase tracking-[0.2em]">
        <Link href="/home" className="hover:text-white transition-colors">Dashboard</Link>
        <span className="text-gray-800">/</span>
        <Link href="/home/exam" className="hover:text-white transition-colors">Exams</Link>
        <span className="text-gray-800">/</span>
        <Link href={`/home/exam/${examId}/subject`} className="hover:text-white transition-colors uppercase">{exam?.title}</Link>
        <span className="text-gray-800">/</span>
        <span className="text-[#6366f1]">{subject.title}</span>
      </div>

      {/* Header Card */}
      <div className="group bg-[#0d1117] rounded-[3rem] p-12 mb-16 border border-gray-800 flex gap-10 items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#6366f1] opacity-[0.02] blur-3xl -mr-32 -mt-32"></div>
        
        <div className="w-32 h-32 rounded-[2rem] bg-[#161b22] border border-gray-800 flex items-center justify-center shrink-0 shadow-2xl group-hover:-rotate-6 transition-transform duration-500">
          <Layers strokeWidth={2.5} className="w-16 h-16 text-[#6366f1]" />
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-black mb-3 tracking-tight italic">{subject.title}</h1>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[10px] font-black uppercase py-1 px-4 bg-indigo-500/10 text-[#6366f1] rounded-full tracking-[0.2em] border border-indigo-500/10">Subject Node</span>
            <span className="text-gray-800 text-xs font-black">/</span>
            <span className="text-sm text-gray-400 font-bold italic">Syllabus Orchestrator</span>
          </div>
          <p className="text-md text-gray-400 leading-relaxed max-w-2xl font-bold italic">
            {subject.description || `"Define the strategic chapters and topics that constitute this subject profile. Ensure logical continuity in the learning journey."`}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-10 px-4">
        <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
          <span className="w-2 h-8 bg-[#6366f1] rounded-full"></span>
          Chapters & Topics
        </h2>
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="bg-[#6366f1] text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-black text-sm hover:shadow-2xl hover:shadow-indigo-500/40 active:scale-95 transition-all shadow-lg shadow-indigo-500/20"
        >
          <Plus size={20} strokeWidth={3} />
          Add Topics
        </button>
      </div>

      <div className="space-y-6 pb-20">
        {subject.topics.length === 0 ? (
           <div className="py-24 text-center bg-[#0d1117] rounded-[3rem] border border-gray-800 border-dashed">
             <p className="text-[#6366f1] font-black text-xl mb-2">No topics assigned to this subject yet.</p>
             <p className="text-gray-500 font-bold italic">"Link topics from your global cloud to begin populating this subject."</p>
           </div>
        ) : (
          subject.topics.map((top: any, i: number) => (
            <div 
              key={top.id} 
              onClick={() => router.push(`/home/exam/${examId}/subject/${subjectId}/topic/${top.id}/sub-topic`)}
              className="group bg-[#0d1117] border border-gray-800 p-8 rounded-[2.5rem] shadow-sm flex items-center cursor-pointer hover:border-[#6366f1]/50 hover:shadow-3xl hover:shadow-indigo-500/10 transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#6366f1] opacity-[0.01] blur-3xl -mr-16 -mt-16 group-hover:opacity-[0.04] transition-opacity"></div>
              
              <div className="flex flex-col gap-1 mr-8">
                <button className="text-gray-800 hover:text-[#6366f1] transition-colors"><ChevronUp size={22} /></button>
                <div className="w-14 h-14 bg-[#161b22] border border-gray-800 rounded-2xl flex items-center justify-center font-black text-xl text-gray-700 group-hover:bg-[#6366f1] group-hover:text-white transition-all shadow-inner">
                  {i + 1}
                </div>
                <button className="text-gray-800 hover:text-[#6366f1] transition-colors"><ChevronDown size={22} /></button>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="font-black text-2xl text-white group-hover:text-[#6366f1] transition-colors">{top.title}</h3>
                  <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg border tracking-widest ${
                    top.weightage === 'High' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-[#6366f1]/10 text-indigo-400 border-indigo-500/20'
                  }`}>
                    {top.weightage}
                  </span>
                </div>
                <p className="text-sm text-gray-500 font-bold italic opacity-60 group-hover:opacity-100 transition-opacity">
                  {top.description || "Theoretical modules, case studies, and practical insights."}
                </p>
              </div>
              <div className="flex items-center gap-6 px-6">
                <button 
                  onClick={(e) => handleUnassign(top.id, e)} 
                  className="w-12 h-12 rounded-2xl bg-red-500/5 border border-red-500/10 flex items-center justify-center text-red-500/40 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-300 transform scale-90 hover:scale-100"
                  title="Unlink Topic"
                >
                  <Unlink size={18} />
                </button>
                <div className="text-gray-800 group-hover:text-[#6366f1] transform group-hover:translate-x-1 transition-all">
                  <ArrowRight size={32} strokeWidth={2.5} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Side Drawer */}
      {isDrawerOpen && (
        <>
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] animate-in fade-in transition-all duration-500" onClick={() => setIsDrawerOpen(false)}></div>
          <div className="fixed top-0 right-0 h-full w-[520px] bg-[#0a0c10] border-l border-gray-800 z-[101] p-12 shadow-3xl animate-in slide-in-from-right duration-700 ease-out flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between mb-12">
               <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3 italic uppercase">
                 <span className="w-2 h-8 bg-[#6366f1] rounded-full"></span>
                 Link Topics
               </h2>
               <button onClick={() => setIsDrawerOpen(false)} className="w-12 h-12 rounded-full bg-[#161b22] border border-gray-800 flex items-center justify-center text-gray-500 hover:text-white transition-all">
                 <X size={24} />
               </button>
            </div>

            <div className="relative mb-10">
              <input 
                type="text" 
                placeholder="Search global topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#161b22] border border-gray-800 rounded-2xl py-4 px-6 text-sm font-bold text-white placeholder:text-gray-700 outline-none focus:border-[#6366f1] transition-all"
              />
              <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-700" size={18} />
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
               {filteredGlobalTopics.map(top => {
                 const isAlreadyAssigned = subject.topics.some((st: any) => st.id === top.id);
                 const isSelected = selectedTopicIds.includes(top.id);
                 
                 return (
                   <div 
                     key={top.id}
                     onClick={() => !isAlreadyAssigned && toggleTopicSelection(top.id)}
                     className={`p-6 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                       isAlreadyAssigned 
                        ? "bg-gray-800/20 border-gray-800 opacity-50 cursor-not-allowed" 
                        : isSelected 
                          ? "bg-[#6366f1]/10 border-[#6366f1] shadow-lg shadow-indigo-500/5" 
                          : "bg-[#161b22] border-gray-800 hover:border-gray-700"
                     }`}
                   >
                     <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                          isSelected ? "bg-[#6366f1] border-[#6366f1] text-white" : "bg-[#0d1117] border-gray-800 text-gray-700"
                        }`}>
                           {isSelected ? <Check size={18} strokeWidth={3} /> : <Box size={18} />}
                        </div>
                        <div>
                          <p className={`font-black tracking-tight ${isSelected ? "text-white" : "text-gray-400"}`}>{top.title}</p>
                          <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{top.id}</p>
                        </div>
                     </div>
                     {isAlreadyAssigned && (
                       <span className="text-[9px] font-black bg-gray-800 text-gray-500 px-2 py-1 rounded uppercase">Linked</span>
                     )}
                   </div>
                 );
               })}
            </div>

            <div className="mt-10 pt-10 border-t border-gray-900">
               <button 
                 onClick={handleBulkAssign}
                 disabled={selectedTopicIds.length === 0 || isSubmitting}
                 className="w-full bg-[#6366f1] text-white py-6 rounded-2xl font-black text-lg shadow-2xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
               >
                 {isSubmitting ? "Linking..." : `Link ${selectedTopicIds.length} Topic${selectedTopicIds.length === 1 ? '' : 's'}`}
               </button>
               <p className="text-center text-[10px] text-gray-600 font-bold mt-4 uppercase tracking-widest italic leading-relaxed">
                 "Topics selected here will be integrated into the {subject.title} map."
               </p>
            </div>
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
