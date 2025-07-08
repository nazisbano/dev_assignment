import mongoose, { Schema, Document } from 'mongoose';

export interface IDeveloper extends Document {
  name: string;
  email: string;
  skills: string[];
  experience: string;
  location: string;
  createdAt: Date;
  userId: string;
}

const DeveloperSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  skills: { type: [String], required: true },
  experience: { type: String },
  location: { type: String },
  createdAt: { type: Date, default: Date.now },
  userId: { type: String, required: true },
});

export default mongoose.model<IDeveloper>('Developer', DeveloperSchema);