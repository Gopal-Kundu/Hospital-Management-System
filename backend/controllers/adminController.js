import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';

export const getStats = async (req, res) => {
  try {
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await Doctor.countDocuments({});
    const totalAppointments = await Appointment.countDocuments({});
    const pendingAppointments = await Appointment.countDocuments({ status: 'Pending' });

    res.status(200).json({
      success: true,
      stats: {
        totalPatients,
        totalDoctors,
        totalAppointments,
        pendingAppointments,
      },
    });
  } catch (error) {
    console.error('getStats error:', error);
    res.status(500).json({ message: 'Server error, failed to fetch statistics' });
  }
};


export const getPatients = async (req, res) => {
  const { search } = req.query;

  try {
    let query = { role: 'patient' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const patients = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, patients });
  } catch (error) {
    console.error('getPatients error:', error);
    res.status(500).json({ message: 'Server error, failed to fetch patients' });
  }
};

export const deletePatient = async (req, res) => {
  try {
    const patient = await User.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    if (patient.role === 'admin') {
      return res.status(400).json({ message: 'Admin accounts cannot be deleted here' });
    }

    await Appointment.deleteMany({ patient: patient._id });

    await patient.deleteOne();

    res.status(200).json({ success: true, message: 'Patient and all associated appointments deleted' });
  } catch (error) {
    console.error('deletePatient error:', error);
    res.status(500).json({ message: 'Server error, failed to delete patient' });
  }
};
