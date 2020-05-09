const mongoose = require('mongoose')

console.log('process.argv length: ', process.argv.length)
console.log(process.argv)

if (process.argv.length < 3) {
  console.log('Please provide password as argument.')
  process.exit(1)
}

// Establish mongo connection
const password = process.argv[2]
const url = `mongodb+srv://fso_app:${password}@fsocluster-uxbmd.mongodb.net/phonebook?retryWrites=true&w=majority`
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

// Create Person schema
const personSchema = new mongoose.Schema({
  name: String,
  number: String
})
const Person = mongoose.model('Person', personSchema)

// Create new person or get all entries based on arguments
if (process.argv.length < 4) {
  console.log('Retrieving all phonebook entries: ')
  
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })

} else if (process.argv.length < 5) {
  console.log('Not enough args passed to process. Please try again.')
  process.exit(0)

} else {
  const name = process.argv[3]
  const number = process.argv[4]
  const person = new Person({
    name,
    number
  })

  person.save().then(response => {
    console.log(`Added ${name} number ${number} to the phonebook.`)
    mongoose.connection.close()
  })
}