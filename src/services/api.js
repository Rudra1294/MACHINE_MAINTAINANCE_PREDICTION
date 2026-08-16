import axios from 'axios';

const USE_MOCK = false;

// Node.js backend
const API_BASE = 'http://localhost:3000/api';

// Python FastAPI microservice
const PYTHON_API = 'http://127.0.0.1:8000';

const client = axios.create({
  baseURL: API_BASE
});


// ============================================================
// MACHINE CATALOG
// ============================================================

const allMachinesCatalog = [
  {
    machine_id: 101,
    product_id: 'L47180',
    type: 'L',
    air_temp: 298.1,
    process_temp: 308.6,
    rotational_speed: 1551,
    torque: 42.8,
    tool_wear: 12,
    failure_cause: 'None (Healthy Ops)'
  },
  {
    machine_id: 102,
    product_id: 'M14860',
    type: 'M',
    air_temp: 302.5,
    process_temp: 311.2,
    rotational_speed: 1380,
    torque: 68.4,
    tool_wear: 215,
    failure_cause: 'Tool Wear Failure (TWF)'
  },
  {
    machine_id: 103,
    product_id: 'H29420',
    type: 'H',
    air_temp: 297.9,
    process_temp: 307.8,
    rotational_speed: 1420,
    torque: 50.1,
    tool_wear: 88,
    failure_cause: 'None (Healthy Ops)'
  },
  {
    machine_id: 104,
    product_id: 'L47181',
    type: 'L',
    air_temp: 300.2,
    process_temp: 309.5,
    rotational_speed: 1610,
    torque: 38.2,
    tool_wear: 190,
    failure_cause: 'Heat Dissipation Failure (HDF)'
  },
  {
    machine_id: 105,
    product_id: 'M14861',
    type: 'M',
    air_temp: 301.8,
    process_temp: 310.9,
    rotational_speed: 1290,
    torque: 72.5,
    tool_wear: 230,
    failure_cause: 'Overstrain Failure (OSF)'
  }
];


// ============================================================
// ACTIVE MAINTENANCE
// ============================================================

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


// ============================================================
// HISTORY
// ============================================================

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


// ============================================================
// TECHNICIANS
// ============================================================

const techniciansCatalog = [
  {
    tech_id: 'Tech-01',
    name: 'Tech-01 (Hydraulics Specialist)',
    specialty: 'Hydraulics Specialist',
    status: 'ON_JOB',
    assigned_unit: '106',
    shift: 'Shift 1 (08:00 - 16:00 IST)',
    phone: '+91 98123 45678',
    email: 'tech01.hydraulics@plant.com',
    tasks_completed: 18
  },
  {
    tech_id: 'Tech-02',
    name: 'Tech-02 (Mechanical Expert)',
    specialty: 'Mechanical Expert',
    status: 'AVAILABLE',
    assigned_unit: 'Unassigned',
    shift: 'Shift 2 (16:00 - 00:00 IST)',
    phone: '+91 98234 56789',
    email: 'tech02.mechanical@plant.com',
    tasks_completed: 24
  },
  {
    tech_id: 'Tech-03',
    name: 'Tech-03 (Electrical Specialist)',
    specialty: 'Electrical Specialist',
    status: 'ON_JOB',
    assigned_unit: '107',
    shift: 'Shift 1 (08:00 - 16:00 IST)',
    phone: '+91 98345 67890',
    email: 'tech03.electrical@plant.com',
    tasks_completed: 12
  },
  {
    tech_id: 'Tech-04',
    name: 'Tech-04 (Tooling Specialist)',
    specialty: 'Tooling Specialist',
    status: 'AVAILABLE',
    assigned_unit: 'Unassigned',
    shift: 'Shift 2 (16:00 - 00:00 IST)',
    phone: '+91 98456 78901',
    email: 'tech04.tooling@plant.com',
    tasks_completed: 31
  },
  {
    tech_id: 'Tech-05',
    name: 'Tech-05 (Vibration Expert)',
    specialty: 'Vibration Expert',
    status: 'OFF_DUTY',
    assigned_unit: 'Unassigned',
    shift: 'Shift 3 (00:00 - 08:00 IST)',
    phone: '+91 98567 89012',
    email: 'tech05.vibration@plant.com',
    tasks_completed: 9
  }
];


