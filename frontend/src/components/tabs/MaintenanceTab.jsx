import React from 'react';
import { Hammer, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function MaintenanceTab({ maintenanceQueue, updateMaintenanceStatus }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <h2 className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <Hammer className="w-4 h-4 text-amber-400" /> Active Maintenance Queue (Units Under Repair)
        </h2>
        <span className="text-xs px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono font-bold">
          {maintenanceQueue.length} Active Services
        </span>
      </div>

      {maintenanceQueue.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {maintenanceQueue.map((item) => (
            <div key={item.machine_id} className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="font-mono font-bold text-amber-400 text-sm">
                  Machine ID: #{item.machine_id}
                </span>
                
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded flex items-center gap-1 border ${
                  item.status === 'DISPATCHED' ? 'bg-sky-500/20 text-sky-400 border-sky-500/30' :
                  item.status === 'IN_PROGRESS' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                  'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                }`}>
                  <Clock className="w-3 h-3 animate-spin" /> {item.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between bg-rose-500/10 border border-rose-500/20 p-2 rounded">
                  <span className="text-slate-400 font-semibold">Service Cause / Reason:</span>
                  <span className="font-bold text-rose-300">{item.reason}</span>
                </div>
                <div className="flex justify-between px-1 pt-1">
                  <span className="text-slate-500">Assigned Tech:</span>
                  <span className="font-semibold text-indigo-300">{item.technician}</span>
                </div>
                <div className="flex justify-between px-1">
                  <span className="text-slate-500">Service Window:</span>
                  <span className="font-mono text-slate-400">{item.started_at} - {item.est_completion}</span>
                </div>
              </div>

              <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Update Status:</span>
                <div className="flex gap-1.5">
                  {item.status === 'DISPATCHED' && (
                    <button
                      onClick={() => updateMaintenanceStatus(item.machine_id, 'IN_PROGRESS')}
                      className="text-[10px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-2.5 py-1 rounded border border-amber-500/40 font-semibold flex items-center gap-1 transition"
                    >
                      Start Repair <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                  {item.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => updateMaintenanceStatus(item.machine_id, 'COMPLETED')}
                      className="text-[10px] bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 px-2.5 py-1 rounded border border-emerald-500/40 font-semibold flex items-center gap-1 transition"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Mark Resolved & Archive
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
          <p className="text-xs font-semibold text-slate-300">All Machinery Operational</p>
          <p className="text-[11px] text-slate-500">No units are currently undergoing active physical maintenance.</p>
        </div>
      )}
    </div>
  );
}