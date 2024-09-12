const express = require('express');
const app = express();

// Serve a simple homepage message or HTML
app.get('/', (req, res) => {
  res.send('<h1>Welcome to the Homepage!</h1>');
});

module.exports = app;
