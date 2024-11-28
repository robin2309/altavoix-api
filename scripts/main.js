import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import unzipper from 'unzipper';

import { mountDeputeData, writeDeputeFiles } from './depute.js';

// Replicate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = '../resources/liste_deputes.csv';

const ZIP_NAME = 'Scrutins.json.zip';
const DATA_FOLDER = 'data';
const EXTRACT_FOLDER = 'extracted';
const OUTPUT_FOLDER = 'output';

// Output folder and file name
const outputDir = path.join(__dirname, '..', OUTPUT_FOLDER);
const dataFolder = path.join(__dirname, DATA_FOLDER);
const zipFile = path.join(dataFolder, ZIP_NAME);
const extractTo = path.join(__dirname, EXTRACT_FOLDER);

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Ensure the extraction folder exists
if (!fs.existsSync(extractTo)) {
  fs.mkdirSync(extractTo, { recursive: true });
}

const downloadAndWrite = () => new Promise((resolve, reject) => {
  const url = 'https://data.assemblee-nationale.fr/static/openData/repository/17/loi/scrutins/Scrutins.json.zip';

  // Ensure the folder exists
  if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder, { recursive: true });
  }

  // Download and save the file
  https.get(url, (response) => {
    if (response.statusCode === 200) {
      const fileStream = fs.createWriteStream(zipFile);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`File downloaded and saved to ${zipFile}`);
        resolve();
      });
    } else {
      console.error(`Failed to download file: ${response.statusCode} ${response.statusMessage}`);
      reject();
    }
  }).on('error', (err) => {
    console.error(`Error during download: ${err.message}`);
    reject();
  });
});

const unzipScrutins = () => new Promise((resolve, reject) => {
  // Unzip the file
  console.log(zipFile);
  fs.createReadStream(zipFile)
    .pipe(unzipper.Parse())
    .on('entry', (entry) => {
      const entryPath = path.join(extractTo, entry.path); // Full path to the extracted file
      if (entry.type === 'Directory') {
        // Create the directory if it's a directory entry
        if (!fs.existsSync(entryPath)) {
          fs.mkdirSync(entryPath, { recursive: true });
          console.log(`Directory created: ${entryPath}`);
        }
        entry.autodrain(); // Skip writing any content for directories
      } else {
        // Ensure the directory exists for the file
        const dir = path.dirname(entryPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
          console.log(`Directory created for file: ${dir}`);
        }

        // Write the file
        entry.pipe(fs.createWriteStream(entryPath));
      }
    })
    .on('close', resolve)
    .on('error', reject);
});

const parseScrutins = () => new Promise((resolve, reject) => {
  const folderPath = path.join(extractTo, 'json');
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      reject('Error reading directory: ' + err);
      return;
    }

    // Filter out non-JSON files (optional)
    const jsonFiles = files.filter(file => path.extname(file) === '.json');

    // Create an array of promises for reading each JSON file
    const readPromises = jsonFiles.map((file) => {
      return new Promise((resolveRead, rejectRead) => {
        const filePath = path.join(folderPath, file);
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            rejectRead(`Error reading file ${file}: ${err}`);
            return;
          }
          try {
            // Parse JSON and resolve with the parsed object
            const jsonObject = JSON.parse(data);
            resolveRead(jsonObject);
          } catch (err) {
            rejectRead(`Error parsing JSON in ${file}: ${err}`);
          }
        });
      });
    });

    // Wait for all files to be read and parsed
    Promise.all(readPromises)
      .then((jsonDataArray) => {
        jsonDataArray.sort((scrutinA, scrutinB) => {
          return Number(scrutinA.scrutin.numero) - Number(scrutinB.scrutin.numero)
        })
        resolve(jsonDataArray); // Resolve with the array of parsed JSON data
      })
      .catch((err) => {
        reject(err); // Reject if any of the file reads fail
      });
  });
});

const mountData = parsedScrutinData => new Promise((resolve, reject) => {
  const deputeData = [];
  try {
    // Open and process the CSV file
    fs.createReadStream(filePath)
      .pipe(csv()) // Automatically treats the first line as the header
      .on('data', (row) => {
        deputeData.push(mountDeputeData(row, parsedScrutinData));
      })
      .on('end', () => {
        console.log('CSV file successfully processed.');
        resolve(deputeData);
      })
      .on('error', (err) => {
        console.error('Error reading the file:', err.message);
        reject();
      });
  } catch (err) {
    console.error('Error reading the file:', err.message);
    reject();
  }
});

downloadAndWrite()
  .then(unzipScrutins)
  .then(parseScrutins)
  .then(parsedScrutinData => {
    return mountData(parsedScrutinData);
  })
  .then(deputeData => {
    writeDeputeFiles(deputeData);
  })
  .catch(() => {
    console.log('ERROR');
  });
