require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('req-body', (req, res) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

// GET all person records
app.get('/api/persons', (req, res) => {
  console.log('Retrieving all phonebook entries...')
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

// GET one person by ID
app.get('/api/persons/:id', (req, res) => {
  console.log('Retrieving record for person with ID: ', req.params.id)
  Person.findById(req.params.id)
    .then(person => {
      res.json(person.toJSON())
    })
})

// GET phonebook data
app.get('/api/info', (req, res) => {
  console.log('Retrieving phonebook information...')
  Person.count({}).then(count => {
    const date = new Date()
    res.send(`<p>Phonebook has info for ${count} people.</p>` + `<p>${date}</p>`)  
  })
})

// POST a new phonebook entry
app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'Missing information. Name and number are required'
    })
  }

  let person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    res.status(200).json(savedPerson.toJSON())
  })
})

// app.delete('/api/persons/:id', (req, res) => {
//   const id = Number(req.params.id)

//   persons = persons.filter(p => p.id !== id)
//   res.status(204).end()
// })

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})