const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MongoDB URI is missing. Please check your .env file');
  process.exit(1);
}

mongoose.connect(MONGODB_URI);

const submissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Submission = mongoose.model('Submission', submissionSchema);

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newSubmission = new Submission({ name, email, message });
    await newSubmission.save();
    res.status(201).send('Submission received successfully');
  } catch (error) {
    console.error('Error saving submission:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = app;
