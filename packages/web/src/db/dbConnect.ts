import mongoose from 'mongoose';
import { getOrThrow } from '../utils/getOrThrow';

// const connectMongo = async () => mongoose.connect(getOrThrow('MONGO_URI'));


const MONGODB_URI = getOrThrow('MONGODB_URI')

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */


let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect () {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    // cached.promise = Promise.resolve()
    cached.promise = mongoose.connect(MONGODB_URI).then(mongoose => {
      console.log('Connected to MongoDB successfully');
      
      return mongoose
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}

export default dbConnect
