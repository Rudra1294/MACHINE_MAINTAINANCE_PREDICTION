import React from 'react';
import { Database } from 'lucide-react';

export default function DatasetBanner() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap justify-between items-center gap-4">
      <div className="flex items-center gap-3">
        <Database className="w-5 h-5 text-indigo-400" />
        <div>
          <h3 className="text-sm font-bold text-slate-200">AI4I 2020 Dataset Baseline</h3>
          <p className="text-xs text-slate-400">10,000 Total Machinery Observations</p>
        </div>
      </div>
      
      <div className="flex gap-4 text-xs font-mono">
        <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-emerald-400">
          <span className="text-slate-400 font-sans block text-[10px]">HEALTHY (0)</span>
          <span className="font-bold text-sm">9,661</span> (96.61%)
        </div>
        <div className="bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-lg text-rose-400">
          <span className="text-slate-400 font-sans block text-[10px]">FAILURES (1)</span>
          <span className="font-bold text-sm">339</span> (3.39%)
        </div>
      </div>
    </div>
  );
}