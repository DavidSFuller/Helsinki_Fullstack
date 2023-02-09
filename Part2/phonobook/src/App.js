import { useState } from 'react'

const Numbers = ({person}) => <div>{person.name} {person.number}</div>


const App = () => {

  // State Variables
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')

  const [persons, setPersons] = useState([
    { name: 'Arto Hellas',
      number: '01287 678191'},
      {name: 'Ada Lovelace',
      number: '+441913739059'},
      {name: 'Ros Fuller',
      number: '+44790598968'}
    ]) 

  // Event Handlers
  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setNameFilter(event.target.value)

  const addPerson = (event) => {
    event.preventDefault()
    console.log(newName)
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
      <div>debug: {newName}-{newNumber}-{nameFilter}</div>
      <h2>Phonebook</h2>
        filter shown with <input value={nameFilter} onChange={handleFilterChange} />
      <h2>Add a new entry</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit"
          >add</button>
        </div>
      </form>
      <h2>Numbers</h2>
        {namesToShow.map(person => <Numbers key={person.name} person={person} />)}
    </div>
  )
}

export default App