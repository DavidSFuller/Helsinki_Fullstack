const Header = (props) => <h2>{props.name}</h2>

const Total = ({ sum }) => {
   return(
    <p>
    total of {sum} exercises
    </p>
  )
}

const Part = ({ part }) => (<div key={part.id}>
    <p>
      {part.name} {part.exercises}
    </p>
  </div>
  )

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
    </div>
  )
}

const Course = ({ course }) => {
  return (
    <div key={course.id}>
       <Header name={course.name} />
      <Content parts={course.parts} />
      <Total sum={course.parts.map((part) => part.exercises)
                              .reduce((sum,exercises) => sum + exercises, 0)} />
    </div>
  )
}

export default Course