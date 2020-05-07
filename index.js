const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())

morgan.token('req-body', (req, res) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  },
]

const generateId = () => {
  const min = 4
  const max = 1000000
  return Math.floor(Math.random() * (max - min)) + min
}

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)
  
  if (person) {
    res.json(person)
  } else {
    return res.status(404).json({
      error: `Person with ID ${id} not found.`
    })
  }
})

app.get('/api/info', (req, res) => {
  const phonebookSize = persons.length
  const date = new Date()
  
  res.send(`<p>Phonebook has info for ${phonebookSize} people.</p>` + `<p>${date}</p>`)
  res.end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'Missing information. Name and number are required'
    })
  }

  if (persons.find(p => p.name === body.name)) {
    return res.status(400).json({
      error: 'Name already exists in phonebook. Names must be unique.'
    })
  }

  let person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)
  console.log('Newly constructed person: ', person)
  res.status(200).json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)

  persons = persons.filter(p => p.id !== id)
  res.status(204).end()
})

const port = 3001
app.listen(port)
console.log(`Server running on port ${port}`)