require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

// Configure and register morgan logging middleware
morgan.token('req-body', (req, res) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

// Get all person records
app.get('/api/persons', (req, res) => {
  console.log('Retrieving all phonebook entries...')
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

// Get one person by ID
app.get('/api/persons/:id', (req, res, next) => {
  console.log('Retrieving record for person with ID: ', req.params.id)
  Person.findById(req.params.id)
    .then(person => {
      res.json(person.toJSON())
    })
    .catch(error => next(error))
})

// Get phonebook data
app.get('/api/info', (req, res) => {
  console.log('Retrieving phonebook information...')
  Person.count({}).then(count => {
    const date = new Date()
    res.send(`<p>Phonebook has info for ${count} people.</p>` + `<p>${date}</p>`)
  })
})

// Create a new phonebook entry
app.post('/api/persons', (req, res, next) => {
  const body = req.body

  let person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => {
      res.status(200).json(savedPerson.toJSON())
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  Person.findByIdAndUpdate(req.params.id, body, { new: true })
    .then(updatedPerson => {
      res.status(200).json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

// Delete an entry from the phonebook
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

// Define and use error handling middleware
const errorHandler = (error, req, res, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'Malformed ID' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})