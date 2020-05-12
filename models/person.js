const mongoose = require('mongoose')

const url = process.env.MONGO_URI
const connectOpts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}

// Initialize MongoDB connection
console.log(`Connecting to MongoDB at ${url}`)
mongoose.connect(url, connectOpts)

// Create and export 'Person' schema
const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)