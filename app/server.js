import express from 'express';
import cors from 'cors';

import { addRoutes } from './routes/index.js';

const app = express();
const port = process.env.PORT || 4200;

// Middleware to parse JSON requests
app.use(express.json());

app.use(cors());

addRoutes(app);

// Start the server
app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
