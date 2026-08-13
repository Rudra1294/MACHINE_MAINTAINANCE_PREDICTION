import React from 'react';
import { 
  Cpu, 
  LayoutDashboard, 
  Hammer, 
  Activity, 
  CalendarDays, 
  History, 
  Users,
  LogOut 
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  maintenanceCount, 
  registryCount, 
  historyCount,
  technicianCount,
  handleLogout 
}) {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 h-screen fixed top-0 left-0 flex flex-col justify-between p-4 z-20">
      <div className="space-y-6">
        {/* OptiMaintain Brand Logo */}
        <div className="flex items-center space-x-3 px-2 pt-2">
          <Cpu className="w-7 h-7 text-indigo-400 shrink-0" />
          <div>
            <span className="font-bold text-lg tracking-wide block leading-tight text-slate-100">
              OptiMaintain
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              QSVM + QAOA
            </span>
          </div>
        </div>

        <nav className="space-y-1.5 pt-4">
          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'diagnostics'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Diagnostics Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('maintenance')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'maintenance'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Hammer className="w-4 h-4" />
              <span>Under Maintenance</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
              {maintenanceCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('technicians')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'technicians'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Users className="w-4 h-4" />
              <span>Technicians</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
              {technicianCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('registry')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'registry'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/20'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Activity className="w-4 h-4" />
              <span>Registry (All Units)</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {registryCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'calendar'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Schedule Calendar</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'history'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              <History className="w-4 h-4" />
              <span>Maintenance History</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              {historyCount}
            </span>
          </button>
        </nav>
      </div>

      <div className="border-t border-slate-800 pt-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout Admin</span>
        </button>
      </div>
    </aside>
  );
}