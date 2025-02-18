const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // to parse JSON request bodies

mongoose.connect('mongodb://localhost:27017/aptech', { useNewUrlParser: true, useUnifiedTopology: true });

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  course: String
});

const Student = mongoose.model('Student', studentSchema);

// CREATE: Add a new student
app.post('/student', (req, res) => {
  const { name, email, age, course } = req.body;
  const newStudent = new Student({ name, email, age, course });

  newStudent.save()
    .then(() => res.status(201).json({ message: 'Student added successfully!' }))
    .catch((err) => res.status(500).json({ message: 'Error adding student', error: err }));
});

// READ: Get all students
app.get('/students', (req, res) => {
  Student.find()
    .then((students) => res.status(200).json(students))
    .catch((err) => res.status(500).json({ message: 'Error fetching students', error: err }));
});

// READ: Get a single student by ID
app.get('/student/:id', (req, res) => {
  const { id } = req.params;
  Student.findById(id)
    .then((student) => {
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      res.status(200).json(student);
    })
    .catch((err) => res.status(500).json({ message: 'Error fetching student', error: err }));
});

// UPDATE: Update student details
app.put('/student/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, age, course } = req.body;

  Student.findByIdAndUpdate(id, { name, email, age, course }, { new: true })
    .then((updatedStudent) => {
      if (!updatedStudent) {
        return res.status(404).json({ message: 'Student not found' });
      }
      res.status(200).json({ message: 'Student updated successfully', student: updatedStudent });
    })
    .catch((err) => res.status(500).json({ message: 'Error updating student', error: err }));
});

// DELETE: Delete a student by ID
app.delete('/student/:id', (req, res) => {
  const { id } = req.params;
  Student.findByIdAndDelete(id)
    .then((deletedStudent) => {
      if (!deletedStudent) {
        return res.status(404).json({ message: 'Student not found' });
      }
      res.status(200).json({ message: 'Student deleted successfully' });
    })
    .catch((err) => res.status(500).json({ message: 'Error deleting student', error: err }));
});

app.listen(5000, () => console.log('Server running on port 5000'));
