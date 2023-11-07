const mongoose = require('mongoose')

const MONGO__URL = process.env.MONGO_URL

if (!MONGO__URL) {
  throw new Error(
    'Please define the MONGO_URL environment variable inside .env.local'
  )
}

mongoose.set('strictQuery', true)

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = await mongoose.connect(MONGO__URL, opts).then((mongoose) => {
      return mongoose
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}

module.exports = dbConnect;