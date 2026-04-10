"use client";

import { X, AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "warning";
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  variant = "danger"
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onCancel}
      ></div>

      {/* Modal Card */}
      <div className="relative bg-[#0d1117] border border-gray-800 w-full max-w-md rounded-[2.5rem] p-10 shadow-3xl animate-in zoom-in-95 fade-in duration-300 ease-out overflow-hidden">
        {/* Decorative background element */}
        <div className={`absolute top-0 right-0 w-32 h-32 opacity-[0.05] blur-3xl -mr-16 -mt-16 ${variant === 'danger' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
        
        <div className="flex flex-col items-center text-center">
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-8 border ${
            variant === 'danger' 
              ? 'bg-red-500/10 border-red-500/20 text-red-500 shadow-lg shadow-red-500/10' 
              : 'bg-amber-500/10 border-amber-500/20 text-amber-500 shadow-lg shadow-amber-500/10'
          }`}>
            <AlertTriangle size={40} strokeWidth={2.5} />
          </div>

          <h2 className="text-2xl font-black text-white mb-4 tracking-tight uppercase italic">{title}</h2>
          <p className="text-gray-500 font-bold leading-relaxed italic mb-10">"{message}"</p>

          <div className="flex flex-col w-full gap-4">
            <button
              onClick={onConfirm}
              className={`w-full py-5 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-2xl ${
                variant === 'danger'
                  ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-500/20'
                  : 'bg-amber-600 text-white hover:bg-amber-700 shadow-amber-500/20'
              }`}
            >
              {confirmLabel}
            </button>
            <button
              onClick={onCancel}
              className="w-full py-5 rounded-2xl font-black text-sm text-gray-400 hover:text-white hover:bg-gray-800 border border-transparent hover:border-gray-700 transition-all active:scale-95"
            >
              {cancelLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
