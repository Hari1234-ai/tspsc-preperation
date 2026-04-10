"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  Image as ImageIcon, 
  Video, 
  Undo, 
  Redo, 
  Link as LinkIcon 
} from "lucide-react";
import { uploadFile } from "@/lib/upload";
import { useRef } from "react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-2xl border border-gray-800 my-8 shadow-2xl',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#6366f1] underline font-bold',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Begin sculpting...',
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px] p-10 text-xl font-bold text-gray-300 leading-relaxed font-sans',
      },
    },
  });

  if (!editor) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await uploadFile(file);
        editor.chain().focus().setImage({ src: url }).run();
      } catch (err) {
        console.error("Upload failed", err);
      }
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await uploadFile(file);
        // Tiptap doesn't have a native video extension in starter kit, 
        // we'll insert a video tag as raw HTML or a placeholder.
        // For now, we'll insert code or just a link with a specific class if needed.
        // Better: Use editor.commands.insertContent
        editor.chain().focus().insertContent(`
          <div class="my-8 rounded-3xl overflow-hidden border border-gray-800 shadow-3xl bg-black">
            <video controls class="w-full aspect-video">
              <source src="${url}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </div>
          <p></p>
        `).run();
      } catch (err) {
        console.error("Upload failed", err);
      }
    }
  };

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-[2.5rem] overflow-hidden focus-within:border-[#6366f1] focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all shadow-inner">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-5 border-b border-gray-800 bg-black/20">
        <button 
          onClick={() => editor.chain().focus().undo().run()}
          className="p-3 hover:bg-[#6366f1] hover:text-white rounded-xl transition-all text-gray-500"
          title="Undo"
        >
          <Undo size={18} />
        </button>
        <button 
          onClick={() => editor.chain().focus().redo().run()}
          className="p-3 hover:bg-[#6366f1] hover:text-white rounded-xl transition-all text-gray-400"
          title="Redo"
        >
          <Redo size={18} />
        </button>
        
        <div className="w-[1px] h-6 bg-gray-800 mx-3"></div>
        
        <button 
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`w-12 h-12 flex items-center justify-center rounded-xl font-black text-lg transition-all ${
            editor.isActive('bold') ? 'bg-[#6366f1] text-white shadow-lg shadow-indigo-500/20' : 'hover:bg-gray-800 text-gray-400'
          }`}
          title="Bold"
        >
          B
        </button>
        <button 
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all italic font-serif ${
            editor.isActive('italic') ? 'bg-[#6366f1] text-white shadow-lg shadow-indigo-500/20' : 'hover:bg-gray-800 text-gray-400'
          }`}
          title="Italic"
        >
          I
        </button>
        <button 
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${
            editor.isActive('underline') ? 'bg-[#6366f1] text-white shadow-lg shadow-indigo-500/20' : 'hover:bg-gray-800 text-gray-400'
          }`}
          title="Underline"
        >
          <UnderlineIcon size={18} />
        </button>

        <div className="w-[1px] h-6 bg-gray-800 mx-3"></div>

        <button 
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-3 rounded-xl transition-all ${
            editor.isActive('bulletList') ? 'bg-[#6366f1] text-white' : 'hover:bg-gray-800 text-gray-400'
          }`}
          title="Bullet List"
        >
          <List size={18} />
        </button>

        <button 
          onClick={() => fileInputRef.current?.click()}
          className="p-3 hover:bg-gray-800 rounded-xl transition-all text-gray-400"
          title="Insert Image"
        >
          <ImageIcon size={18} />
        </button>
        <button 
          onClick={() => videoInputRef.current?.click()}
          className="p-3 hover:bg-gray-800 rounded-xl transition-all text-gray-400"
          title="Insert Video"
        >
          <Video size={18} />
        </button>

        <input 
          type="file" 
          ref={fileInputRef} 
          hidden 
          accept="image/*" 
          onChange={handleImageUpload} 
        />
        <input 
          type="file" 
          ref={videoInputRef} 
          hidden 
          accept="video/*" 
          onChange={handleVideoUpload} 
        />
      </div>

      {/* Editor Surface */}
      <EditorContent editor={editor} />
      
      <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #2d3748;
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  );
}
