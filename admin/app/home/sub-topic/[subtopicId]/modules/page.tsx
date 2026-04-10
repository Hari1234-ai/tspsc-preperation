"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ChevronUp, 
  Type, 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Code, 
  Link as LinkIcon, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  List, 
  ListOrdered,
  Image as ImageIcon,
  Video,
  Music,
  Trash2,
  Undo,
  Redo,
  Table as TableIcon,
  Mic,
  Save,
  ChevronLeft,
  Zap
} from "lucide-react";

const API_URL = "http://localhost:8000/api/v1";

export default function GlobalContentEditor() {
  const { subtopicId } = useParams();
  const router = useRouter();

  const [modules, setModules] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${API_URL}/syllabus/subtopic/${subtopicId}`);
        const st = await res.json();
        
        if (st) {
          setTitle(st.title);
          if (st.concepts && st.concepts.length > 0 && st.concepts[0].modules) {
            setModules(st.concepts[0].modules);
            const textMod = st.concepts[0].modules.find((m: any) => m.type === "text");
            if (textMod) setDescription(textMod.content);
          }
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    fetchData();
  }, [subtopicId]);

  const handleSave = async () => {
    setSaving(true);
    const updatedModules = [...modules];
    const textIdx = updatedModules.findIndex(m => m.type === "text");
    if (textIdx !== -1) {
      updatedModules[textIdx].content = description;
    } else {
      updatedModules.unshift({ type: "text", content: description });
    }

    try {
      await fetch(`${API_URL}/syllabus/subtopic/${subtopicId}/content`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modules: updatedModules })
      });
      router.back(); // Return to previous context (Topic or Subtopics list)
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-32">
       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6366f1]"></div>
    </div>
  );

  return (
    <div className="font-sans max-w-7xl mx-auto text-white pb-32">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-8">
           <button 
             onClick={() => router.back()}
             className="w-14 h-14 rounded-2xl bg-[#161b22] border border-gray-800 flex items-center justify-center text-gray-500 hover:text-white hover:border-gray-700 transition-all shadow-lg"
           >
             <ChevronLeft size={24} />
           </button>
           <div>
              <h1 className="text-4xl font-black tracking-tight italic flex items-center gap-4">
                <span className="w-3 h-10 bg-[#6366f1] rounded-full shadow-lg shadow-indigo-500/20"></span>
                {title}
              </h1>
              <p className="text-gray-500 font-bold mt-1 uppercase text-[10px] tracking-[0.3em]">
                 Global Content Architect / <span className="text-[#6366f1]">{subtopicId}</span>
              </p>
           </div>
        </div>
        
        <div className="flex gap-4">
           <button 
             onClick={handleSave}
             disabled={saving}
             className="bg-[#6366f1] text-white px-10 py-5 rounded-2xl font-black text-sm shadow-2xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
           >
             {saving ? "Publishing Node..." : "Sync Changes"}
             <Save size={18} strokeWidth={3} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Editor Canvas */}
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-[#0d1117] border border-gray-800 rounded-[3rem] p-12 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#6366f1] opacity-[0.02] blur-3xl -mr-32 -mt-32"></div>
            
            <div className="flex items-center justify-between mb-10">
               <h2 className="text-xl font-black flex items-center gap-4 italic uppercase tracking-tight">
                  <Type size={24} className="text-[#6366f1]" />
                  Global Educational Manuscript
               </h2>
               <div className="flex items-center gap-2 p-3 bg-green-500/5 border border-green-500/10 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[10px] font-black text-green-500 uppercase tracking-widest leading-none">Global Sync Active</span>
               </div>
            </div>
            
            <div className="space-y-8">
              <div className="bg-[#161b22] border border-gray-800 rounded-[2rem] overflow-hidden focus-within:border-[#6366f1] focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all shadow-inner">
                <div className="flex flex-wrap items-center gap-2 p-5 border-b border-gray-800 bg-black/20">
                  <button className="p-3 hover:bg-[#6366f1] hover:text-white rounded-xl transition-all text-gray-500"><Undo size={18} /></button>
                  <button className="p-3 hover:bg-[#6366f1] hover:text-white rounded-xl transition-all text-gray-400"><Redo size={18} /></button>
                  <div className="w-[1px] h-6 bg-gray-800 mx-3"></div>
                  <button className="w-12 h-12 flex items-center justify-center bg-[#6366f1] text-white rounded-xl font-black text-lg shadow-lg shadow-indigo-500/20">B</button>
                  <button className="w-12 h-12 flex items-center justify-center hover:bg-gray-800 rounded-xl transition-all text-gray-400 italic font-serif">I</button>
                  <div className="w-[1px] h-6 bg-gray-800 mx-3"></div>
                  <button className="p-3 hover:bg-gray-800 rounded-xl transition-all text-gray-400"><AlignLeft size={18} /></button>
                  <button className="p-3 hover:bg-gray-800 rounded-xl transition-all text-gray-400"><List size={18} /></button>
                  <button className="p-3 hover:bg-gray-800 rounded-xl transition-all text-gray-400"><ImageIcon size={18} /></button>
                  <button className="p-3 hover:bg-gray-800 rounded-xl transition-all text-gray-400"><LinkIcon size={18} /></button>
                </div>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-12 text-xl font-bold outline-none min-h-[500px] text-gray-300 bg-transparent placeholder:text-gray-800 leading-relaxed font-sans"
                  placeholder="Begin sculpting the global educational narrative..."
                />
              </div>

              <div className="grid grid-cols-2 gap-8 pt-6">
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] ml-2">Display Hierarchy</label>
                  <select className="w-full bg-[#161b22] border border-gray-800 rounded-2xl p-6 text-sm font-black text-white outline-none appearance-none focus:border-[#6366f1] transition-all cursor-pointer shadow-lg">
                    {[...Array(10)].map((_, i) => (
                      <option key={i+1} value={i+1} className="bg-[#0d1117]">Logic Level {i+1}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] ml-2">Global Indexing</label>
                  <div className="p-6 bg-[#6366f1]/5 border border-indigo-500/10 rounded-2xl flex items-center justify-between">
                     <span className="text-xs font-black text-[#6366f1] uppercase tracking-[0.1em]">Verified Repository Node</span>
                     <Zap size={16} className="text-[#6366f1] fill-[#6366f1]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-4 space-y-12">
           <div className="bg-black rounded-[3rem] p-10 border border-gray-900 shadow-3xl">
              <div className="flex items-center gap-3 mb-10">
                 <div className="w-2 h-2 rounded-full bg-[#6366f1]"></div>
                 <h2 className="text-white text-[10px] font-black uppercase tracking-[0.3em]">Live Global Preview</h2>
              </div>
              
              <div className="aspect-[9/18] bg-[#0d1117] rounded-[2.5rem] overflow-hidden relative border border-gray-800 flex flex-col group/preview">
                <div className="h-2/5 bg-[#161b22] flex items-center justify-center relative group-hover/preview:scale-105 transition-transform duration-700">
                   <Video size={64} className="text-[#6366f1] opacity-10" />
                </div>
                <div className="flex-1 bg-gradient-to-b from-[#161b22] to-[#0d1117] p-10 flex flex-col justify-end border-t border-gray-800 shadow-inner">
                  <div className="w-12 h-1 bg-[#6366f1] rounded-full mb-6"></div>
                  <h3 className="text-white font-black text-3xl mb-3 tracking-tight italic leading-tight uppercase">{title}</h3>
                  <p className="text-gray-500 text-sm font-bold leading-relaxed line-clamp-4 italic">
                    {description || 'System waiting for educational payload...'}
                  </p>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
