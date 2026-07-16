/**
 * Script: createAdmin.js
 * Usage: node scripts/createAdmin.js <name> <email> <password>
 *
 * Bootstraps the very first admin account. Regular registration
 * (POST /api/auth/register) always creates 'student' accounts for
 * security reasons — this script is the only way to create the
 * initial admin. Once you have one admin, further admins can be
 * promoted via PUT /api/admin/users/:id/role.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

const run = async () => {
  const [, , name, email, password] = process.argv;

  if (!name || !email || !password) {
    console.error('Usage: node scripts/createAdmin.js <name> <email> <password>');
    process.exit(1);
  }

  if (password.length < 6) {
    console.error('Password must be at least 6 characters long.');
    process.exit(1);
  }

  try {
    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      existing.role = 'admin';
      await existing.save();
      console.log(`Existing user '${email}' promoted to admin.`);
    } else {
      await User.create({ name, email, password, role: 'admin' });
      console.log(`Admin user created successfully: ${email}`);
    }
  } catch (error) {
    console.error('Error creating admin:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

run();
