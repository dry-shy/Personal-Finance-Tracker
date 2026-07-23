const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Route files
const transactions = require('./routes/transactions');
const auth = require('./routes/authRoutes');
const budget = require('./routes/budgetRoutes');
const reports = require('./routes/reportRoutes');
const savingsGoals = require('./routes/savingsGoalRoutes');
const bills = require('./routes/billRoutes');

// Load env vars
dotenv.config();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/v1/transactions', transactions);
app.use('/api/v1/auth', auth);
app.use('/api/v1/budget', budget);
app.use('/api/v1/reports', reports);
app.use('/api/v1/savings-goals', savingsGoals);
app.use('/api/v1/bills', bills);

// Error handler middleware
app.use(errorHandler);

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
