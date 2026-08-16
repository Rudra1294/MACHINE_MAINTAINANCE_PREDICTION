const axios = require('axios');
const MachineLog = require('../models/MachineLog');
const MaintenanceSchedule = require('../models/MaintenanceSchedule');

const runDiagnostic = async (req, res) => {
  try {
    const { machineIds } = req.body;

    console.log('=================================');
    console.log('DIAGNOSTIC REQUEST');
    console.log('Machine IDs:', machineIds);

    if (!Array.isArray(machineIds) || machineIds.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'machineIds must be a non-empty array'
      });
    }

    // Find machines in MongoDB
    const machines = await MachineLog.find({
      udi: { $in: machineIds.map(Number) }
    }).lean();

    console.log('Machines found in MongoDB:', machines.length);

    if (!machines.length) {
      return res.status(404).json({
        status: 'error',
        message: 'No machinery logs found for selected machine IDs',
        requestedMachineIds: machineIds
      });
    }

    // Convert MongoDB format to Python API format
    const pythonMachines = machines.map(machine => ({
      machine_id: String(machine.udi),
      type: machine.type,
      air_temperature: Number(machine.airTemperatureK),
      process_temperature: Number(machine.processTemperatureK),
      rotational_speed: Number(machine.rotationalSpeedRPM),
      torque: Number(machine.torqueNm),
      tool_wear: Number(machine.toolWearMin)
    }));

    console.log('Sending machines to Python:');
    console.log(pythonMachines);

    const pythonServiceUrl =
      process.env.PYTHON_SERVICE_URL ||
      'http://127.0.0.1:8000/api/predict_and_schedule';

    console.log('Python URL:', pythonServiceUrl);

    // Call Python microservice
    const pythonResponse = await axios.post(
      pythonServiceUrl,
      {
        machines: pythonMachines,
        available_technicians: []
      },
      {
        timeout: 120000
      }
    );

    console.log('Python response:', pythonResponse.data);

    const {
      predictions = [],
      milp_schedule = []
    } = pythonResponse.data;

    // Save diagnostic results
    const scheduleRecords = predictions.map(pred => {
      const scheduleItem = milp_schedule.find(
        item => String(item.machine_id) === String(pred.machine_id)
      );

      return {
        machineId: Number(pred.machine_id),
        status: pred.status,
        prediction: pred.prediction,
        action: scheduleItem
          ? scheduleItem.action
          : 'MONITOR'
      };
    });

    if (scheduleRecords.length > 0) {
      await MaintenanceSchedule.insertMany(scheduleRecords);
    }

    console.log('Diagnostic completed successfully');
    console.log('=================================');

    return res.status(200).json({
      ...pythonResponse.data,
      saved_records: scheduleRecords.length
    });

  } catch (error) {
    console.error('=================================');
    console.error('DIAGNOSTIC ERROR');

    if (error.response) {
      console.error('Python status:', error.response.status);
      console.error('Python response:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }

    console.error('=================================');

    return res.status(500).json({
      status: 'error',
      message: 'Internal pipeline failure',
      error: error.response?.data?.detail || error.message
    });
  }
};

module.exports = {
  runDiagnostic
};