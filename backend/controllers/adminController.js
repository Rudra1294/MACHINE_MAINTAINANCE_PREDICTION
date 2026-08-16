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
// 2. Login (Verifies Password and OTP)
const loginAdmin = async (req, res) => {
  try {
    const { username, password, otp } = req.body;

    // Find admin
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(400).json({
        message: 'Admin not found'
      });
    }

    // Verify password
    const validPassword = await bcrypt.compare(
      password,
      admin.password
    );

    console.log("=================================");
    console.log("LOGIN USER:", username);
    console.log("PASSWORD VALID:", validPassword);
    console.log("OTP RECEIVED:", otp);
    console.log("OTP SECRET EXISTS:", !!admin.twoFactorSecret);

    if (!validPassword) {
      return res.status(400).json({
        message: 'Invalid credentials'
      });
    }

    // Check whether OTP secret exists
    if (!admin.twoFactorSecret) {
      return res.status(400).json({
        message: '2FA is not configured for this admin'
      });
    }

    // Clean OTP
    const cleanOTP = String(otp || '')
      .replace(/\s/g, '')
      .trim();

    // OTP must contain exactly 6 digits
    if (!/^\d{6}$/.test(cleanOTP)) {
      return res.status(400).json({
        message: 'OTP must be a 6-digit number'
      });
    }

    // Clean secret
    const cleanSecret = String(admin.twoFactorSecret)
      .replace(/\s/g, '')
      .trim()
      .toUpperCase();

    console.log("CLEAN OTP:", cleanOTP);
    console.log("SECRET LENGTH:", cleanSecret.length);

    // Verify Google Authenticator / Authenticator OTP
    const verifiedOTP = speakeasy.totp.verify({
      secret: cleanSecret,
      encoding: 'base32',
      token: cleanOTP,
      algorithm: 'sha1',
      step: 30,
      window: 2
    });

    console.log("OTP VERIFIED:", verifiedOTP);
    console.log("=================================");

    if (!verifiedOTP) {
      return res.status(400).json({
        message: 'Invalid credentials or OTP.'
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        _id: admin._id,
        username: admin.username
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    );

    res
      .header('Authorization', token)
      .json({
        message: 'Logged in successfully',
        token
      });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      error: error.message
    });
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