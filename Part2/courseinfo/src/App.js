const Header = (props) => <h1>{props.coursename}</h1>;

const Total = ({ sum }) => {
   return(
    <p>
    Number of exercises {sum}
    </p>
  )
}

const Part = ({ part }) => (<div key={part.id}>
    <p>
      {part.partname} {part.exercises}
    </p>
  </div>
  )

//  <div>{parts.map(part => <p key={part.id}>{part.partname} {part.exercises}</p>)}</div>

const Content = ({ parts }) => {
  console.log("Content is ", parts);
  return (
    <div>
      {parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
    </div>
  )
}

const Course = ({ course }) => {
  console.log(course);
  return (
    <div>
      <Header coursename={course.coursename} />
      <Content parts={course.parts} />
      <Total sum={course.parts.map((part) => part.exercises)
                              .reduce((sum,exercises) => sum + exercises, 0)} />
    </div>
  );
};

const App = () => {
  const course = {
    id: 1,
    coursename: "Half Stack application development",
    parts: [
      {
        partname: "Fundamentals of React",
        exercises: 10,
        id: 1,
      },
      {
        partname: "Using props to pass data",
        exercises: 7,
        id: 2,
      },
      {
        partname: "State of a component",
        exercises: 14,
        id: 3,
      },
      {
        partname: "4th entry",
        exercises: 11,
        id: 4,
      },
      {
        partname: "5th element",
        exercises: 1,
        id: 5,
      },
    ],
  };

  return <Course course={course} />;
};

export default App;
