import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  Wrench, 
  ShieldCheck, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  Copy,
  Check
} from 'lucide-react';

export default function TechniciansTab({ technicians, setTechnicians }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedTechId, setCopiedTechId] = useState(null);

  const [newTech, setNewTech] = useState({ 
    name: '', 
    specialty: 'Mechanical Specialist', 
    shift: 'Shift 1 (08:00 - 16:00 IST)',
    phone: '',
    email: ''
  });

  // Copy phone number to clipboard with visual feedback
  const handleCopyPhone = (techId, phone) => {
    navigator.clipboard.writeText(phone);
    setCopiedTechId(techId);
    setTimeout(() => {
      setCopiedTechId(null);
    }, 2000);
  };

  // Filter technicians based on search and status dropdown
  const filteredTechnicians = technicians.filter(tech => {
    const matchesSearch = tech.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tech.tech_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tech.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (tech.email && tech.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (tech.phone && tech.phone.includes(searchTerm));
    const matchesStatus = statusFilter === 'ALL' || tech.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (techId, newStatus) => {
    setTechnicians(prev => prev.map(t => 
      t.tech_id === techId ? { ...t, status: newStatus } : t
    ));
  };

  const handleAddTechnician = (e) => {
    e.preventDefault();
    const generatedId = `Tech-0${technicians.length + 1}`;
    const createdTech = {
      tech_id: generatedId,
      name: newTech.name,
      specialty: newTech.specialty,
      status: 'AVAILABLE',
      assigned_unit: 'Unassigned',
      shift: newTech.shift,
      phone: newTech.phone || '+91 98765 43210',
      email: newTech.email || `tech0${technicians.length + 1}@plantmaintenance.com`,
      tasks_completed: 0
    };
    setTechnicians(prev => [...prev, createdTech]);
    setNewTech({ name: '', specialty: 'Mechanical Specialist', shift: 'Shift 1 (08:00 - 16:00 IST)', phone: '', email: '' });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Metrics Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-3">
          <Users className="w-8 h-8 text-indigo-400 p-1.5 bg-indigo-500/10 rounded-lg" />
          <div>
            <p className="text-xs text-slate-400">Total Workforce</p>
            <p className="text-xl font-bold text-slate-100 font-mono">{technicians.length} Technicians</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-3">
          <UserCheck className="w-8 h-8 text-emerald-400 p-1.5 bg-emerald-500/10 rounded-lg" />
          <div>
            <p className="text-xs text-slate-400">Available / On-Call</p>
            <p className="text-xl font-bold text-emerald-400 font-mono">
              {technicians.filter(t => t.status === 'AVAILABLE').length} Active
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-3">
          <Wrench className="w-8 h-8 text-amber-400 p-1.5 bg-amber-500/10 rounded-lg" />
          <div>
            <p className="text-xs text-slate-400">Deployed on Field</p>
            <p className="text-xl font-bold text-amber-400 font-mono">
              {technicians.filter(t => t.status === 'ON_JOB').length} In Repair
            </p>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
              Technician Workforce Directory
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search Tech ID, Name, Phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="AVAILABLE">Available</option>
                <option value="ON_JOB">On Job</option>
                <option value="OFF_DUTY">Off Duty</option>
              </select>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Specialist
            </button>
          </div>
        </div>

        {/* Directory Listing */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="p-3">Tech ID</th>
                <th className="p-3">Specialist Name</th>
                <th className="p-3">Domain</th>
                <th className="p-3">Shift Slot</th>
                <th className="p-3">Assigned Unit</th>
                <th className="p-3">Workforce Status</th>
                <th className="p-3">Quick Contact</th>
                <th className="p-3">Status Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredTechnicians.map((tech) => {
                const phone = tech.phone || '+91 98765 43210';
                const email = tech.email || `${tech.tech_id.toLowerCase()}@plantmaintenance.com`;
                const mailtoUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(`[Quantum Maintenance] Urgent Intervention - Unit Assignment`)}`;
                const isCopied = copiedTechId === tech.tech_id;

                return (
                  <tr key={tech.tech_id} className="hover:bg-slate-950/50 transition">
                    <td className="p-3 font-bold text-indigo-400">{tech.tech_id}</td>
                    <td className="p-3 font-semibold text-slate-100">{tech.name}</td>
                    <td className="p-3 text-slate-300">{tech.specialty}</td>
                    <td className="p-3 text-slate-400">{tech.shift}</td>
                    <td className="p-3 font-mono text-amber-400">
                      {tech.assigned_unit && tech.assigned_unit !== 'Unassigned' ? `#${tech.assigned_unit}` : 'Unassigned'}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase flex items-center gap-1 w-max ${
                        tech.status === 'AVAILABLE' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                        tech.status === 'ON_JOB' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                        'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {tech.status === 'AVAILABLE' && <CheckCircle2 className="w-3 h-3" />}
                        {tech.status === 'ON_JOB' && <Clock className="w-3 h-3 animate-spin" />}
                        {tech.status === 'OFF_DUTY' && <AlertCircle className="w-3 h-3" />}
                        {tech.status}
                      </span>
                    </td>

                    {/* Contact Actions (Click-to-Copy Phone & Gmail Draft) */}
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {/* Copy Phone Number Button */}
                        <button
                          onClick={() => handleCopyPhone(tech.tech_id, phone)}
                          title={`Click to copy ${phone}`}
                          className={`p-1.5 rounded-md border transition flex items-center gap-1 text-[11px] ${
                            isCopied 
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                              : 'bg-slate-800 hover:bg-emerald-600/30 hover:border-emerald-500/50 text-emerald-400 border-slate-700'
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span className="font-semibold text-emerald-300">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Phone className="w-3.5 h-3.5 shrink-0" />
                              <span className="hidden xl:inline">{phone}</span>
                              <Copy className="w-3 h-3 opacity-60 ml-0.5 shrink-0" />
                            </>
                          )}
                        </button>

                        {/* Open Gmail Draft Directly */}
                        <a
                          href={mailtoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`Email ${tech.name} (${email})`}
                          className="p-1.5 rounded-md bg-slate-800 hover:bg-indigo-600/30 hover:border-indigo-500/50 text-indigo-300 border border-slate-700 transition flex items-center gap-1 text-[11px]"
                        >
                          <Mail className="w-3.5 h-3.5 shrink-0" />
                          <span className="hidden xl:inline">Email</span>
                        </a>
                      </div>
                    </td>

                    <td className="p-3">
                      <select
                        value={tech.status}
                        onChange={(e) => handleStatusChange(tech.tech_id, e.target.value)}
                        className="bg-slate-900 border border-slate-800 text-slate-300 rounded px-2 py-1 text-[11px] focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="AVAILABLE">Set Available</option>
                        <option value="ON_JOB">Set On Job</option>
                        <option value="OFF_DUTY">Set Off Duty</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Specialist Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-200">Register New Specialist</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>

            <form onSubmit={handleAddTechnician} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Specialist Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Kumar"
                  value={newTech.name}
                  onChange={(e) => setNewTech({ ...newTech, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={newTech.phone}
                    onChange={(e) => setNewTech({ ...newTech, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Email ID</label>
                  <input
                    type="email"
                    placeholder="rajesh@plant.com"
                    value={newTech.email}
                    onChange={(e) => setNewTech({ ...newTech, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Primary Domain / Specialty</label>
                <select
                  value={newTech.specialty}
                  onChange={(e) => setNewTech({ ...newTech, specialty: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Hydraulics Specialist">Hydraulics Specialist</option>
                  <option value="Electrical Specialist">Electrical Specialist</option>
                  <option value="Mechanical Expert">Mechanical Expert</option>
                  <option value="Tooling Specialist">Tooling Specialist</option>
                  <option value="Vibration Expert">Vibration Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Shift Slot Assignment</label>
                <select
                  value={newTech.shift}
                  onChange={(e) => setNewTech({ ...newTech, shift: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Shift 1 (08:00 - 16:00 IST)">Shift 1 (08:00 - 16:00 IST)</option>
                  <option value="Shift 2 (16:00 - 00:00 IST)">Shift 2 (16:00 - 00:00 IST)</option>
                  <option value="Shift 3 (00:00 - 08:00 IST)">Shift 3 (00:00 - 08:00 IST)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition"
                >
                  Save Specialist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}