import { useState } from 'react'
import Filter       from './components/Filter'
import PersonForm   from './components/PersonForm'
import Persons      from './components/Persons'

const App = () => {

  // State Variables
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')

  const [persons, setPersons] = useState([
    { name: 'Arto Hellas',
      number: '01234 678912'},
      {name: 'Ada Lovelace',
      number: '+441213456789'},
      {name: 'Rosamund Pike',
      number: '+443327633701'}
    ]) 

  // Event Handlers
  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setNameFilter(event.target.value)

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(e => e.name === newName)) {
      alert(`${newName} is already added to phonebook`)
    }
    else {
      const newObject = {name: newName,
                         number: newNumber}
      setPersons(persons.concat(newObject))
      setNewName('')
      setNewNumber('')
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
      <Persons persons={namesToShow}/>
    </div>
  )
}

export default App