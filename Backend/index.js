const express = require('express');
const cors = require('cors');
const data = require('./data');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS so the frontend can communicate with this backend
app.use(cors());
app.use(express.json());


// 1. Get all stations
app.get('/api/stations', (req, res) => {
  res.json(data.STATIONS);
});

// 2. Get all buses
app.get('/api/buses', (req, res) => {
  res.json(data.BUSES);
});

// 3. Get all routes
app.get('/api/routes', (req, res) => {
  res.json(data.ROUTES);
});

// 4. Get all operators
app.get('/api/operators', (req, res) => {
  res.json(data.OPERATORS);
});

// 5. Get all alerts
app.get('/api/alerts', (req, res) => {
  res.json(data.ALERTS);
});

// 6. Get all journeys (for route planning)
app.get('/api/journeys', (req, res) => {
  res.json(data.JOURNEYS);
});

// 7. Health check endpoint
app.get('/', (req, res) => {
  res.send('Bharat Transit Backend is Running! Access APIs at /api/buses, /api/stations, etc.');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server is successfully running on http://localhost:${PORT}`);
});
