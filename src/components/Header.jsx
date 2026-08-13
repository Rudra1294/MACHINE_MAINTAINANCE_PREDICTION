import React from 'react';
import { Clock, Zap, Server } from 'lucide-react';

export default function Header({ 
  activeTab, 
  machineIdsInput, 
  setMachineIdsInput, 
  executeDiagnostic, 
  loading 
}) {
  // Add technicians key inside src/components/Header.jsx:
const titles = {
  diagnostics: 'Plant Maintenance Diagnostics',
  maintenance: 'Active Maintenance Queue',
  technicians: 'Technician Workforce & Resource Allocation',
  registry: 'Machinery Registry Catalog',
  calendar: 'Maintenance Calendar & Timetable',
  history: 'Completed Maintenance History Log'
};

const subtitles = {
  diagnostics: 'Trigger Node.js → Flask API pipeline to process Kaggle telemetry through QSVM & QAOA.',
  maintenance: 'Units currently shut down or undergoing physical technician repair.',
  technicians: 'Manage plant engineers, duty shifts, domain specialties, and active field assignments.',
  registry: 'Complete inventory of all 10,000 dataset observations and real-time parameters.',
  calendar: 'Schedule matrix for preventive maintenance slots and assigned specialists.',
  history: 'Historical archive of resolved machinery failures and preventative service logs.'
};

  return (
    <header className="sticky top-0 bg-slate-950/80 backdrop-blur border-b border-slate-800 px-8 py-4 flex justify-between items-center z-10">
      <div>
        <h1 className="text-lg font-bold text-slate-100 capitalize">
          {titles[activeTab]}
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          {subtitles[activeTab]}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="text"
          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none w-36"
          placeholder="e.g. 101, 102"
          value={machineIdsInput}
          onChange={(e) => setMachineIdsInput(e.target.value)}
        />
        
        <button
          onClick={() => executeDiagnostic()}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white px-3 py-1.5 rounded-lg font-medium text-xs transition flex items-center gap-1.5 shrink-0"
        >
          {loading ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 fill-current" />}
          Run Selected
        </button>

        <button
          onClick={() => executeDiagnostic('ALL')}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white px-3 py-1.5 rounded-lg font-medium text-xs transition flex items-center gap-1.5 shrink-0"
        >
          <Server className="w-3.5 h-3.5" />
          Run All
        </button>
      </div>
    </header>
  );
}