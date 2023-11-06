const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes'); // Assuming you have an 'index.js' for your routes

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Connect to MongoDB (you can use your connection code here)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/social-network', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to database');
});

// Use your routes
app.use(routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
