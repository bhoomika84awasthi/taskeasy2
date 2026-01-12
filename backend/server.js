const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const projectsRoutes = require('./routes/projects');
const wikiRoutes = require('./routes/wiki');
const workitemsRoutes = require('./routes/workitems');
const boardsRoutes = require('./routes/boards');
const sprintsRoute = require('./routes/sprints');
const pipelinesRoute = require('./routes/pipelines');
const deliveryPlansRoute = require('./routes/deliveryplans');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);

// Workitems, boards and sprints routes (they expose paths under /api/projects/:projectId/...)
// These must come BEFORE /api/projects to prevent route conflicts

// Projects route comes after more specific routes
app.use('/api', workitemsRoutes);
app.use('/api', boardsRoutes);
app.use('/api/projects/:projectId/sprints', sprintsRoute);
app.use('/api/projects/:projectId/delivery-plans', deliveryPlansRoute);

// Project-scoped services (mount under /api/projects/:projectId/*)
app.use('/api/projects/:projectId/wiki', wikiRoutes);
app.use('/api/projects/:projectId/pipelines', pipelinesRoute);

app.use('/api/projects', projectsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});