import mongoose, { Schema, InferSchemaType } from 'mongoose';

const jobSchema = new Schema({
  job_title: { type: String, required: true },
  company: { type: String, required: true },
  location: String,
  is_remote: String,
  role_category: String,
  seniority_level: String,
  is_aggregator: String,
  skills_str: { type: String, required: true },
}, { collection: 'jobs' });

export type JobDocument = InferSchemaType<typeof jobSchema>;
export const Job = mongoose.model('Job', jobSchema);
