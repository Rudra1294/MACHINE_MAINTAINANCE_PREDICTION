import axios from 'axios';

const USE_MOCK = true;
const API_BASE = 'http://localhost:3000/api';

const client = axios.create({ baseURL: API_BASE });

const allMachinesCatalog = [
  { machine_id: 101, product_id: 'L47180', type: 'L', air_temp: 298.1, process_temp: 308.6, rotational_speed: 1551, torque: 42.8, tool_wear: 12, failure_cause: 'None (Healthy Ops)' },
  { machine_id: 102, product_id: 'M14860', type: 'M', air_temp: 302.5, process_temp: 311.2, rotational_speed: 1380, torque: 68.4, tool_wear: 215, failure_cause: 'Tool Wear Failure (TWF)' },
  { machine_id: 103, product_id: 'H29420', type: 'H', air_temp: 297.9, process_temp: 307.8, rotational_speed: 1420, torque: 50.1, tool_wear: 88, failure_cause: 'None (Healthy Ops)' },
  { machine_id: 104, product_id: 'L47181', type: 'L', air_temp: 300.2, process_temp: 309.5, rotational_speed: 1610, torque: 38.2, tool_wear: 190, failure_cause: 'Heat Dissipation Failure (HDF)' },
  { machine_id: 105, product_id: 'M14861', type: 'M', air_temp: 301.8, process_temp: 310.9, rotational_speed: 1290, torque: 72.5, tool_wear: 230, failure_cause: 'Overstrain Failure (OSF)' }
];

const activeMaintenanceCatalog = [
  {
    machine_id: 106,
    product_id: 'L47182',
    type: 'L',
    technician: 'Tech-01 (Hydraulics Specialist)',
    reason: 'Tool Wear Failure (TWF)',
    started_at: '09:30 AM IST',
    est_completion: '17:00 PM IST',
    status: 'IN_PROGRESS',
    scheduled_date: 'Aug 09, 2026',
    time_slot: '09:30 - 17:00 IST'
  },
  {
    machine_id: 107,
    product_id: 'H29421',
    type: 'H',
    technician: 'Tech-03 (Electrical Specialist)',
    reason: 'Power Failure (PWF)',
    started_at: '11:15 AM IST',
    est_completion: '18:30 PM IST',
    status: 'IN_PROGRESS',
    scheduled_date: 'Aug 09, 2026',
    time_slot: '11:15 - 18:30 IST'
  }
];

const historyCatalog = [
  {
    machine_id: 100,
    product_id: 'L47179',
    reason: 'Heat Dissipation Failure (HDF)',
    technician: 'Tech-02 (Thermal Specialist)',
    completed_date: 'Aug 07, 2026',
    duration: '2.5 Hours',
    cost_savings: '$3,800',
    status: 'COMPLETED'
  },
  {
    machine_id: 99,
    product_id: 'M14859',
    reason: 'Overstrain Failure (OSF)',
    technician: 'Tech-04 (Mechanical Expert)',
    completed_date: 'Aug 05, 2026',
    duration: '4.0 Hours',
    cost_savings: '$5,100',
    status: 'COMPLETED'
  }
];

