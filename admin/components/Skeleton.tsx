"use client";

export function SkeletonCard() {
  return (
    <div className="bg-[#0d1117] border border-gray-800 p-10 rounded-[3rem] shadow-sm flex flex-col h-full animate-pulse">
      <div className="flex justify-between items-start mb-10">
        <div className="w-16 h-16 bg-gray-800/50 border border-gray-800 rounded-2xl"></div>
        <div className="w-10 h-10 rounded-xl bg-gray-800/50 border border-gray-800"></div>
      </div>
      
      <div className="h-8 bg-gray-800/50 rounded-xl w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-800/30 rounded-lg w-full mb-2"></div>
      <div className="h-4 bg-gray-800/30 rounded-lg w-2/3 mb-10"></div>
      
      <div className="mt-auto pt-8 border-t border-gray-900 flex items-center justify-between">
        <div className="h-3 bg-gray-800/50 rounded-lg w-16"></div>
        <div className="h-8 w-8 bg-gray-800/50 rounded-full"></div>
      </div>
    </div>
  );
}

export function SkeletonListRow() {
  return (
    <div className="bg-[#0d1117] border border-gray-800 p-10 rounded-[2.5rem] shadow-sm flex items-center animate-pulse">
      <div className="w-20 h-20 bg-gray-800/50 border border-gray-800 rounded-2xl shrink-0 mr-10"></div>
      <div className="flex-1 space-y-4">
        <div className="h-8 bg-gray-800/50 rounded-xl w-1/3"></div>
        <div className="h-4 bg-gray-800/30 rounded-lg w-1/2"></div>
        <div className="h-3 bg-gray-800/50 rounded-lg w-24"></div>
      </div>
      <div className="w-12 h-12 bg-gray-800/50 rounded-full ml-8"></div>
    </div>
  );
}
