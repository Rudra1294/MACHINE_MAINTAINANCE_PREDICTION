import React from 'react';
import { History } from 'lucide-react';

export default function HistoryTab({ maintenanceHistory }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <h2 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-400" /> Completed Maintenance Interventions Archive
        </h2>
        <span className="text-xs px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
          {maintenanceHistory.length} Total Interventions Recorded
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
            <tr>
              <th className="p-3">Machine ID</th>
              <th className="p-3">Product Variant</th>
              <th className="p-3">Resolved Reason</th>
              <th className="p-3">Assigned Specialist</th>
              <th className="p-3">Completion Date</th>
              <th className="p-3">Repair Duration</th>
              <th className="p-3">Cost Savings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {maintenanceHistory.map((item, idx) => (
              <tr key={`${item.machine_id}-${idx}`} className="hover:bg-slate-950/50 transition">
                <td className="p-3 font-bold text-indigo-400">#{item.machine_id}</td>
                <td className="p-3 text-slate-400">{item.product_id}</td>
                <td className="p-3 text-slate-200 font-semibold">{item.reason}</td>
                <td className="p-3 text-slate-300">{item.technician}</td>
                <td className="p-3 text-slate-400">{item.completed_date}</td>
                <td className="p-3 text-slate-300">{item.duration}</td>
                <td className="p-3 font-bold text-emerald-400">{item.cost_savings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}