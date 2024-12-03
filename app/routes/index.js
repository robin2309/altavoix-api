import { searchDeputes } from './deputes/index.js';

const addRoutes = app => {
  app.get('/api/deputes', async (req, res) => {
    const { search } = req.query;
    const deputes = await searchDeputes(search);
    res.json(deputes);
  });
}

export { addRoutes };