// ============================================================
// API SERVICE
// ============================================================

export const apiService = {

  // ----------------------------------------------------------
  // ADMIN REGISTER
  // ----------------------------------------------------------

  async registerAdmin(username, password) {

    if (USE_MOCK) {
      return {
        qrCode:
          'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/QuantumAdmin:phalguni?secret=JBSWY3DPEHPK3PXP&issuer=QuantumAdmin'
      };
    }

    const res = await client.post(
      '/admin/register',
      {
        username,
        password
      }
    );

    return res.data;
  },


  // ----------------------------------------------------------
  // ADMIN LOGIN
  // ----------------------------------------------------------

  async loginAdmin(username, password, otp) {

    if (USE_MOCK) {
      return {
        token: 'mock-jwt-bearer-token-12345'
      };
    }

    const res = await client.post(
      '/admin/login',
      {
        username,
        password,
        otp
      }
    );

    return res.data;
  },


  // ----------------------------------------------------------
  // GET ALL MACHINES
  // ----------------------------------------------------------

  async getAllMachines() {

    if (USE_MOCK) {
      return allMachinesCatalog;
    }

    try {

      const res = await client.get('/diagnostic/machines');

      return res.data;

    } catch (error) {

      console.warn(
        'Node machine API unavailable. Using local machine catalog.'
      );

      return allMachinesCatalog;
    }
  },


  // ----------------------------------------------------------
  // GET ACTIVE MAINTENANCE
  // ----------------------------------------------------------

  async getActiveMaintenance() {

    if (USE_MOCK) {
      return activeMaintenanceCatalog;
    }

    try {

      const res = await client.get('/diagnostic/maintenance');

      return res.data;

    } catch (error) {

      console.warn(
        'Node maintenance API unavailable. Using local maintenance catalog.'
      );

      return activeMaintenanceCatalog;
    }
  },


  // ----------------------------------------------------------
  // GET MAINTENANCE HISTORY
  // ----------------------------------------------------------

  async getMaintenanceHistory() {

    if (USE_MOCK) {
      return historyCatalog;
    }

    try {

      const res = await client.get('/diagnostic/history');

      return res.data;

    } catch (error) {

      console.warn(
        'Node history API unavailable. Using local history catalog.'
      );

      return historyCatalog;
    }
  },


  // ----------------------------------------------------------
  // GET TECHNICIANS
  // ----------------------------------------------------------

  async getTechnicians() {

    if (USE_MOCK) {
      return techniciansCatalog;
    }

    try {

      const res = await client.get('/diagnostic/technicians');

      return res.data;

    } catch (error) {

      console.warn(
        'Node technician API unavailable. Using local technician catalog.'
      );

      return techniciansCatalog;
    }
  },


  // ==========================================================
  // RUN DIAGNOSTIC
  // ==========================================================

  async runDiagnostic(machineIds = []) {

    console.log(
      'Running diagnostic for machine IDs:',
      machineIds
    );


    // --------------------------------------------------------
    // MOCK MODE
    // --------------------------------------------------------

    if (USE_MOCK) {

      await new Promise(
        resolve => setTimeout(resolve, 1200)
      );

      const targetMachines =
        machineIds.length === 0
          ? allMachinesCatalog
          : allMachinesCatalog.filter(
              machine =>
                machineIds.includes(machine.machine_id)
            );


      const predictions =
        targetMachines.map(machine => {

          const isFailure =
            machine.tool_wear > 200 ||
            machine.torque > 65 ||
            machine.failure_cause !== 'None (Healthy Ops)';

          return {
            machine_id: machine.machine_id,
            prediction: isFailure ? 1 : 0,
            status: isFailure
              ? 'FAILURE_RISK'
              : 'HEALTHY',
            failure_cause: isFailure
              ? machine.failure_cause
              : 'Optimal Operational Parameters'
          };
        });


      const failures =
        predictions.filter(
          prediction =>
            prediction.status === 'FAILURE_RISK'
        );


      return {
        status: 'success',
        total_scanned: targetMachines.length,
        total_failures_detected: failures.length,
        telemetry: targetMachines,
        predictions: predictions,

        qaoa_schedule:
          failures.map((failure, index) => ({
            machine_id: failure.machine_id,
            action: 'SCHEDULE_TODAY',
            priority: index + 1,
            failure_cause: failure.failure_cause,
            time_slot:
              index === 0
                ? '14:00 - 16:00 IST'
                : '16:30 - 18:30 IST',
            technician:
              index === 0
                ? 'Tech-04 (Tooling Specialist)'
                : 'Tech-02 (Mechanical Expert)',
            estimated_cost_savings:
              index === 0
                ? '$4,200'
                : '$2,850',
            downtime_reduction:
              index === 0
                ? '28.5%'
                : '19.2%',
            status: 'PENDING_DISPATCH'
          }))
      };
    }


    // ========================================================
    // REAL FASTAPI BACKEND
    // ========================================================

    const targetMachines =
      machineIds.length === 0
        ? allMachinesCatalog
        : allMachinesCatalog.filter(
            machine =>
              machineIds.includes(machine.machine_id)
          );


    // --------------------------------------------------------
    // Convert React machine format to FastAPI format
    // --------------------------------------------------------

    const machines =
      targetMachines.map(machine => ({
        machine_id: String(machine.machine_id),

        type: machine.type,

        air_temperature:
          Number(machine.air_temp),

        process_temperature:
          Number(machine.process_temp),

        rotational_speed:
          Number(machine.rotational_speed),

        torque:
          Number(machine.torque),

        tool_wear:
          Number(machine.tool_wear)
      }));


    // --------------------------------------------------------
    // Available technicians
    // --------------------------------------------------------

    const availableTechnicians =
      techniciansCatalog
        .filter(
          technician =>
            technician.status === 'AVAILABLE'
        )
        .map(
          technician => ({
            technician_id:
              technician.tech_id,

            specialty:
              technician.specialty
          })
        );


    // --------------------------------------------------------
    // FastAPI payload
    // --------------------------------------------------------

    const payload = {
      available_technicians:
        availableTechnicians,

      machines:
        machines
    };


    console.log(
      'Diagnostic payload:',
      payload
    );


    // ========================================================
    // IMPORTANT:
    // DIRECTLY CALL FASTAPI
    //
    // DO NOT USE:
    // client.post('/api/predict_and_schedule')
    //
    // because client points to localhost:3000
    // ========================================================

    try {

      const res = await axios.post(
        `${PYTHON_API}/api/predict_and_schedule`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 120000
        }
      );


      const data = res.data;


      console.log(
        'FastAPI diagnostic response:',
        data
      );


      // ------------------------------------------------------
      // Convert FastAPI schedule to React format
      // ------------------------------------------------------

      const qaoaSchedule =
        (data.milp_schedule || []).map(
          (item, index) => {

            const prediction =
              data.predictions?.find(
                p =>
                  String(p.machine_id) ===
                  String(item.machine_id)
              );


            return {
              machine_id:
                Number(item.machine_id),

              action:
                item.action ||
                'SCHEDULE_TODAY',

              priority:
                index + 1,

              failure_cause:
                prediction?.failure_cause ||
                'Failure Risk Detected',

              time_slot:
                `${9 + index}:00 - ${11 + index}:00 IST`,

              technician:
                item.assigned_technician ||
                'Unassigned',

              status:
                'PENDING_DISPATCH'
            };
          }
        );


      // ------------------------------------------------------
      // Final response for React
      // ------------------------------------------------------

      return {
        ...data,

        telemetry:
          targetMachines,

        qaoa_schedule:
          qaoaSchedule
      };


    } catch (error) {

      console.error(
        'FastAPI diagnostic error:',
        error
      );


      if (error.response) {

        console.error(
          'FastAPI status:',
          error.response.status
        );

        console.error(
          'FastAPI response:',
          error.response.data
        );

      } else if (error.request) {

        console.error(
          'FastAPI server did not respond.'
        );

      } else {

        console.error(
          'Request error:',
          error.message
        );
      }


      throw error;
    }
  }
};