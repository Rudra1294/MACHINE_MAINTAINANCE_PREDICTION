const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const crypto = require('crypto');
// --- AUTHENTICATION & 2FA ---

// 1. Register an Admin (and generate 2FA Secret)
const registerAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const secret = speakeasy.generateSecret({ name: `PredictiveApp (${username})` });

    const newAdmin = new Admin({
      username,
      password: hashedPassword,
      twoFactorSecret: secret.base32
    });

    await newAdmin.save();

    // Generate a QR code for Google Authenticator/Authy
    qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
      res.status(201).json({ 
        message: 'Admin created successfully. Please scan this QR code in your authenticator app.',
        qrCode: data_url 
      });
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Login (Verifies Password and OTP)
const loginAdmin = async (req, res) => {
  try {
    const { username, password, otp } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ message: 'Admin not found' });

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' });

    // Verify 2FA Token
    const verifiedOTP = speakeasy.totp.verify({
      secret: admin.twoFactorSecret,
      encoding: 'base32',
      token: otp
    });

    if (!verifiedOTP) {
      return res.status(400).json({ message: 'Invalid Two-Factor Authentication Code' });
    }

    // Generate JWT
    const token = jwt.sign({ _id: admin._id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.header('Authorization', token).json({ message: 'Logged in successfully', token });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- BASIC CRUD APIs (Protected) ---

// Get All Admins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password -twoFactorSecret');
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an Admin
const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await Admin.findByIdAndDelete(id);
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerAdmin, loginAdmin, getAllAdmins, deleteAdmin };