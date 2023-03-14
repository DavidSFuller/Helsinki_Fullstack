const Numbers = ({person,removeFn}) => {
 
//  console.log('in Numbers:',removeFn)
  return (
    <div>
      {person.name} {person.number+' '} 
      <button onClick={removeFn}>
          delete
      </button>
    </div>
  )
}

const Persons = ({persons, removeFn}) => {
  console.log('In Persons:', persons, removeFn)
  return (
    <div>
      {persons.map(person =>
         <Numbers
           key={person.id}
           person={person}
           removeFn={() => removeFn(person.name,person.id)} />)}
    </div>
  )
}

export default Persons