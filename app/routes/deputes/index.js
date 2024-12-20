import { promises as fs } from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

import { parseVotes } from '#models/depute.js';

const searchDeputes = async searchQuery => {
  // Read CSV file
  const filePath = path.join(process.cwd(), 'resources', 'liste_deputes.csv');
  const fileContent = await fs.readFile(filePath, 'utf-8');
  
  // Parse CSV
  const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
  });

  // Filter based on search query
  return records.filter(deputy => 
      deputy.Prénom.toLowerCase().includes(searchQuery) ||
      deputy.Nom.toLowerCase().includes(searchQuery)
  ).slice(0, 10); // Limit to 10 suggestions
}

const getDeputeFromName = async (name) => {
  try {
    if (!name) {
      throw new Error('Name parameter is required');
    }

    // Normalize the name for file lookup
    const normalizedName = `${name}.json`;
    const filePath = path.join(process.cwd(), 'output', normalizedName);

    // Read the JSON file
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    return {
      ...data,
      votes: parseVotes(data.votes),
    };
  } catch (error) {
    console.log(error);
    if (error.code === 'ENOENT') {
      throw new Error('Depute not found');
    }
    throw new Error('Internal server error');
  }
}

export { searchDeputes, getDeputeFromName };
