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
  CheckCircle2,
  Volume2
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
  const [audioEnUrl, setAudioEnUrl] = useState("");
  const [audioTeUrl, setAudioTeUrl] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAudioEn, setUploadingAudioEn] = useState(false);
  const [uploadingAudioTe, setUploadingAudioTe] = useState(false);
  
  const audioEnInputRef = useRef<HTMLInputElement>(null);
  const audioTeInputRef = useRef<HTMLInputElement>(null);

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
            const audioEn = mods.find((m: any) => m.type === "audio" && m.lang === "en");
            const audioTe = mods.find((m: any) => m.type === "audio" && m.lang === "te");
            
            // Fallback for legacy data
            if (enMod) setContentEn(enMod.content);
            else if (mods.find((m: any) => m.type === "text" && !m.lang)) {
               setContentEn(mods.find((m: any) => m.type === "text" && !m.lang).content);
            }
            
            if (teMod) setContentTe(teMod.content);
            if (audioEn) setAudioEnUrl(audioEn.url);
            else if (mods.find((m: any) => m.type === "audio" && !m.lang)) {
               setAudioEnUrl(mods.find((m: any) => m.type === "audio" && !m.lang).url);
            }
            
            if (audioTe) setAudioTeUrl(audioTe.url);
          }
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    fetchData();
  }, [subtopicId]);

  const handleAudioUpload = async (file: File, lang: 'en' | 'te') => {
    if (lang === 'en') setUploadingAudioEn(true);
    else setUploadingAudioTe(true);

    try {
      const url = await uploadFile(file);
      if (lang === 'en') setAudioEnUrl(url);
      else setAudioTeUrl(url);
    } catch (err) {
      console.error("Audio upload failed", err);
    }

    if (lang === 'en') setUploadingAudioEn(false);
    else setUploadingAudioTe(false);
  };

  const handleSave = async () => {
    setSaving(true);
    
    // Construct modules array with both languages and respective audio
    const updatedModules: any[] = [
      { type: "text", lang: "en", content: contentEn },
      { type: "text", lang: "te", content: contentTe }
    ];

    if (audioEnUrl) {
      updatedModules.push({ type: "audio", lang: "en", url: audioEnUrl });
    }
    if (audioTeUrl) {
      updatedModules.push({ type: "audio", lang: "te", url: audioTeUrl });
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

  const CompactAudioCard = ({ url, onClear, onUploadTrigger, uploading, label }: any) => (
    <div className={`mt-8 p-6 rounded-3xl border transition-all flex items-center justify-between gap-6 ${
      url ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-gray-800 bg-black/5'
    }`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
          url ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-[#161b22] border border-gray-800 text-gray-700'
        }`}>
          {url ? <Volume2 size={24} /> : <Music size={24} />}
        </div>
        <div>
          <p className={`font-black text-sm uppercase tracking-wider ${url ? 'text-emerald-400' : 'text-gray-600'}`}>
            {label} Audio Narrative
          </p>
          {url ? (
            <p className="text-[10px] text-gray-500 font-bold truncate max-w-xs">{url.split('/').pop()}</p>
          ) : (
            <p className="text-[10px] text-gray-800 font-bold uppercase tracking-widest italic">No archive attached</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {url && <audio src={url} controls className="h-8 max-w-[200px]" />}
        <button 
          onClick={url ? onClear : onUploadTrigger}
          disabled={uploading}
          className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
            url 
              ? 'text-red-500/50 hover:text-red-500 hover:bg-red-500/5 border border-transparent hover:border-red-500/10' 
              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white'
          }`}
        >
          {uploading ? "Uploading..." : url ? <Trash2 size={16} /> : "Upload Audio"}
        </button>
      </div>
    </div>
  );

  if (loading) return (
    <div className="font-sans max-w-5xl mx-auto text-white pb-32 animate-pulse">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-8">
           <div className="w-14 h-14 rounded-2xl bg-gray-800/50 border border-gray-800"></div>
           <div className="space-y-3">
              <div className="h-10 w-64 bg-gray-800/50 rounded-2xl"></div>
              <div className="h-3 w-48 bg-gray-800/30 rounded-lg"></div>
           </div>
        </div>
        <div className="h-16 w-48 bg-gray-800/50 rounded-2xl"></div>
      </div>
      <div className="space-y-16">
        {[1, 2].map(i => (
          <div key={i} className="bg-[#0d1117] border border-gray-800 rounded-[3rem] p-12 shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <div className="h-8 w-48 bg-gray-800/50 rounded-xl"></div>
              <div className="h-6 w-32 bg-gray-800/30 rounded-full"></div>
            </div>
            <div className="h-64 bg-gray-800/20 rounded-3xl mb-8"></div>
            <div className="h-24 bg-gray-800/10 rounded-3xl"></div>
          </div>
        ))}
      </div>
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

      <div className="space-y-16">
        {/* English Section */}
        <div className="bg-[#0d1117] border border-gray-800 rounded-[3rem] p-12 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#6366f1] opacity-[0.02] blur-3xl -mr-32 -mt-32"></div>
          
          <div className="flex items-center justify-between mb-10">
             <h2 className="text-xl font-black flex items-center gap-4 italic uppercase tracking-tight text-[#6366f1]">
                <Type size={24} />
                English Content
             </h2>
             <span className="text-[10px] font-black py-1 px-4 bg-indigo-500/10 text-[#6366f1] rounded-full tracking-[0.2em] border border-indigo-500/10 uppercase italic">Primary Manuscript</span>
          </div>
          
          <RichTextEditor 
            content={contentEn} 
            onChange={setContentEn} 
            placeholder="Write English narrative..." 
          />

          <CompactAudioCard 
            url={audioEnUrl} 
            label="English"
            onClear={() => setAudioEnUrl("")}
            onUploadTrigger={() => audioEnInputRef.current?.click()}
            uploading={uploadingAudioEn}
          />
          <input type="file" ref={audioEnInputRef} hidden accept="audio/*" onChange={(e) => e.target.files?.[0] && handleAudioUpload(e.target.files[0], 'en')} />
        </div>

        {/* Telugu Section */}
        <div className="bg-[#0d1117] border border-gray-800 rounded-[3rem] p-12 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 opacity-[0.02] blur-3xl -mr-32 -mt-32"></div>
          
          <div className="flex items-center justify-between mb-10">
             <h2 className="text-xl font-black flex items-center gap-4 italic uppercase tracking-tight text-orange-400">
                <Type size={24} />
                తెలుగు కంటెంట్
             </h2>
             <span className="text-[10px] font-black py-1 px-4 bg-orange-500/10 text-orange-400 rounded-full tracking-[0.2em] border border-orange-500/10 uppercase italic">Regional Manuscript</span>
          </div>
          
          <RichTextEditor 
            content={contentTe} 
            onChange={setContentTe} 
            placeholder="తెలుగు వివరణ రాయండి..." 
          />

          <CompactAudioCard 
            url={audioTeUrl} 
            label="Telugu"
            onClear={() => setAudioTeUrl("")}
            onUploadTrigger={() => audioTeInputRef.current?.click()}
            uploading={uploadingAudioTe}
          />
          <input type="file" ref={audioTeInputRef} hidden accept="audio/*" onChange={(e) => e.target.files?.[0] && handleAudioUpload(e.target.files[0], 'te')} />
        </div>
      </div>
    </div>
  );
}