const techniciansCatalog = [
  { tech_id: 'Tech-01', name: 'Tech-01 (Hydraulics Specialist)', specialty: 'Hydraulics Specialist', status: 'ON_JOB', assigned_unit: '106', shift: 'Shift 1 (08:00 - 16:00 IST)', phone: '+91 98123 45678', email: 'tech01.hydraulics@plant.com', tasks_completed: 18 },
  { tech_id: 'Tech-02', name: 'Tech-02 (Mechanical Expert)', specialty: 'Mechanical Expert', status: 'AVAILABLE', assigned_unit: 'Unassigned', shift: 'Shift 2 (16:00 - 00:00 IST)', phone: '+91 98234 56789', email: 'tech02.mechanical@plant.com', tasks_completed: 24 },
  { tech_id: 'Tech-03', name: 'Tech-03 (Electrical Specialist)', specialty: 'Electrical Specialist', status: 'ON_JOB', assigned_unit: '107', shift: 'Shift 1 (08:00 - 16:00 IST)', phone: '+91 98345 67890', email: 'tech03.electrical@plant.com', tasks_completed: 12 },
  { tech_id: 'Tech-04', name: 'Tech-04 (Tooling Specialist)', specialty: 'Tooling Specialist', status: 'AVAILABLE', assigned_unit: 'Unassigned', shift: 'Shift 2 (16:00 - 00:00 IST)', phone: '+91 98456 78901', email: 'tech04.tooling@plant.com', tasks_completed: 31 },
  { tech_id: 'Tech-05', name: 'Tech-05 (Vibration Expert)', specialty: 'Vibration Expert', status: 'OFF_DUTY', assigned_unit: 'Unassigned', shift: 'Shift 3 (00:00 - 08:00 IST)', phone: '+91 98567 89012', email: 'tech05.vibration@plant.com', tasks_completed: 9 }
];

export const apiService = {
  async registerAdmin(username, password) {
    if (USE_MOCK) return { qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/QuantumAdmin:phalguni?secret=JBSWY3DPEHPK3PXP&issuer=QuantumAdmin' };
    const res = await client.post('/admin/register', { username, password });
    return res.data;
  },

  async loginAdmin(username, password, otp) {
    if (USE_MOCK) return { token: 'mock-jwt-bearer-token-12345' };
    const res = await client.post('/admin/login', { username, password, otp });
    return res.data;
  },

  async getAllMachines() {
    if (USE_MOCK) return allMachinesCatalog;
    const res = await client.get('/diagnostic/machines');
    return res.data;
  },

  async getActiveMaintenance() {
    if (USE_MOCK) return activeMaintenanceCatalog;
    const res = await client.get('/diagnostic/maintenance');
    return res.data;
  },

  async getMaintenanceHistory() {
    if (USE_MOCK) return historyCatalog;
    const res = await client.get('/diagnostic/history');
    return res.data;
  },

  async getTechnicians() {
    if (USE_MOCK) return techniciansCatalog;
    const res = await client.get('/diagnostic/technicians');
    return res.data;
  },

  async runDiagnostic(machineIds = []) {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 1200));
      
      const targetMachines = machineIds.length === 0 
        ? allMachinesCatalog 
        : allMachinesCatalog.filter(m => machineIds.includes(m.machine_id));

      const predictions = targetMachines.map(m => {
        const isFailure = m.tool_wear > 200 || m.torque > 65 || m.failure_cause !== 'None (Healthy Ops)';
        return {
          machine_id: m.machine_id,
          prediction: isFailure ? 1 : 0,
          status: isFailure ? 'FAILURE_RISK' : 'HEALTHY',
          failure_cause: isFailure ? m.failure_cause : 'Optimal Operational Parameters'
        };
      });

      const failures = predictions.filter(p => p.status === 'FAILURE_RISK');

      return {
        status: 'success',
        total_scanned: targetMachines.length,
        total_failures_detected: failures.length,
        telemetry: targetMachines,
        predictions: predictions,
        qaoa_schedule: failures.map((f, idx) => ({
          machine_id: f.machine_id,
          action: 'SCHEDULE_TODAY',
          priority: idx + 1,
          failure_cause: f.failure_cause,
          time_slot: idx === 0 ? '14:00 - 16:00 IST' : '16:30 - 18:30 IST',
          technician: idx === 0 ? 'Tech-04 (Tooling Specialist)' : 'Tech-02 (Mechanical Expert)',
          estimated_cost_savings: idx === 0 ? '$4,200' : '$2,850',
          downtime_reduction: idx === 0 ? '28.5%' : '19.2%',
          status: 'PENDING_DISPATCH'
        }))
      };
    }
    const res = await client.post('/diagnostic/run-diagnostic', { machineIds });
    return res.data;
  }
};