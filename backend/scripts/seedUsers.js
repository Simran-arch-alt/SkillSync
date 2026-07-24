/**
 * Script: seedUsers.js
 * Usage: node scripts/seedUsers.js [--fresh]
 *
 * Seeds sample student users into the database.
 * --fresh  Deletes all existing non-admin users before seeding.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

const sampleUsers = [
  {
    name: 'Aarav Sharma',
    email: 'aarav@example.com',
    password: 'Password123',
    university: 'Tribhuvan University',
    degree: 'B.Sc. Computer Science',
    graduationYear: 2024,
    skills: ['javascript', 'react', 'node.js', 'mongodb', 'python'],
  },
  {
    name: 'Sita Thapa',
    email: 'sita@example.com',
    password: 'Password123',
    university: 'Kathmandu University',
    degree: 'B.Sc. Software Engineering',
    graduationYear: 2025,
    skills: ['java', 'spring boot', 'sql', 'docker', 'aws'],
  },
  {
    name: 'Rohan Gurung',
    email: 'rohan@example.com',
    password: 'Password123',
    university: 'Pokhara University',
    degree: 'M.Sc. Data Science',
    graduationYear: 2024,
    skills: ['python', 'tensorflow', 'pandas', 'sql', 'machine learning'],
  },
  {
    name: 'Anita Rai',
    email: 'anita@example.com',
    password: 'Password123',
    university: 'Purbanchal University',
    degree: 'B.Sc. Information Technology',
    graduationYear: 2026,
    skills: ['html', 'css', 'javascript', 'react', 'git'],
  },
  {
    name: 'Bikash Magar',
    email: 'bikash@example.com',
    password: 'Password123',
    university: 'Nepal College of Information Technology',
    degree: 'B.Eng. Computer Engineering',
    graduationYear: 2025,
    skills: ['c++', 'python', 'linux', 'machine learning', 'data structures'],
  },
];

const run = async () => {
  const fresh = process.argv.includes('--fresh');

  try {
    await connectDB();

    if (fresh) {
      const deleted = await User.deleteMany({ role: 'student' });
      console.log(`--fresh: Removed ${deleted.deletedCount} existing student(s).`);
    }

    let createdCount = 0;
    for (const userData of sampleUsers) {
      const existing = await User.findOne({ email: userData.email });
      if (existing) {
        console.log(`User '${userData.email}' already exists. Skipping.`);
        continue;
      }
      await User.create(userData);
      createdCount++;
      console.log(`Created user: ${userData.name} (${userData.email})`);
    }

    console.log(`\nSeeding complete. ${createdCount} user(s) created.`);
    console.log('All test accounts use password: Password123');
  } catch (error) {
    console.error('Error seeding users:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

run();
