import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  UserCheck, 
  Hammer, 
  Cpu, 
  Info 
} from 'lucide-react';

export default function DiagnosticsTab({ diagnosticResult, maintenanceQueue, handleDispatchTech }) {
  if (!diagnosticResult) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center space-y-3">
        <Cpu className="w-10 h-10 text-indigo-400 mx-auto" />
        <h3 className="text-base font-bold text-slate-200">No Diagnostic Executed Yet</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Select target machine IDs from the top control bar or click "Run All" to process Kaggle telemetry through the QSVM/QAOA quantum pipeline.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs text-slate-400">Total Scanned</p>
          <p className="text-xl font-bold text-slate-100">{diagnosticResult.total_scanned}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs text-slate-400">Failures Detected</p>
          <p className="text-xl font-bold text-rose-400">{diagnosticResult.total_failures_detected}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs text-slate-400">Pipeline Response</p>
          <p className="text-xl font-bold text-emerald-400 capitalize">{diagnosticResult.status}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QSVM PREDICTIONS */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> QSVM Predictions
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
              Quantum Kernel
            </span>
          </div>

          <div className="space-y-3">
            {diagnosticResult.predictions.map((item) => (
              <div key={item.machine_id} className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-slate-200">Machine #{item.machine_id}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1 ${item.status === 'FAILURE_RISK' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                    {item.status === 'FAILURE_RISK' && <AlertTriangle className="w-3 h-3" />}
                    {item.status}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs bg-slate-900 p-2 rounded border border-slate-800">
                  <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="text-slate-400 text-[11px]">Root Cause:</span>
                  <span className={`font-semibold text-[11px] ${item.status === 'FAILURE_RISK' ? 'text-rose-300' : 'text-emerald-300'}`}>
                    {item.failure_cause}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QAOA SCHEDULE */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" /> QAOA Optimized Schedule
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
              Combinatorial QAOA
            </span>
          </div>

          <div className="space-y-3">
            {diagnosticResult.qaoa_schedule.length > 0 ? (
              diagnosticResult.qaoa_schedule.map((item, idx) => {
                const maintenanceRecord = maintenanceQueue.find(m => m.machine_id === item.machine_id);
                const inMaintenance = !!maintenanceRecord;
                return (
                  <div key={item.machine_id} className={`p-3.5 rounded-xl border transition space-y-3 ${inMaintenance ? 'bg-amber-950/20 border-amber-500/40' : 'bg-slate-950 border-slate-800'}`}>
                    <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          Priority #{item.priority || idx + 1}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-200">
                          Machine #{item.machine_id}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDispatchTech(item)}
                        disabled={inMaintenance}
                        className={`text-xs px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition ${
                          inMaintenance 
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 cursor-not-allowed font-mono text-[10px]' 
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        }`}
                      >
                        {inMaintenance ? <Hammer className="w-3 h-3 animate-pulse" /> : <UserCheck className="w-3 h-3" />}
                        {inMaintenance ? `Repairing (${maintenanceRecord.status})` : 'Dispatch Tech'}
                      </button>
                    </div>

                    <div className="bg-rose-500/10 border border-rose-500/20 p-2 rounded text-xs flex justify-between">
                      <span className="text-slate-400">Target Reason:</span>
                      <span className="font-bold text-rose-300">{item.failure_cause}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-900/60 p-2 rounded border border-slate-800/80">
                        <span className="text-[10px] text-slate-500 block">Slot</span>
                        <span className="font-semibold text-slate-200 font-mono text-[11px]">{item.time_slot}</span>
                      </div>

                      <div className="bg-slate-900/60 p-2 rounded border border-slate-800/80">
                        <span className="text-[10px] text-slate-500 block">Specialist</span>
                        <span className="font-semibold text-slate-200 text-[11px]">{item.technician}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-500 text-center py-6">No active maintenance scheduling required.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}