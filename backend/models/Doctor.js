import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Doctor name is required'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    availableDays: {
      type: [String],
      required: [true, 'Available days are required'],
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: 'A doctor must be available on at least one day',
      },
    },
  },
  {
    timestamps: true,
  }
);

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
