import express from 'express';

import { addRoutes } from './routes/index.js';

const app = express();
const port = process.env.PORT || 6000;

// Middleware to parse JSON requests
app.use(express.json());

addRoutes(app);

// Start the server
app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
