const express = require('express');
const router = express.Router();
const diagnosticController = require('../controllers/diagnosticController');

router.post('/run-diagnostic', diagnosticController.runDiagnostic);

module.exports = router;