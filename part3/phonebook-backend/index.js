const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :body'))

morgan.token('body', req => {
    return JSON.stringify(req.body)
})


let notes = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]




app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(notes)
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    error = ''
    if (!body.name) {
        return response.status(400).json({
            error: 'name is missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number is missing'
        })
    }

    if (notes.find(note => note.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const id = Math.floor((Math.random() * 1000000) + 1)

    const note = {
        id: id,
        name: body.name,
        number: body.number
    }


    notes = notes.concat(note)

    response.json(note)

})

app.get('/api/persons/info', (request, response) => {
    const phoneEntriesNo = notes.length
    const time = new Date()
    response.send(`Phonebook has info for ${phoneEntriesNo} people</br>${time}`)
})


app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)

    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})