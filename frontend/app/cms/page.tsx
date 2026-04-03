"use client";

import React, { useState, useEffect } from "react";
import { 
  getSyllabusTree, 
  updateSubtopicContent, 
  updateTopicContent,
  createSubject,
  createTopic,
  createSubtopic,
  deleteSubject,
  deleteTopic,
  deleteSubtopic
} from "@/lib/api";
import { Paper, Subject, Topic, Subtopic } from "@/types";
import { 
  Save, 
  BookOpen, 
  Languages, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ChevronRight,
  LayoutDashboard,
  Plus,
  Trash2,
  X
} from "lucide-react";

export default function CMSPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Selection state
  const [selectedPaper, setSelectedPaper] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>("");

  // Content state
  const [contentEn, setContentEn] = useState("");
  const [contentTe, setContentTe] = useState("");

  // CRUD UI state
  const [addingType, setAddingType] = useState<"subject" | "topic" | "subtopic" | null>(null);
  const [newItemName, setNewItemName] = useState("");
  const [crudLoading, setCrudLoading] = useState(false);

  const refreshSyllabus = async () => {
    try {
      const data = await getSyllabusTree("Group_II");
      setPapers(data);
    } catch (err) {
      setError("Failed to refresh syllabus.");
    }
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      await refreshSyllabus();
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleSave = async () => {
    const targetId = selectedSubtopic || selectedTopic;
    if (!targetId || !contentEn) {
      setError("Please select a topic/subtopic and provide English content.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      if (selectedSubtopic) {
        await updateSubtopicContent(selectedSubtopic, contentEn, contentTe);
      } else {
        await updateTopicContent(selectedTopic, contentEn, contentTe);
      }
      setSuccess("Content updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to update content. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItemName) return;
    setCrudLoading(true);
    try {
      if (addingType === "subject" && selectedPaper) {
        await createSubject(newItemName, selectedPaper);
      } else if (addingType === "topic" && selectedSubject) {
        await createTopic(newItemName, selectedSubject);
      } else if (addingType === "subtopic" && selectedTopic) {
        await createSubtopic(newItemName, selectedTopic);
      }
      setNewItemName("");
      setAddingType(null);
      await refreshSyllabus();
      setSuccess(`New ${addingType} added successfully!`);
    } catch (err) {
      setError("Failed to add new item.");
    } finally {
      setCrudLoading(false);
    }
  };

  const handleDeleteItem = async (type: "subject" | "topic" | "subtopic", id: string) => {
    if (!confirm(`Are you sure you want to delete this ${type}? This will delete all child content.`)) return;
    setCrudLoading(true);
    try {
      if (type === "subject") {
        await deleteSubject(id);
        setSelectedSubject("");
      } else if (type === "topic") {
        await deleteTopic(id);
        setSelectedTopic("");
      } else if (type === "subtopic") {
        await deleteSubtopic(id);
        setSelectedSubtopic("");
      }
      await refreshSyllabus();
      setSuccess(`${type} deleted successfully.`);
    } catch (err) {
      setError("Failed to delete item.");
    } finally {
      setCrudLoading(false);
    }
  };

  // Helper to find selected items
  const currentPaper = papers.find(p => p.id === selectedPaper);
  const currentSubject = currentPaper?.subjects.find(s => s.id === selectedSubject);
  const currentTopic = currentSubject?.topics.find(t => t.id === selectedTopic);
  const currentSubtopic = currentTopic?.subtopics.find(st => st.id === selectedSubtopic);

  // Update content when selection changes
  useEffect(() => {
    const target = currentSubtopic || currentTopic;
    if (target && target.concepts && target.concepts.length > 0) {
      setContentEn(target.concepts[0].content || "");
      setContentTe(target.concepts[0].content_telugu || "");
    } else {
      setContentEn("");
      setContentTe("");
    }
  }, [selectedSubtopic, selectedTopic, currentSubtopic, currentTopic]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="text-xl font-medium text-slate-300">Loading CMS Architecture...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1e293b]/80 backdrop-blur-md border-b border-slate-700/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Content Mastery CMS
            </h1>
          </div>
          
          <button
            onClick={handleSave}
            disabled={saving || (!selectedSubtopic && !selectedTopic)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
              saving || !selectedSubtopic
                ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 hover:scale-105 active:scale-95"
            }`}
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? "Publishing..." : "Publish Content"}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Selection Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#1e293b] rounded-2xl border border-slate-700/50 p-6 shadow-xl">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-blue-400">
              <BookOpen className="w-5 h-5" />
              Syllabus Selection
            </h2>
            
            <div className="space-y-6">
              {/* Paper Select */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Paper</label>
                <div className="flex gap-2">
                  <select 
                    value={selectedPaper}
                    onChange={(e) => {
                      setSelectedPaper(e.target.value);
                      setSelectedSubject("");
                      setSelectedTopic("");
                      setSelectedSubtopic("");
                    }}
                    className="flex-1 bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none"
                  >
                    <option value="">Select Paper</option>
                    {papers.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                  </select>
                </div>
              </div>

              {/* Subject Select */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-400">Subject</label>
                  {selectedPaper && (
                    <button 
                      onClick={() => setAddingType(addingType === "subject" ? null : "subject")}
                      className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      {addingType === "subject" ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      {addingType === "subject" ? "Cancel" : "Add Subject"}
                    </button>
                  )}
                </div>
                {addingType === "subject" ? (
                  <div className="flex gap-2">
                    <input 
                      autoFocus
                      placeholder="Subject Title..."
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="flex-1 bg-[#0f172a] border border-blue-500/50 rounded-xl px-4 py-3 focus:outline-none"
                    />
                    <button 
                      onClick={handleAddItem}
                      disabled={crudLoading || !newItemName}
                      className="bg-blue-600 px-4 rounded-xl hover:bg-blue-500 disabled:opacity-50"
                    >
                      {crudLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <select 
                      value={selectedSubject}
                      disabled={!selectedPaper}
                      onChange={(e) => {
                        setSelectedSubject(e.target.value);
                        setSelectedTopic("");
                        setSelectedSubtopic("");
                      }}
                      className="flex-1 bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select Subject</option>
                      {currentPaper?.subjects.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                    </select>
                    {selectedSubject && (
                      <button 
                        onClick={() => handleDeleteItem("subject", selectedSubject)}
                        className="p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Topic Select */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-400">Topic</label>
                  {selectedSubject && (
                    <button 
                      onClick={() => setAddingType(addingType === "topic" ? null : "topic")}
                      className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      {addingType === "topic" ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      {addingType === "topic" ? "Cancel" : "Add Topic"}
                    </button>
                  )}
                </div>
                {addingType === "topic" ? (
                  <div className="flex gap-2">
                    <input 
                      autoFocus
                      placeholder="Topic Title..."
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="flex-1 bg-[#0f172a] border border-blue-500/50 rounded-xl px-4 py-3 focus:outline-none"
                    />
                    <button 
                      onClick={handleAddItem}
                      disabled={crudLoading || !newItemName}
                      className="bg-blue-600 px-4 rounded-xl hover:bg-blue-500 disabled:opacity-50"
                    >
                      {crudLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <select 
                      value={selectedTopic}
                      disabled={!selectedSubject}
                      onChange={(e) => {
                        setSelectedTopic(e.target.value);
                        setSelectedSubtopic("");
                      }}
                      className="flex-1 bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select Topic</option>
                      {currentSubject?.topics.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                    </select>
                    {selectedTopic && (
                      <button 
                        onClick={() => handleDeleteItem("topic", selectedTopic)}
                        className="p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Subtopic Select */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-400">Subtopic (Optional)</label>
                  {selectedTopic && (
                    <button 
                      onClick={() => setAddingType(addingType === "subtopic" ? null : "subtopic")}
                      className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      {addingType === "subtopic" ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      {addingType === "subtopic" ? "Cancel" : "Add Subtopic"}
                    </button>
                  )}
                </div>
                {addingType === "subtopic" ? (
                  <div className="flex gap-2">
                    <input 
                      autoFocus
                      placeholder="Subtopic Title..."
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="flex-1 bg-[#0f172a] border border-blue-500/50 rounded-xl px-4 py-3 focus:outline-none"
                    />
                    <button 
                      onClick={handleAddItem}
                      disabled={crudLoading || !newItemName}
                      className="bg-blue-600 px-4 rounded-xl hover:bg-blue-500 disabled:opacity-50"
                    >
                      {crudLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <select 
                      value={selectedSubtopic}
                      disabled={!selectedTopic}
                      onChange={(e) => setSelectedSubtopic(e.target.value)}
                      className="flex-1 bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select Subtopic</option>
                      {currentTopic?.subtopics.map(st => <option key={st.id} value={st.id}>{st.title}</option>)}
                    </select>
                    {selectedSubtopic && (
                      <button 
                        onClick={() => handleDeleteItem("subtopic", selectedSubtopic)}
                        className="p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {(selectedSubtopic || selectedTopic) && (
              <div className="mt-8 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <p className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">Target ID</p>
                <p className="text-sm font-mono text-slate-200">{selectedSubtopic || selectedTopic}</p>
              </div>
            )}
          </div>

          {/* Feedback Area */}
          {(error || success) && (
            <div className={`p-4 rounded-2xl border flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${
              error ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            }`}>
              {error ? <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />}
              <p className="text-sm font-medium leading-relaxed">{error || success}</p>
            </div>
          )}
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#1e293b] rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl">
            <div className="flex border-b border-slate-700/50 px-6 py-4 bg-slate-800/30 justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="bg-indigo-500/20 p-1.5 rounded-lg">
                  <Languages className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="font-bold text-slate-100">Bilingual Content Editor</h3>
              </div>
              {currentSubtopic && (
                <div className="text-sm font-medium text-slate-400 italic">
                  Editing: {currentSubtopic.title}
                </div>
              )}
            </div>

            <div className="p-8 space-y-8">
              {/* English Editor */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold uppercase tracking-widest text-slate-500">English Content (Markdown)</label>
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-md font-mono">en-US</span>
                </div>
                <textarea
                  value={contentEn}
                  onChange={(e) => setContentEn(e.target.value)}
                  placeholder="Paste textbook-style English content here... (Supports Markdown)"
                  className="w-full h-80 bg-[#0f172a] border border-slate-700 rounded-2xl p-6 font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none shadow-inner"
                />
              </div>

              {/* Telugu Editor */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold uppercase tracking-widest text-slate-500">Telugu Content (Markdown)</label>
                  <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-md font-mono">te-IN</span>
                </div>
                <textarea
                  value={contentTe}
                  onChange={(e) => setContentTe(e.target.value)}
                  placeholder="Telugu content here... (తెలుగులో కంటెంట్)"
                  className="w-full h-80 bg-[#0f172a] border border-slate-700 rounded-2xl p-6 font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none shadow-inner"
                />
              </div>
            </div>
            
            <div className="bg-slate-800/30 px-8 py-6 border-t border-slate-700/50 flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving || (!selectedSubtopic && !selectedTopic)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3 px-8 rounded-2xl font-bold shadow-xl shadow-blue-900/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving && <Loader2 className="w-5 h-5 animate-spin" />}
                Publish Phase
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
