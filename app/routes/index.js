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
      const {code, body} = error.message;
      res.status(code).json({ message: body });
    }
  });
}

export { addRoutes };