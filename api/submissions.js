const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

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

app.get('/api/submissions', async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ date: -1 });
    res.status(200).json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = app;
