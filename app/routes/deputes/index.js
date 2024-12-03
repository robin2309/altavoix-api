import { promises as fs } from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

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

export { searchDeputes };