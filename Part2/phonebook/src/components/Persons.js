const Numbers = ({person}) => <div>{person.name} {person.number}</div>

const Persons = ({persons}) => {
  return (
    <div>
      {persons.map(person => <Numbers key={person.name} person={person} />)}
    </div>
  )
}

export default Persons