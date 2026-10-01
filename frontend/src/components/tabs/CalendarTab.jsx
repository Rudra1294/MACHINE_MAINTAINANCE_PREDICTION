import React from 'react';
import { CalendarDays } from 'lucide-react';

export default function CalendarTab({ maintenanceQueue }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <h2 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-indigo-400" /> Plant Maintenance Timetable & Schedule
        </h2>
        <span className="text-xs px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
          August 2026 Schedule
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
            <tr>
              <th className="p-3">Machine ID</th>
              <th className="p-3">Scheduled Date</th>
              <th className="p-3">Time Window</th>
              <th className="p-3">Reason / Cause</th>
              <th className="p-3">Assigned Specialist</th>
              <th className="p-3">Current Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {maintenanceQueue.map((item) => (
              <tr key={item.machine_id} className="hover:bg-slate-950/50 transition">
                <td className="p-3 font-bold text-amber-400">#{item.machine_id}</td>
                <td className="p-3 text-slate-300">{item.scheduled_date || 'Aug 09, 2026'}</td>
                <td className="p-3 text-indigo-300 font-semibold">{item.time_slot || `${item.started_at} - ${item.est_completion}`}</td>
                <td className="p-3 text-rose-300 font-semibold">{item.reason}</td>
                <td className="p-3 text-slate-200">{item.technician}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${
                    item.status === 'DISPATCHED' ? 'bg-sky-500/20 text-sky-400 border-sky-500/30' :
                    item.status === 'IN_PROGRESS' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
            <tr className="hover:bg-slate-950/50">
              <td className="p-3 font-bold text-sky-400">#108</td>
              <td className="p-3 text-slate-300">Aug 10, 2026</td>
              <td className="p-3 text-indigo-300 font-semibold">10:00 - 12:00 IST</td>
              <td className="p-3 text-rose-300 font-semibold">Random Failure (RNF)</td>
              <td className="p-3 text-slate-200">Tech-05 (Vibration Expert)</td>
              <td className="p-3">
                <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold">
                  SCHEDULED
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}