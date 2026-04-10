"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ChevronLeft,
  Save,
  Type,
  Music,
  Trash2,
  Upload,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

import { API_URL } from "@/lib/constants";
import RichTextEditor from "@/components/RichTextEditor";
import { uploadFile } from "@/lib/upload";

export default function GlobalContentEditor() {
  const { subtopicId } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [contentTe, setContentTe] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  
  const audioInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${API_URL}/syllabus/subtopic/${subtopicId}`);
        const st = await res.json();
        
        if (st) {
          setTitle(st.title);
          if (st.concepts && st.concepts.length > 0 && st.concepts[0].modules) {
            const mods = st.concepts[0].modules;
            
            const enMod = mods.find((m: any) => m.type === "text" && m.lang === "en");
            const teMod = mods.find((m: any) => m.type === "text" && m.lang === "te");
            const audioMod = mods.find((m: any) => m.type === "audio");
            
            // Fallback for legacy data without lang tags
            if (enMod) setContentEn(enMod.content);
            else {
               const legacyMod = mods.find((m: any) => m.type === "text" && !m.lang);
               if (legacyMod) setContentEn(legacyMod.content);
            }
            
            if (teMod) setContentTe(teMod.content);
            if (audioMod) setAudioUrl(audioMod.url);
          }
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    fetchData();
  }, [subtopicId]);

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingAudio(true);
      try {
        const url = await uploadFile(file);
        setAudioUrl(url);
      } catch (err) {
        console.error("Audio upload failed", err);
      }
      setUploadingAudio(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    // Construct modules array with both languages and audio
    const updatedModules: any[] = [
      { type: "text", lang: "en", content: contentEn },
      { type: "text", lang: "te", content: contentTe }
    ];

    if (audioUrl) {
      updatedModules.push({ type: "audio", url: audioUrl });
    }

    try {
      await fetch(`${API_URL}/syllabus/subtopic/${subtopicId}/content`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modules: updatedModules })
      });
      router.back();
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-32">
       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6366f1]"></div>
    </div>
  );

  return (
    <div className="font-sans max-w-5xl mx-auto text-white pb-32">
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
        
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-[#6366f1] text-white px-10 py-5 rounded-2xl font-black text-sm shadow-2xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
        >
          {saving ? "Publishing Node..." : "Sync Changes"}
          <Save size={18} strokeWidth={3} />
        </button>
      </div>

      <div className="space-y-12">
        {/* English Editor */}
        <div className="bg-[#0d1117] border border-gray-800 rounded-[3rem] p-12 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#6366f1] opacity-[0.02] blur-3xl -mr-32 -mt-32"></div>
          
          <div className="flex items-center justify-between mb-10">
             <h2 className="text-xl font-black flex items-center gap-4 italic uppercase tracking-tight">
                <Type size={24} className="text-[#6366f1]" />
                English Content (UK/US Std)
             </h2>
             <span className="text-[10px] font-black py-1 px-4 bg-indigo-500/10 text-[#6366f1] rounded-full tracking-[0.2em] border border-indigo-500/10 uppercase">Primary Language</span>
          </div>
          
          <RichTextEditor 
            content={contentEn} 
            onChange={setContentEn} 
            placeholder="Write in English..." 
          />
        </div>

        {/* Telugu Editor */}
        <div className="bg-[#0d1117] border border-gray-800 rounded-[3rem] p-12 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 opacity-[0.02] blur-3xl -mr-32 -mt-32"></div>
          
          <div className="flex items-center justify-between mb-10">
             <h2 className="text-xl font-black flex items-center gap-4 italic uppercase tracking-tight text-orange-400">
                <Type size={24} />
                తెలుగు కంటెంట్ (Telugu)
             </h2>
             <span className="text-[10px] font-black py-1 px-4 bg-orange-500/10 text-orange-400 rounded-full tracking-[0.2em] border border-orange-500/10 uppercase">Regional Language</span>
          </div>
          
          <RichTextEditor 
            content={contentTe} 
            onChange={setContentTe} 
            placeholder="తెలుగులో వ్రాయండి..." 
          />
        </div>

        {/* Audio Upload */}
        <div className="bg-[#0d1117] border border-gray-800 rounded-[3rem] p-12 shadow-sm relative overflow-hidden">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black flex items-center gap-4 italic uppercase tracking-tight text-emerald-400">
                <Music size={24} />
                Audio Narrative Archive
              </h2>
           </div>

           <div className={`p-10 rounded-[2.5rem] border border-dashed transition-all flex flex-col items-center justify-center gap-6 ${
             audioUrl ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-gray-800 bg-black/10'
           }`}>
             {audioUrl ? (
               <>
                 <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
                    <CheckCircle2 size={32} />
                 </div>
                 <div className="text-center">
                    <p className="font-black text-xl text-emerald-400 mb-2 uppercase italic">Audio Narrative Active</p>
                    <p className="text-gray-500 font-bold text-sm truncate max-w-md italic">{audioUrl}</p>
                 </div>
                 <audio controls src={audioUrl} className="mt-4 appearance-none" />
                 <button 
                   onClick={() => setAudioUrl("")}
                   className="mt-4 text-red-500/60 hover:text-red-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
                 >
                   <Trash2 size={14} /> Remove Audio
                 </button>
               </>
             ) : (
               <>
                 <div className="w-20 h-20 rounded-[2rem] bg-[#161b22] border border-gray-800 flex items-center justify-center text-gray-700 animate-pulse">
                    <Music size={40} />
                 </div>
                 <div className="text-center">
                   <p className="text-gray-400 font-black text-lg mb-1 italic">No Audio Narrative Attached</p>
                   <p className="text-gray-600 font-bold text-xs uppercase tracking-widest">WAV / MP3 / M4A Supported</p>
                 </div>
                 <button 
                   onClick={() => audioInputRef.current?.click()}
                   disabled={uploadingAudio}
                   className="mt-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-8 py-4 rounded-2xl font-black text-sm hover:bg-emerald-500 hover:text-white transition-all shadow-lg active:scale-95"
                 >
                   {uploadingAudio ? "Uploading Archive..." : "Upload New Narrative"}
                 </button>
               </>
             )}
             <input 
               type="file" 
               ref={audioInputRef} 
               hidden 
               accept="audio/*" 
               onChange={handleAudioUpload} 
             />
           </div>
        </div>
      </div>
    </div>
  );
}
