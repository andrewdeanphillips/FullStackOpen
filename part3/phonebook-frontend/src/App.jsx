import { useState, useEffect } from 'react'
import axios from 'axios'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personsService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNewNotification] = useState(null)
  const [notificationColor, setNotificationColor] = useState('green')

  useEffect(() => {
      personsService
        .getAll()
        .then(initialPersons => {
          console.log('promise fufilled')
          setPersons(initialPersons)
        })
  }, [])
  
  const peopleToShow = filter === ('')
    ? persons
    : persons.filter(person => person.name.toLowerCase().startsWith(filter.toLowerCase()))

  console.log(peopleToShow)

  const updateNumber = () => {
    const person = persons.find(p => p.name === newName)
    const changedPerson = { ...person, number: newNumber }
    console.log(changedPerson.id)
    personsService
      .update(changedPerson)
      .then(returnedPerson => {
        const personsRemoved = persons.filter(p => p.id != returnedPerson.id)
        setPersons(personsRemoved.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        displaySuccessNotification('green',
          `${returnedPerson.name}'s number was updated to ${returnedPerson.number}`
        )
      })
      .catch(error => {
        displaySuccessNotification('red',
        `${person.name} was already deleted from the server`
        )
      })
  }

  const addNewNameNumber = () => {
    const personObj = {
      name: newName,
      number: newNumber
    }

    personsService
      .create(personObj)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        displaySuccessNotification('green',
          `${returnedPerson.name}'s was added with the number ${returnedPerson.number}`
        )
      })
  }


  const addName = (event) => {
    event.preventDefault()

    if (persons.some((x) => x.name === newName)) {
      if (confirm(`${newName} is already added to phonebook. Update the number?`)) {
        updateNumber()
        return
      }
      
    } else {
      addNewNameNumber()
    }
  }
  
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const erasePerson = (id) => {
    console.log('erasePerson is', id)
    const person = persons.find(p => p.id === id)
    if (!confirm(`Delete ${person.name}?`)) {
      return
    }

    personsService.erase(id)
    .then(() => {
      setPersons(persons.filter(p => p.id !== id))
      displaySuccessNotification('green', 
        `${person.name} was deleted`
      )
    })
  }

  const displaySuccessNotification = (color, message) => {
    setNotificationColor(color)
    setNewNotification(message)
    setTimeout(() => {
      setNewNotification(null)
    }, 5000)
  }

  return (
    <div>
      <Notification color={notificationColor} message={notification} />
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} addName={addName} />
      <h2>Numbers</h2>
      <Persons persons={persons} erase={erasePerson} />
    </div>
  )
}

export default App