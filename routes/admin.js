const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyToken = require('../middleware/authMiddleware');

// Public Routes
router.post('/register', adminController.registerAdmin);
router.post('/login', adminController.loginAdmin);

// Protected CRUD Routes (Requires JWT Token in headers)
router.get('/all', verifyToken, adminController.getAllAdmins);
router.delete('/:id', verifyToken, adminController.deleteAdmin);

module.exports = router;