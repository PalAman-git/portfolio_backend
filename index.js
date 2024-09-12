// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(cors());

const MONGODB_URI = process.env.MONGODB_URI;

if(!MONGODB_URI) {
  console.error('MongoDB URI is missing. Please check your .env file');
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(MONGODB_URI);

// Define a schema and model for storing submissions
const submissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Submission = mongoose.model('Submission', submissionSchema);

// Endpoint to handle form submissions
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Create a new submission document
    const newSubmission = new Submission({ name, email, message });
    
    // Save the document to the database
    await newSubmission.save();
    
    res.status(201).send('Submission received successfully');
  } catch (error) {
    console.error('Error saving submission:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint to retrieve all submissions
app.get('/api/submissions', async (req, res) => {
  try {
    // Retrieve submissions from the database, sorted by date (newest first)
    const submissions = await Submission.find().sort({ date: -1 });
    
    res.status(200).json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server

//for local server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//for vercel server
module.exports = app;
