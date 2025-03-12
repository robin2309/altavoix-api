
import fs from 'fs/promises';
import papaparse from 'papaparse';

import { getPictureUrl } from '#models/deputy.js'
import { insertDeputies } from '#repositories/deputy.js'

const readCSV = async (filePath) => {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const result = papaparse.parse(fileContent, { header: true });
    return result.data;
  } catch (error) {
    console.error('Error reading CSV:', error);
    throw error;
  }
};

const createDeputyFromCsv = ({identifiant: id, Prénom: firstname, Nom: lastname, Région: region, Département: department, 'Groupe politique (complet)': political_group, 'Groupe politique (abrégé)': political_group_code}) => {
  const deputy = {
    id,
    firstname,
    lastname,
    region,
    department,
    picture_url: getPictureUrl(id),
    political_group,
    political_group_code
  }
  return deputy
}

(async () => {
  try {
    const deputiesListCsv = 'resources/liste_deputes.csv';
    const data = await readCSV(deputiesListCsv);
    const parsedDeputies = data.map(createDeputyFromCsv).filter(({id}) => !!id)
    console.log(parsedDeputies)
    insertDeputies(parsedDeputies)
  } catch (err) {
    console.error('Error:', err);
  }
})();
