const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: 'Please provide a valid email address',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },
    university: {
      type: String,
      trim: true,
      default: '',
    },
    degree: {
      type: String,
      trim: true,
      default: '',
    },
    graduationYear: {
      type: Number,
      min: [1950, 'Graduation year is invalid'],
      max: [2100, 'Graduation year is invalid'],
    },
    resume: {
      type: String,
      default: '',
    },
    skills: {
      type: [String],
      default: [],
      set: (skillsArray) =>
        Array.isArray(skillsArray)
          ? [...new Set(skillsArray.map((s) => String(s).trim().toLowerCase()).filter(Boolean))]
          : [],
    },
    resumeSkills: {
      type: [String],
      default: [],
      set: (skillsArray) =>
        Array.isArray(skillsArray)
          ? [...new Set(skillsArray.map((s) => String(s).trim().toLowerCase()).filter(Boolean))]
          : [],
    },
    status: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active',
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// Hash password before saving, only if it has been modified
UserSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});

// Instance method to compare plain text password with hashed password
UserSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive fields when converting to JSON
UserSchema.methods.toJSON = function toJSON() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

module.exports = mongoose.model('User', UserSchema);
