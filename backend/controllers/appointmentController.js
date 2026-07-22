import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';

export const bookAppointment = async (req, res) => {
  const { doctorId, date, reason } = req.body;

  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Only patients can book appointments' });
    }

    if (!doctorId || !date || !reason) {
      return res.status(400).json({ message: 'Please provide doctor, date, and reason' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor: doctorId,
      date,
      reason,
      status: 'Pending',
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('doctor', 'name department')
      .populate('patient', 'name email');

    res.status(201).json({ success: true, appointment: populatedAppointment });
  } catch (error) {
    console.error('bookAppointment error:', error);
    res.status(500).json({ message: 'Server error, failed to book appointment' });
  }
};


export const getAppointments = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'patient') {
      query = { patient: req.user.id };
    }

    const appointments = await Appointment.find(query)
      .populate('doctor', 'name department availableDays')
      .populate('patient', 'name email')
      .sort({ date: -1 });

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error('getAppointments error:', error);
    res.status(500).json({ message: 'Server error, failed to fetch appointments' });
  }
};


export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (req.user.role === 'patient') {
      if (appointment.patient.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized to cancel this appointment' });
      }

      if (appointment.status !== 'Pending') {
        return res.status(400).json({ message: 'Only pending appointments can be cancelled' });
      }
    }

    appointment.status = 'Cancelled';
    await appointment.save();

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('doctor', 'name department')
      .populate('patient', 'name email');

    res.status(200).json({ success: true, appointment: populatedAppointment });
  } catch (error) {
    console.error('cancelAppointment error:', error);
    res.status(500).json({ message: 'Server error, failed to cancel appointment' });
  }
};

export const approveAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = 'Approved';
    await appointment.save();

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('doctor', 'name department')
      .populate('patient', 'name email');

    res.status(200).json({ success: true, appointment: populatedAppointment });
  } catch (error) {
    console.error('approveAppointment error:', error);
    res.status(500).json({ message: 'Server error, failed to approve appointment' });
  }
};

export const completeAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = 'Completed';
    await appointment.save();

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('doctor', 'name department')
      .populate('patient', 'name email');

    res.status(200).json({ success: true, appointment: populatedAppointment });
  } catch (error) {
    console.error('completeAppointment error:', error);
    res.status(500).json({ message: 'Server error, failed to complete appointment' });
  }
};
