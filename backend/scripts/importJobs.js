/**
 * Script: importJobs.js
 * Usage: node scripts/importJobs.js [path/to/file.csv] [--fresh]
 *
 * Reads the jobs CSV dataset, converts skills_str into a normalized
 * skills array, and inserts/upserts the records into MongoDB.
 *
 * Flags:
 *   --fresh   Deletes all existing Job documents before importing.
 */

require('dotenv').config();
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Job = require('../models/Job');

const DEFAULT_CSV_PATH = path.join(__dirname, '..', 'dataset', 'jobs.csv');

const parseBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (!value) return false;
  const normalized = String(value).trim().toLowerCase();
  return normalized === 'yes' || normalized === 'true' || normalized === '1';
};

const parseSkills = (skillsStr) => {
  if (!skillsStr) return [];
  const skillsArray = String(skillsStr)
    .split(',')
    .map((skill) => skill.trim().toLowerCase())
    .filter((skill) => skill.length > 0);
  return [...new Set(skillsArray)];
};

const readCsvRows = (csvPath) =>
  new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => rows.push(row))
      .on('end', () => resolve(rows))
      .on('error', (err) => reject(err));
  });

const transformRow = (row) => ({
  job_title: (row.job_title || '').trim() || 'Untitled Role',
  company: (row.company || '').trim() || 'Unknown',
  location: (row.location || '').trim() || 'Not specified',
  is_remote: parseBoolean(row.is_remote),
  role_category: (row.role_category || '').trim().toLowerCase() || 'uncategorized',
  seniority_level: (row.seniority_level || '').trim().toLowerCase() || 'not specified',
  is_aggregator: parseBoolean(row.is_aggregator),
  skills: parseSkills(row.skills_str),
});

const run = async () => {
  const args = process.argv.slice(2);
  const freshImport = args.includes('--fresh');
  const csvArg = args.find((arg) => !arg.startsWith('--'));
  const csvPath = csvArg ? path.resolve(csvArg) : DEFAULT_CSV_PATH;

  if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found at: ${csvPath}`);
    process.exit(1);
  }

  console.log(`Reading CSV from: ${csvPath}`);

  try {
    await connectDB();

    if (freshImport) {
      const deleted = await Job.deleteMany({});
      console.log(`--fresh flag detected. Removed ${deleted.deletedCount} existing job(s).`);
    }

    const rows = await readCsvRows(csvPath);
    console.log(`Parsed ${rows.length} row(s) from CSV.`);

    const jobs = rows.map(transformRow);

    // Insert in batches to avoid overwhelming MongoDB with a single huge write
    const BATCH_SIZE = 500;
    let insertedCount = 0;

    for (let i = 0; i < jobs.length; i += BATCH_SIZE) {
      const batch = jobs.slice(i, i + BATCH_SIZE);
      const result = await Job.insertMany(batch, { ordered: false });
      insertedCount += result.length;
      console.log(`Inserted batch ${i / BATCH_SIZE + 1}: ${result.length} job(s).`);
    }

    console.log(`Import complete. Total jobs inserted: ${insertedCount}`);
  } catch (error) {
    console.error('Error during import:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

run();
