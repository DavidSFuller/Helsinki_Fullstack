import { useState, useEffect } from 'react'
import Filter       from './components/Filter'
import PersonForm   from './components/PersonForm'
import Persons      from './components/Persons'
import personService from './services/persons'


const App = () => {


  // State Variables
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')

  // Event Handlers
  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setNameFilter(event.target.value)

  useEffect(() => {
    personService
      .getAll()
      .then(persons => {
        setPersons(persons)
      })
  }, [])

  console.log('render', persons.length, 'persons')

  const addPerson = (event) => {
    event.preventDefault()
    const found = persons.find(e => e.name === newName)
    console.log('found:',found)
    if ( found !== undefined ) {
      if (window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`))
        {
          const newperson = {id:found.id,
                             name:found.name,
                             number:newNumber}
          personService.updatePerson(found.id, newperson)
          setPersons(persons.map(p => (p.id !== found.id) ? p : newperson ))
      }
    }
    else {
      const newObject = {name: newName,
                         number: newNumber}
      personService
        .create(newObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
      })
    }
  }

  const removePerson = (name,id) => {
    if(window.confirm('Delete ' + name + '?')) {
      personService.remove(id)
      setPersons(persons.filter(p => p.id !== id))
    }
  }

  // Other functions
  const namesToShow = (nameFilter === '')
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(nameFilter.toLowerCase()) )

  // ---------- Main body -----------
    return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={nameFilter} onChange={handleFilterChange} />
      <h3>Add a new entry</h3>
      <PersonForm onSubmit={addPerson}
                  nameValue={newName}
                  numberValue={newNumber} 
                  nameOnChange={handleNameChange} 
                  NumberOnChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={namesToShow} removeFn={removePerson}/>
    </div>
  )
}

export default App