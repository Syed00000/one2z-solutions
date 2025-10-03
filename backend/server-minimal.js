import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Manual CORS headers FIRST
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization,Cookie,content-type');
  res.header('Access-Control-Max-Age', '86400');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// CORS package as backup
app.use(cors({
  origin: '*',
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'Cookie', 'content-type'],
  optionsSuccessStatus: 200
}));

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
