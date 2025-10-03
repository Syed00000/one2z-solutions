import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// CORS - Allow everything
app.use(cors({
  origin: '*',
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Manual CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Test endpoints
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Minimal server running',
    timestamp: new Date().toISOString(),
    cors: 'enabled'
  });
});

app.post('/api/auth/login', (req, res) => {
  res.json({
    success: false,
    message: 'Minimal server - login not implemented yet',
    received: req.body
  });
});

app.get('/api/projects', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'Minimal server - no projects yet'
  });
});

app.get('/api/reviews/featured/list', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'Minimal server - no reviews yet'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Minimal server running on port ${PORT}`);
});
