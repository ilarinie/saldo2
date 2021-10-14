import mongoose from 'mongoose'

export const connectToDatabase = async databaseURI => {
  return mongoose.connect(databaseURI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
}
