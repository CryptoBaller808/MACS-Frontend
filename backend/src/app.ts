import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { config } from 'dotenv';

// Import routes
import authRoutes from './routes/auth';
import artistRoutes from './routes/artists';
import postRoutes from './routes/posts';
import crowdfundingRoutes from './routes/crowdfunding';
import bookingRoutes from './routes/bookings';
import storeRoutes from './routes/store';
import liveStreamRoutes from './routes/liveStreams';
import collaborationRoutes from './routes/collaborations';
import discoveryRoutes from './routes/discovery';
import culturalRoutes from './routes/cultural';

// Import middleware
import { authenticateToken } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/logger';

// Import database connection
import { connectDB } from './config/database';

// Load environment variables
config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging middleware
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/crowdfunding', crowdfundingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/live-streams', liveStreamRoutes);
app.use('/api/collaborations', collaborationRoutes);
app.use('/api/discovery', discoveryRoutes);
app.use('/api/cultural', culturalRoutes);

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join artist's room for live updates
  socket.on('join-artist-room', (artistId: string) => {
    socket.join(`artist-${artistId}`);
  });

  // Handle live stream viewers
  socket.on('join-stream', (streamId: string) => {
    socket.join(`stream-${streamId}`);
  });

  // Handle chat messages
  socket.on('chat-message', (data) => {
    io.to(`stream-${data.streamId}`).emit('new-message', data);
  });

  // Handle collaboration requests
  socket.on('collaboration-request', (data) => {
    io.to(`artist-${data.targetArtistId}`).emit('new-collaboration-request', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`🌺 Muse API server running on port ${PORT}`);
      console.log(`📡 WebSocket server ready for real-time features`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export { app, io }; 