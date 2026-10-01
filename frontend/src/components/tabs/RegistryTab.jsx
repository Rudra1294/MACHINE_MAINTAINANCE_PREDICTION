import React from 'react';
import { 
  Activity, 
  Hammer, 
  Thermometer, 
  Gauge, 
  Layers, 
  Wrench 
} from 'lucide-react';

export default function RegistryTab({ allMachines, maintenanceQueue, executeDiagnostic }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-sky-400" /> Plant Machinery Registry
        </h2>
        <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
          {allMachines.length} Units On-Grid
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {allMachines.map((item) => {
          const maintenanceItem = maintenanceQueue.find(m => m.machine_id === item.machine_id);
          return (
            <div key={item.machine_id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4 hover:border-slate-700 transition">
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
                <div>
                  <span className="font-mono font-bold text-indigo-400 text-sm">Machine ID: #{item.machine_id}</span>
                  <span className="text-xs text-slate-400 ml-2">({item.product_id})</span>
                </div>
                {maintenanceItem ? (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase flex items-center gap-1">
                    <Hammer className="w-3 h-3" /> {maintenanceItem.status}
                  </span>
                ) : (
                  <button
                    onClick={() => executeDiagnostic([item.machine_id])}
                    className="text-xs bg-slate-900 hover:bg-indigo-600/30 hover:border-indigo-500/50 text-indigo-300 px-2.5 py-1 rounded border border-slate-800 transition"
                  >
                    Diagnose Unit
                  </button>
                )}
              </div>

              <div className="bg-slate-900 p-2 rounded border border-slate-800 flex justify-between text-xs">
                <span className="text-slate-400">Baseline Failure Mode:</span>
                <span className={`font-semibold ${item.failure_cause !== 'None (Healthy Ops)' ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {item.failure_cause}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-amber-400 mb-1">
                    <Thermometer className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-semibold text-slate-300">Air Temp</span>
                  </div>
                  <p className="text-sm font-bold text-slate-100 font-mono">{item.air_temp} <span className="text-xs text-amber-400/80 font-normal">[K]</span></p>
                </div>

                <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-rose-400 mb-1">
                    <Thermometer className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-semibold text-slate-300">Process Temp</span>
                  </div>
                  <p className="text-sm font-bold text-slate-100 font-mono">{item.process_temp} <span className="text-xs text-rose-400/80 font-normal">[K]</span></p>
                </div>

                <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-cyan-400 mb-1">
                    <Gauge className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-semibold text-slate-300">Rotational Speed</span>
                  </div>
                  <p className="text-sm font-bold text-slate-100 font-mono">{item.rotational_speed} <span className="text-xs text-cyan-400/80 font-normal">[rpm]</span></p>
                </div>

                <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-indigo-400 mb-1">
                    <Layers className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-semibold text-slate-300">Torque</span>
                  </div>
                  <p className="text-sm font-bold text-slate-100 font-mono">{item.torque} <span className="text-xs text-indigo-400/80 font-normal">[Nm]</span></p>
                </div>

                <div className="col-span-2 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800/80 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5 text-amber-400">
                      <Wrench className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-semibold text-slate-300">Tool Wear</span>
                    </div>
                    <p className="text-xs font-bold text-slate-100 font-mono">{item.tool_wear} <span className="text-amber-400/80 font-normal">[min]</span></p>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className={`h-full transition-all duration-500 rounded-full ${item.tool_wear > 200 ? 'bg-rose-500' : 'bg-indigo-500'}`} 
                      style={{ width: `${Math.min((item.tool_wear / 250) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}