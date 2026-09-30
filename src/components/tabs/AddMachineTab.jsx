import React, { useState } from 'react';
import { PlusCircle, Cpu, Thermometer, Gauge, Layers, Wrench, CheckCircle2 } from 'lucide-react';

export default function AddMachineTab({ onAddMachine }) {
  const [formData, setFormData] = useState({
    machine_id: '',
    product_id: '',
    type: 'L',
    air_temp: '',
    process_temp: '',
    rotational_speed: '',
    torque: '',
    tool_wear: '',
    failure_cause: 'None (Healthy Ops)'
  });

  const [notification, setNotification] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newMachine = {
      machine_id: parseInt(formData.machine_id),
      product_id: formData.product_id.trim().toUpperCase(),
      type: formData.type,
      air_temp: parseFloat(formData.air_temp),
      process_temp: parseFloat(formData.process_temp),
      rotational_speed: parseInt(formData.rotational_speed),
      torque: parseFloat(formData.torque),
      tool_wear: parseInt(formData.tool_wear),
      failure_cause: formData.failure_cause
    };

    onAddMachine(newMachine);

    setNotification(`Machine #${newMachine.machine_id} registered and onboarded successfully!`);
    
    // Reset form
    setFormData({
      machine_id: '',
      product_id: '',
      type: 'L',
      air_temp: '',
      process_temp: '',
      rotational_speed: '',
      torque: '',
      tool_wear: '',
      failure_cause: 'None (Healthy Ops)'
    });

    setTimeout(() => setNotification(''), 3500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {notification && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-semibold">{notification}</span>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-xl">
        <div className="border-b border-slate-800 pb-4 flex items-center space-x-3">
          <PlusCircle className="w-6 h-6 text-indigo-400" />
          <div>
            <h2 className="text-base font-bold text-slate-100">Manual Machinery Onboarding</h2>
            <p className="text-xs text-slate-400">
              Input new machine sensor telemetry to include in real-time QSVM diagnostics and QAOA schedules.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Identification */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Machine ID (Numeric)
              </label>
              <input
                type="number"
                name="machine_id"
                required
                placeholder="e.g. 106"
                value={formData.machine_id}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Product ID
              </label>
              <input
                type="text"
                name="product_id"
                required
                placeholder="e.g. M14862"
                value={formData.product_id}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Machine Type / Quality Variant
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              >
                <option value="L">L (Low - 50% variants)</option>
                <option value="M">M (Medium - 30% variants)</option>
                <option value="H">H (High - 20% variants)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Temperatures */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" /> Air Temperature [K]
              </label>
              <input
                type="number"
                step="0.1"
                name="air_temp"
                required
                placeholder="e.g. 298.5"
                value={formData.air_temp}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-rose-400" /> Process Temperature [K]
              </label>
              <input
                type="number"
                step="0.1"
                name="process_temp"
                required
                placeholder="e.g. 308.7"
                value={formData.process_temp}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 3: Kinematic and Wear Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-cyan-400" /> Rotational Speed [rpm]
              </label>
              <input
                type="number"
                name="rotational_speed"
                required
                placeholder="e.g. 1500"
                value={formData.rotational_speed}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" /> Torque [Nm]
              </label>
              <input
                type="number"
                step="0.1"
                name="torque"
                required
                placeholder="e.g. 45.2"
                value={formData.torque}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-amber-400" /> Tool Wear [min]
              </label>
              <input
                type="number"
                name="tool_wear"
                required
                placeholder="e.g. 75"
                value={formData.tool_wear}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 4: Initial Status / Failure Mode */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
              Initial Baseline Operational State
            </label>
            <select
              name="failure_cause"
              value={formData.failure_cause}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="None (Healthy Ops)">None (Healthy Ops)</option>
              <option value="Tool Wear Failure (TWF)">Tool Wear Failure (TWF)</option>
              <option value="Heat Dissipation Failure (HDF)">Heat Dissipation Failure (HDF)</option>
              <option value="Power Failure (PWF)">Power Failure (PWF)</option>
              <option value="Overstrain Failure (OSF)">Overstrain Failure (OSF)</option>
              <option value="Random Failure (RNF)">Random Failure (RNF)</option>
            </select>
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg text-xs font-semibold transition flex items-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <PlusCircle className="w-4 h-4" /> Add Unit to Inventory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}