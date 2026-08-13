import React, { useState, useEffect } from 'react';
import { apiService } from './services/api';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DatasetBanner from './components/DatasetBanner';

// Tab Components
import DiagnosticsTab from './components/tabs/DiagnosticsTab';
import MaintenanceTab from './components/tabs/MaintenanceTab';
import RegistryTab from './components/tabs/RegistryTab';
import CalendarTab from './components/tabs/CalendarTab';
import HistoryTab from './components/tabs/HistoryTab';
import TechniciansTab from './components/tabs/TechniciansTab';

import { AlertTriangle } from 'lucide-react';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('jwt_token') || '');
  const [view, setView] = useState(token ? 'dashboard' : 'login');
  const [activeTab, setActiveTab] = useState('diagnostics');
  
  // Auth Form States
  const [regData, setRegData] = useState({ username: '', password: '' });
  const [loginData, setLoginData] = useState({ username: '', password: '', otp: '' });
  const [qrCode, setQrCode] = useState('');
  
  // Dashboard Data States
  const [allMachines, setAllMachines] = useState([]);
  const [maintenanceQueue, setMaintenanceQueue] = useState([]);
  const [maintenanceHistory, setMaintenanceHistory] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [machineIdsInput, setMachineIdsInput] = useState('101, 102');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [diagnosticResult, setDiagnosticResult] = useState(null);

  useEffect(() => {
    if (token) {
      loadInitialData();
    }
  }, [token]);

  const loadInitialData = async () => {
    try {
      const [machines, maintenance, history, techs] = await Promise.all([
        apiService.getAllMachines(),
        apiService.getActiveMaintenance(),
        apiService.getMaintenanceHistory(),
        apiService.getTechnicians()
      ]);
      setAllMachines(machines);
      setMaintenanceQueue(maintenance);
      setMaintenanceHistory(history);
      setTechnicians(techs);
    } catch (err) {
      console.error('Failed to fetch initial data.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await apiService.registerAdmin(regData.username, regData.password);
      setQrCode(res.qrCode);
    } catch (err) {
      setError('Registration failed.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await apiService.loginAdmin(loginData.username, loginData.password, loginData.otp);
      localStorage.setItem('jwt_token', res.token);
      setToken(res.token);
      setView('dashboard');
    } catch (err) {
      setError('Invalid credentials or OTP.');
    }
  };

  const executeDiagnostic = async (targetIds = null) => {
    setLoading(true);
    setError('');

    let ids = [];
    if (targetIds === 'ALL') {
      ids = [];
    } else if (Array.isArray(targetIds)) {
      ids = targetIds;
    } else {
      ids = machineIdsInput
        .split(',')
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id));
    }

    try {
      const res = await apiService.runDiagnostic(ids);
      setDiagnosticResult(res);
      setActiveTab('diagnostics');
    } catch (err) {
      setError('Failed to execute quantum diagnostic.');
    } finally {
      setLoading(false);
    }
  };

  const handleDispatchTech = (item) => {
    if (maintenanceQueue.some(m => m.machine_id === item.machine_id)) return;

    const newMaintenanceRecord = {
      machine_id: item.machine_id,
      product_id: `M-${item.machine_id}`,
      type: 'Quantum QAOA Scheduled',
      technician: item.technician || 'Tech-04 (On-Call Specialist)',
      reason: item.failure_cause || 'Predicted Risk Neutralization',
      started_at: '14:00 PM IST',
      est_completion: '16:00 PM IST',
      status: 'DISPATCHED',
      scheduled_date: 'Aug 09, 2026',
      time_slot: item.time_slot || '14:00 - 16:00 IST'
    };

    setMaintenanceQueue(prev => [newMaintenanceRecord, ...prev]);
  };

  const updateMaintenanceStatus = (machineId, nextStatus) => {
    if (nextStatus === 'COMPLETED') {
      const completedItem = maintenanceQueue.find(m => m.machine_id === machineId);
      if (completedItem) {
        const historyRecord = {
          machine_id: completedItem.machine_id,
          product_id: completedItem.product_id,
          reason: completedItem.reason,
          technician: completedItem.technician,
          completed_date: 'Aug 09, 2026',
          duration: '2.0 Hours',
          cost_savings: '$4,200',
          status: 'COMPLETED'
        };
        setMaintenanceHistory(prev => [historyRecord, ...prev]);
      }
      setMaintenanceQueue(prev => prev.filter(m => m.machine_id !== machineId));
    } else {
      setMaintenanceQueue(prev => prev.map(m => 
        m.machine_id === machineId ? { ...m, status: nextStatus } : m
      ));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    setToken('');
    setView('login');
    setDiagnosticResult(null);
  };

  if (view !== 'dashboard') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-center items-center p-6">
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center space-x-3 max-w-md w-full">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
          <div className="flex border-b border-slate-800 mb-6">
            <button
              className={`flex-1 pb-3 text-sm font-medium border-b-2 transition ${view === 'login' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400'}`}
              onClick={() => { setView('login'); setError(''); }}
            >
              Admin Login
            </button>
            <button
              className={`flex-1 pb-3 text-sm font-medium border-b-2 transition ${view === 'register' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400'}`}
              onClick={() => { setView('register'); setError(''); }}
            >
              Register Admin
            </button>
          </div>

          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Username</label>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Password</label>
                <input
                  type="password"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">2FA Authenticator OTP</label>
                <input
                  type="text"
                  required
                  placeholder="6-digit code"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none tracking-widest text-center"
                  value={loginData.otp}
                  onChange={(e) => setLoginData({ ...loginData, otp: e.target.value })}
                />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded text-sm transition">
                Authenticate
              </button>
            </form>
          )}

          {view === 'register' && (
            <div>
              {!qrCode ? (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">New Username</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
                      value={regData.username}
                      onChange={(e) => setRegData({ ...regData, username: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
                      value={regData.password}
                      onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded text-sm transition">
                    Generate 2FA Credentials
                  </button>
                </form>
              ) : (
                <div className="text-center space-y-4">
                  <div className="p-3 bg-white rounded-lg inline-block mx-auto border border-slate-700">
                    <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
                  </div>
                  <p className="text-xs text-slate-400">Scan this QR code using Google Authenticator or Authy to configure 2FA.</p>
                  <button onClick={() => { setView('login'); setQrCode(''); }} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-2 rounded text-sm transition">
                    Proceed to Login
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex antialiased">
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        maintenanceCount={maintenanceQueue.length}
        registryCount={allMachines.length}
        historyCount={maintenanceHistory.length}
        technicianCount={technicians.length}
        handleLogout={handleLogout}
      />

      <div className="pl-64 flex-1 flex flex-col min-h-screen">
        <Header 
          activeTab={activeTab}
          machineIdsInput={machineIdsInput}
          setMachineIdsInput={setMachineIdsInput}
          executeDiagnostic={executeDiagnostic}
          loading={loading}
        />

        <main className="p-8 space-y-6 flex-1">
          {error && (
            <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-3">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <DatasetBanner />

          {activeTab === 'diagnostics' && (
            <DiagnosticsTab 
              diagnosticResult={diagnosticResult}
              maintenanceQueue={maintenanceQueue}
              handleDispatchTech={handleDispatchTech}
            />
          )}

          {activeTab === 'maintenance' && (
            <MaintenanceTab 
              maintenanceQueue={maintenanceQueue}
              updateMaintenanceStatus={updateMaintenanceStatus}
            />
          )}

          {activeTab === 'technicians' && (
            <TechniciansTab 
              technicians={technicians}
              setTechnicians={setTechnicians}
            />
          )}

          {activeTab === 'registry' && (
            <RegistryTab 
              allMachines={allMachines}
              maintenanceQueue={maintenanceQueue}
              executeDiagnostic={executeDiagnostic}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarTab 
              maintenanceQueue={maintenanceQueue}
            />
          )}

          {activeTab === 'history' && (
            <HistoryTab 
              maintenanceHistory={maintenanceHistory}
            />
          )}
        </main>
      </div>
    </div>
  );
}