require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const connectDB = require('./config/db');
const { apiLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const jobRoutes = require('./routes/jobRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

const app = express();

// ----- Security & Core Middleware -----
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(apiLimiter);

// ----- Health Check -----
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy.',
    data: { uptime: process.uptime(), timestamp: new Date().toISOString() },
  });
});

// ----- API Routes -----
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin/settings', settingsRoutes);

// ----- 404 and Error Handling -----
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

startServer();

// Handle unhandled promise rejections gracefully
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  process.exit(1);
});

module.exports = app;
