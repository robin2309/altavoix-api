import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

import { POUR, CONTRE, ABSTENTION, ABSENT, parseVotes } from '../models/depute.js';
import { normalizeName } from '../shared/strings.js';

// Replicate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// generate json file in output/ firstname_lastname.json
/**
 * {
    *  firstName
    *  lastName
    *  votes [
    *      {
    *           number
    *           title
    *           standing: POUR / CONTRE / ABSENT / ABSTENTION
    * }
    *  ]
 * }
 */
// lookup vote in scrutin.ventilationVotes.organe.groupes.groupe[].vote.decompteNominatif.(pours / contres / abstentions).votant[].acteurRef

const isInVoters = (votes, id) => {
  if (!votes) return false;
  const normalizedId = `PA${id}`;
  if (!!(votes?.votant?.acteurRef)) {
    return normalizedId === votes.votant.acteurRef;
  }
  return votes ? votes.votant.find(({acteurRef}) => {
    return normalizedId === acteurRef;
  }) : false;
};

const getStanding = (votes, id) => {
  const {groupe: groups} = votes.organe.groupes;
  for (let group of groups) {
    const {pours, contres, abstentions} = group.vote.decompteNominatif;
    if (isInVoters(pours, id)) return POUR;
    if (isInVoters(contres, id)) return CONTRE;
    if (isInVoters(abstentions, id)) return ABSTENTION;
  }
  return ABSENT;
}

const mountDeputeData = ({identifiant: id, Prénom: firstName, Nom: lastName}, scrutins) => {
  const votes = scrutins.map(({scrutin}) => {
    return {
      number: scrutin.numero,
      title: scrutin.titre,
      standing: getStanding(scrutin.ventilationVotes, id),
    };
  });

  const output = {
    firstName,
    lastName,
    votes
  };

  return output;

}

const writeDeputeFiles = deputeData => new Promise((resolve, reject) => {
  // Define the output folder in the parent directory
  const outputDir = path.join(__dirname, '..', 'output');

  const writePromises = deputeData.map(depute => {
    return new Promise((resolveWrite, rejectWrite) => {
      const fileName = `${normalizeName(depute.firstName)}_${normalizeName(depute.lastName)}.json`;
      const filePath = path.join(outputDir, fileName);
      
      // Write the JSON object to the file
      fs.writeFile(filePath, JSON.stringify(depute, null, 2), (err) => {
        if (err) {
          console.error('Error writing to file:', err.message);
          rejectWrite();
        } else {
          console.log(`File successfully written to ${filePath}`);
          resolveWrite();
        }
      });
    });
  });

  Promise.all(writePromises)
    .then(() => {
      resolve();
    })
    .catch(err => {
      reject(err);
      console.log('ERROR AT WRITE');
    })
  
});

export { mountDeputeData, writeDeputeFiles };
