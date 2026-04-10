"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Edit, Plus, X, Box, ArrowRight } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";

const API_URL = "http://localhost:8000/api/v1";

export default function GlobalSubtopicsPage() {
  const router = useRouter();
  const [subtopics, setSubtopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modal State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ title: "", message: "", onConfirm: () => {} });
  
  // Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editingSubtopic, setEditingSubtopic] = useState<any>(null);

  const fetchSubtopics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/syllabus/subtopics/all`);
      const data = await res.json();
      setSubtopics(data || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubtopics();
  }, []);

  const openCreateDrawer = () => {
    setDrawerMode("create");
    setNewTitle("");
    setNewDescription("");
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (st: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setDrawerMode("edit");
    setEditingSubtopic(st);
    setNewTitle(st.title);
    setNewDescription(st.description || "");
    setIsDrawerOpen(true);
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    setIsSubmitting(true);
    try {
      if (drawerMode === "create") {
        await fetch(`${API_URL}/syllabus/subtopics`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            title: newTitle,
            description: newDescription
          })
        });
      } else {
        await fetch(`${API_URL}/syllabus/subtopics/${editingSubtopic.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            title: newTitle,
            description: newDescription
          })
        });
      }
      setIsDrawerOpen(false);
      fetchSubtopics();
    } catch (err) {
      console.error(err);
    }
    setIsSubmitting(false);
  };

  const handleDelete = () => {
    if (!editingSubtopic) return;
    setConfirmConfig({
      title: "Delete Sub-topic",
      message: `Are you sure you want to permanently delete "${editingSubtopic.title}"? This action cannot be undone.`,
      onConfirm: async () => {
        setIsConfirmOpen(false);
        setIsSubmitting(true);
        try {
          await fetch(`${API_URL}/syllabus/subtopics/${editingSubtopic.id}`, { method: "DELETE" });
          setIsDrawerOpen(false);
          fetchSubtopics();
        } catch (err) { console.error(err); }
        setIsSubmitting(false);
      }
    });
    setIsConfirmOpen(true);
  };

  const filteredSubtopics = subtopics.filter(st => st.title.toLowerCase().includes(search.toLowerCase()));

  if (loading) return (
    <div className="flex items-center justify-center py-32">
       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6366f1]"></div>
    </div>
  );

  return (
    <div className="font-sans max-w-6xl mx-auto pb-20 text-white">
      <div className="flex justify-between items-end mb-14">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight italic">Sub-topics Lab</h1>
          <p className="text-gray-500 font-bold">Fine-tune individual learning blocks and resource nodes.</p>
        </div>
        <button 
          onClick={openCreateDrawer}
          className="bg-[#6366f1] text-white px-8 py-4 rounded-2xl font-black text-sm hover:shadow-2xl hover:shadow-indigo-500/40 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
        >
          <Plus size={20} strokeWidth={3} />
          Add Sub-topic
        </button>
      </div>

      <div className="relative mb-16">
        <input 
          type="text" 
          placeholder="Filter learning blocks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#0d1117] border border-gray-800 rounded-2xl py-6 px-8 outline-none focus:border-[#6366f1] shadow-2xl text-lg font-bold text-white placeholder:text-gray-700 transition-all font-sans"
        />
        <div className="absolute right-6 top-1/2 -translate-y-1/2 bg-[#6366f1] p-3 rounded-xl shadow-lg shadow-indigo-500/20">
          <Search className="text-white" size={24} strokeWidth={3} />
        </div>
      </div>

      {filteredSubtopics.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center bg-[#0d1117] rounded-[3rem] border border-gray-800 border-dashed">
          <div className="w-24 h-24 bg-[#161b22] border border-gray-800 rounded-3xl shadow-lg flex items-center justify-center mb-8 rotate-3">
             <Box size={48} className="text-[#6366f1] opacity-50" />
          </div>
          <h2 className="text-2xl font-black text-white mb-3 tracking-tight">Empty Lab</h2>
          <p className="text-gray-500 font-bold mb-10 max-w-sm italic">"Sub-topics are granular units where you add modular content like video and audio."</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
          {filteredSubtopics.map((st) => (
            <div key={st.id} 
              onClick={() => router.push(`/home/sub-topic/${st.id}/modules`)}
              className="group bg-[#0d1117] border border-gray-800 p-10 rounded-[3rem] shadow-sm flex flex-col cursor-pointer hover:border-[#6366f1]/50 hover:shadow-3xl hover:shadow-indigo-500/10 transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#6366f1] opacity-[0.01] blur-3xl -mr-16 -mt-16 group-hover:opacity-[0.04] transition-opacity"></div>
              
              <div className="flex justify-between items-start mb-10">
                <div className="w-16 h-16 bg-[#161b22] border border-gray-800 rounded-2xl flex items-center justify-center group-hover:bg-[#6366f1] transition-all duration-500">
                  <Box size={24} className="text-[#6366f1] group-hover:text-white" />
                </div>
                <button 
                  onClick={(e) => openEditDrawer(st, e)}
                  className="w-10 h-10 rounded-xl bg-[#161b22] border border-gray-800 flex items-center justify-center text-gray-600 hover:bg-[#6366f1] hover:text-white hover:border-[#6366f1] transition-all shadow-sm"
                >
                  <Edit size={16} />
                </button>
              </div>

              <h3 className="font-black text-2xl text-white mb-2 line-clamp-2 leading-tight group-hover:text-[#6366f1] transition-colors">{st.title}</h3>
              {st.description && (
                <p className="text-xs text-gray-500 font-bold mb-4 italic line-clamp-2 leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">
                  {st.description}
                </p>
              )}
              
              <div className="mt-auto pt-8 border-t border-gray-900 flex items-center justify-between">
                <span className="text-[10px] uppercase font-black text-gray-600 tracking-[0.2em]">{st.id}</span>
                <div className="text-gray-800 group-hover:text-[#6366f1] transform group-hover:translate-x-1 transition-all">
                  <ArrowRight size={28} strokeWidth={3} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Side Drawer */}
      {isDrawerOpen && (
        <>
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] animate-in fade-in transition-all duration-500" onClick={() => setIsDrawerOpen(false)}></div>
          <div className="fixed top-0 right-0 h-full w-[480px] bg-[#0a0c10] border-l border-gray-800 z-[101] p-12 shadow-3xl animate-in slide-in-from-right duration-700 ease-out flex flex-col">
            <div className="flex items-center justify-between mb-16">
               <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3 italic">
                 <span className="w-2 h-8 bg-[#6366f1] rounded-full"></span>
                 {drawerMode === "create" ? "New Sub-topic" : "Edit Sub-topic"}
               </h2>
               <button onClick={() => setIsDrawerOpen(false)} className="w-12 h-12 rounded-full bg-[#161b22] border border-gray-800 flex items-center justify-center text-gray-500 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 transition-all">
                 <X size={24} />
               </button>
            </div>
            
            <form onSubmit={handleAction} className="flex-1 space-y-10 group text-white">
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Sub-topic Title</label>
                <input 
                  autoFocus
                  type="text" 
                  placeholder="e.g. Impact of Globalization"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#161b22] border border-gray-800 rounded-[2rem] p-6 text-lg font-bold text-white placeholder:text-gray-800 outline-none focus:border-[#6366f1] focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-inner"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Description</label>
                <textarea 
                  placeholder="Summarize this learning node..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-[#161b22] border border-gray-800 rounded-[2rem] p-6 text-sm font-bold text-white placeholder:text-gray-800 outline-none focus:border-[#6366f1] focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-inner min-h-[100px] resize-none"
                />
              </div>

              <div className="bg-[#6366f1]/5 p-8 rounded-[2rem] border border-indigo-500/10">
                 <p className="text-[10px] font-black text-[#6366f1] uppercase tracking-[0.2em] mb-3">Architect Note</p>
                 <p className="text-xs text-gray-400 leading-relaxed font-bold italic">"Sub-topics are the base layer of content architecture. Link these to topics to build a complete curriculum."</p>
              </div>

              <div className="mt-auto pt-10 border-t border-gray-900 flex flex-col gap-4">
                 <button 
                   type="submit"
                   disabled={isSubmitting}
                   className="w-full bg-[#6366f1] text-white py-6 rounded-[2rem] font-black text-lg shadow-2xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                 >
                    {isSubmitting ? "Syncing..." : drawerMode === "create" ? "Save Sub-topic" : "Save Sub-topic"}
                 </button>
                 
                 {drawerMode === "edit" && (
                   <button 
                     type="button"
                     onClick={handleDelete}
                     disabled={isSubmitting}
                     className="w-full bg-red-500/5 text-red-500 border border-red-500/20 py-6 rounded-[2rem] font-black text-sm hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                   >
                      Delete Sub-topic
                   </button>
                 )}
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
