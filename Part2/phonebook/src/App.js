import { useState, useEffect } from 'react'
import Filter       from './components/Filter'
import PersonForm   from './components/PersonForm'
import Persons      from './components/Persons'
import Notification from './components/Notification'
import personService from './services/persons'


const App = () => {

  // State Variables
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [myMessage, setMyMessage] = useState(null)

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
          
          personService
            .update(found.id, newperson)
            .then (() => {
              setPersons(persons.map(p => (p.id !== found.id) ? p : newperson ))
              setNewName('')
              setNewNumber('')
              setMyMessage(`Phone number for ${found.name} updated`)
            })
            .catch( (error) => {
                console.log('result=',error.message)
                if (error.response.status === 404) {
                  setPersons(persons.filter(p => p.id !== found.id))
                  setMyMessage(`Information for ${found.name} has already been removed from server`)
                }
                else
                  setMyMessage(`Update for ${found.name} failed: ${error.message}`)
            })
          setTimeout(() => {setMyMessage(null)}, 5000)        }
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
          setMyMessage(`Added ${newObject.name}`)
        })
        .catch( (error) => {
          console.log('result=',error.message)
          setMyMessage(`Add for ${found.name} failed: ${error.message}`)
        })
      setTimeout(() => {setMyMessage(null)}, 5000)
    }
  }

  const removePerson = (name,id) => {
    if(window.confirm('Delete ' + name + '?')) {
      personService
        .remove(id)
        .then (() => {
          setPersons(persons.filter(p => p.id !== id))
          setMyMessage(`Removed ${name}`)
        })
        .catch( (error) => {
          console.log('result=',error)
          if (error.response.status === 404) {
            setMyMessage(`${name} has already been removed`)
            setPersons(persons.filter(p => p.id !== id))
          }
          else {
            setMyMessage(`Remove of ${name} failed: ${error.message}`)
          }
        })
      setTimeout(() => {setMyMessage(null)}, 5000)
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
      <Notification message={myMessage} />
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