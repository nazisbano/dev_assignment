import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGO_URI;

export const connectDB = async (): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    if (!mongoURI) {
      console.error('MONGOURI is not defined in environment variables.');
      return reject(new Error('Missing MongoDB URI'));
    }

    try {
      await mongoose
        .connect(mongoURI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        } as mongoose.ConnectOptions)
        .then(() => {
          console.log('*****************Database connected***************');
          resolve(true);
        })
        .catch((err: any) => {
          console.error('Failed to connect Database', err);
          reject(err);
        });
    } catch (error) {
      reject(error);
    }
  });
};
