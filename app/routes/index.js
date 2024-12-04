import { searchDeputes, getDeputeFromName } from './deputes/index.js';

const addRoutes = app => {
  app.get('/api/deputes', async (req, res) => {
    const { search } = req.query;
    const deputes = await searchDeputes(search);
    res.json(deputes);
  });
  
  app.get('/api/depute', async (req, res) => {
    try {
      const { firstname, lastname } = req.query;
      const depute = await getDeputeFromName(firstname, lastname);
      res.json(depute);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
}

export { addRoutes };