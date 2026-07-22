import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import emailjs from '@emailjs/nodejs';
import validator from 'validator';

const sendOtpEmail = async (name, email, otp) => {
  try {
    const serviceId = process.env.EMAILJS_SERVICE_ID || 'service_test';
    const templateId = process.env.EMAILJS_TEMPLATE_ID || 'template_test';
    const publicKey = process.env.EMAILJS_PUBLIC_KEY || 'publicKey_test';

    const options = { publicKey };
    if (process.env.EMAILJS_PRIVATE_KEY) {
      options.privateKey = process.env.EMAILJS_PRIVATE_KEY;
    }

    await emailjs.send(
      serviceId,
      templateId,
      {
        user_name: name,
        email: email,
        otp: otp,
      },
      options
    );
    console.log(`EmailJS: OTP email sent successfully to ${email}`);
  } catch (err) {
    console.error('EmailJS: OTP email send failed:', err.message || err);
  }
};

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Validate strong password
    if (!validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character' 
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const userRole = role === 'admin' ? 'admin' : 'patient';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
      isVerified: false,
      otp,
      otpExpires,
    });

    // Send OTP Email
    await sendOtpEmail(user.name, user.email, otp);

    res.status(201).json({
      success: true,
      requiresOtp: true,
      email: user.email,
      message: 'Registration successful. An OTP has been sent to your email for account verification.',
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message || 'Server error, failed to register user' });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({ message: 'Please provide email and OTP code' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Account is already verified' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP code' });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP code has expired' });
    }

    // Mark user as verified
    user.isVerified = true;
    user.otp = '';
    user.otpExpires = undefined;
    await user.save();

    // Generate login token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.SECRET_KEY || process.env.JWT_SECRET || 'your_hospital_management_jwt_secret',
      { expiresIn: '30d' }
    );

    const isProduction = process.env.NODE_ENV === 'production' || !req.get('host').includes('localhost');

    const cookieOptions = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
    };

    res
      .status(200)
      .cookie('token', token, cookieOptions)
      .json({
        success: true,
        message: 'Account verified and logged in successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profilePicture: user.profilePicture || '',
        },
      });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error, verification failed' });
  }
};

export const resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: 'Please provide email' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Account is already verified' });
    }

    // Generate new 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send new OTP Email
    await sendOtpEmail(user.name, user.email, otp);

    res.status(200).json({
      success: true,
      message: 'A new 4-digit OTP has been sent to your email.',
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Server error, failed to resend OTP' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide an email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check verification status
    if (user.isVerified === false) {
      // Regenerate OTP and send it
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      user.otp = otp;
      user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry
      await user.save();
      await sendOtpEmail(user.name, user.email, otp);

      return res.status(403).json({
        success: false,
        requiresOtp: true,
        email: user.email,
        message: 'Account not verified. A new OTP has been sent to your email.',
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.SECRET_KEY || process.env.JWT_SECRET || 'your_hospital_management_jwt_secret',
      { expiresIn: '30d' }
    );

    const isProduction = process.env.NODE_ENV === 'production' || !req.get('host').includes('localhost');

    const cookieOptions = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
    };

    res
      .status(200)
      .cookie('token', token, cookieOptions)
      .json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profilePicture: user.profilePicture || '',
        },
      });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error, failed to login' });
  }
};

export const logout = async (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production' || !req.get('host').includes('localhost');

  res.cookie('token', '', {
    expires: new Date(0), // Instantly expired
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  });

  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture || '',
      },
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ message: 'Server error, failed to fetch profile' });
  }
};

export const updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const uploadResult = await uploadToCloudinary(req.file.buffer);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: uploadResult.secure_url },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile picture updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error('Update profile picture error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile picture' });
  }
};
