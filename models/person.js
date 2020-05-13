const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGO_URI
const connectOpts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}

// Initialize MongoDB connection
console.log(`Connecting to MongoDB at ${url}`)
mongoose.connect(url, connectOpts)

// Create and export 'Person' schema
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
    unique: true
  },
  number: {
    type: String,
    minlength: 8,
    required:true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

personSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Person', personSchema)