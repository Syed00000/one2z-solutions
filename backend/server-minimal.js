import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Manual CORS headers FIRST - specific origin for credentials
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Allow specific origins
  if (origin === 'https://one2zsolutions.vercel.app' || 
      origin === 'http://localhost:8080' || 
      origin === 'http://localhost:8081') {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  } else {
    res.header('Access-Control-Allow-Origin', '*');
  }
  
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
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://one2zsolutions.vercel.app',
      'http://localhost:8080',
      'http://localhost:8081',
      'http://localhost:3000'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'Cookie'],
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
  const { email, password } = req.body;
  
  console.log('Login attempt received:', { email, password });
  
  // Debug response first
  res.json({
    success: true,
    message: 'Login successful - hardcoded response',
    debug: {
      receivedEmail: email,
      receivedPassword: password,
      expectedEmail: 'syedimranh59@gmail.com',
      expectedPassword: 'admin@123',
      emailMatch: email === 'syedimranh59@gmail.com',
      passwordMatch: password === 'admin@123'
    },
    data: {
      user: {
        id: '1',
        email: email || 'syedimranh59@gmail.com',
        role: 'admin'
      },
      token: 'fake-jwt-token-for-testing'
    }
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
