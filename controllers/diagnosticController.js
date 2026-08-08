const axios = require('axios');
const MachineLog = require('../models/MachineLog');
const MaintenanceSchedule = require('../models/MaintenanceSchedule');

const runDiagnostic = async (req, res) => {
  try {
    const { machineIds } = req.body;

    const machines = await MachineLog.find({ udi: { $in: machineIds } });

    if (!machines.length) {
      return res.status(404).json({ status: 'error', message: 'No machinery logs found' });
    }

    const pythonServiceUrl = process.env.PYTHON_SERVICE_URL;
    const pythonResponse = await axios.post(pythonServiceUrl, { machines });
    
    const { predictions, qaoa_schedule } = pythonResponse.data;

    const scheduleRecords = predictions.map(pred => {
      const scheduleItem = qaoa_schedule.find(item => item.machine_id === pred.machine_id);
      return {
        machineId: pred.machine_id,
        status: pred.status,
        prediction: pred.prediction,
        action: scheduleItem ? scheduleItem.action : 'MONITOR'
      };
    });

    await MaintenanceSchedule.insertMany(scheduleRecords);

    return res.status(200).json(pythonResponse.data);

  } catch (error) {
    console.error('Diagnostic Controller Error:', error.message);
    return res.status(500).json({ status: 'error', message: 'Internal pipeline failure' });
  }
};

module.exports = {
  runDiagnostic
};