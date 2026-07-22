import Doctor from '../models/Doctor.js';


export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ name: 1 });
    res.status(200).json({ success: true, doctors });
  } catch (error) {
    console.error('getDoctors error:', error);
    res.status(500).json({ message: 'Server error, failed to fetch doctors' });
  }
};

export const addDoctor = async (req, res) => {
  const { name, department, availableDays } = req.body;

  try {
    if (!name || !department || !availableDays || availableDays.length === 0) {
      return res.status(400).json({ message: 'Please provide all doctor details' });
    }

    const doctor = await Doctor.create({
      name,
      department,
      availableDays,
    });

    res.status(201).json({ success: true, doctor });
  } catch (error) {
    console.error('addDoctor error:', error);
    res.status(500).json({ message: 'Server error, failed to add doctor' });
  }
};


export const editDoctor = async (req, res) => {
  const { name, department, availableDays } = req.body;

  try {
    let doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    doctor.name = name || doctor.name;
    doctor.department = department || doctor.department;
    doctor.availableDays = availableDays || doctor.availableDays;

    await doctor.save();

    res.status(200).json({ success: true, doctor });
  } catch (error) {
    console.error('editDoctor error:', error);
    res.status(500).json({ message: 'Server error, failed to edit doctor' });
  }
};


export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    await doctor.deleteOne();

    res.status(200).json({ success: true, message: 'Doctor removed successfully' });
  } catch (error) {
    console.error('deleteDoctor error:', error);
    res.status(500).json({ message: 'Server error, failed to delete doctor' });
  }
};
