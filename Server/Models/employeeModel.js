const mongoose = require('mongoose');
const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  startWorkYear: {
    type: Number,
    required: true,
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  shifts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shift",
      required: false,
    },
  ],
});

const Employee = mongoose.model('Employee', employeeSchema, 'employees');

module.exports = Employee;
