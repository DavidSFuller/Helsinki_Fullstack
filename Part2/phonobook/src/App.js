import { useState } from 'react'

const Numbers = ({person}) => <div>{person.name}</div>


const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 

  const addPerson = (event) => {
    event.preventDefault()
    console.log(newName)
    if (persons.some(e => e.name === newName)) {
      console.log('found')
      alert(`${newName} is already added to phonebook`)
    }
    else {
      console.log('not found')
      const newObject = {name: newName,}
      setPersons(persons.concat(newObject))
      setNewName('')
    }
  }

  const [newName, setNewName] = useState('')

  const handleNameChange = (event) => setNewName(event.target.value)

  return (
    <div>
      <div>debug: {newName}</div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input 
           value={newName} 
           onChange={handleNameChange}
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