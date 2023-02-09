import { useState } from 'react'

const Numbers = ({person}) => <div>{person.name} {person.number}</div>


const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas',
      number: '01287 678191' }
  ]) 

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

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)

  return (
    <div>
      <div>debug: {newName} {newNumber}</div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
      <div>
          name: <input 
           value={newName} 
           onChange={handleNameChange}
                />
        </div>
        <div>
          number: <input 
           value={newNumber} 
           onChange={handleNumberChange}
                />
        </div>
        <div>
          <button type="submit"
          >add</button>
        </div>
      </form>
      <h2>Numbers</h2>
        {persons.map(person => <Numbers key={person.name} person={person} />)}
    </div>

  )
}

export default App