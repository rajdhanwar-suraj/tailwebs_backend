const asyncHandler = require('express-async-handler');
const Student = require('../models/studentModel');

// @desc    Get all students
// @route   GET /api/students
// @access  Private
const getStudents = asyncHandler(async (req, res) => {
  const students = await Student.find({ user: req.user._id });
  res.json(students);
});

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Private
const getStudentById = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (student && student.user.equals(req.user._id)) {
    res.json(student);
  } else {
    res.status(404);
    throw new Error('Student not found');
  }
});

// @desc    Create a student
// @route   POST /api/students
// @access  Private
const createStudent = asyncHandler(async (req, res) => {
  const { name, subject, marks } = req.body;

  const student = new Student({
    user: req.user._id,
    name,
    subject,
    marks,
  });

  const createdStudent = await student.save();
  res.status(201).json(createdStudent);
});

// @desc    Update a student
// @route   PUT /api/students/:id
// @access  Private
const updateStudent = asyncHandler(async (req, res) => {
  const { name, subject, marks } = req.body;

  const student = await Student.findById(req.params.id);

  if (student && student.user.equals(req.user._id)) {
    student.name = name;
    student.subject = subject;
    student.marks = marks;

    const updatedStudent = await student.save();
    res.json(updatedStudent);
  } else {
    res.status(404);
    throw new Error('Student not found');
  }
});

// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Private
const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (student && student.user.equals(req.user._id)) {
    await Student.deleteOne({ _id: student._id });
    res.json({ message: 'Student removed' });
  } else {
    res.status(404);
    throw new Error('Student not found');
  }
});

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
