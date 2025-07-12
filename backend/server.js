const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

// Init express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');

app.use('/api/auth', authRoutes);


// Test route
app.get('/', (req, res) => {
  res.send('🌐 SkillSwap API is running...');
});

// Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
