const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/aptech', { useNewUrlParser: true, useUnifiedTopology: true });

const studentSchema = new mongoose.Schema({ name: String, email: String, age: Number, course: String });
const Student = mongoose.model('Student', studentSchema);

app.post('/student', (req, res) => {
  const { name, email, age, course } = req.body;
  new Student({ name, email, age, course }).save()
    .then(() => res.status(201).json({ message: 'Student added successfully!' }))
    .catch((err) => res.status(500).json({ message: 'Error adding student', error: err }));
});

app.get('/students', (req, res) => {
  Student.find()
    .then((students) => res.status(200).json(students))
    .catch((err) => res.status(500).json({ message: 'Error fetching students', error: err }));
});

app.listen(5000, () => console.log('Server running on port 5000'));
