import { useState } from 'react'

const Header = (props) => {
  console.log(props)
return (
    <h1> {props.text} </h1>
)
}

const Result = (props) => {
  console.log(props)
return (
    <div><b>{props.text} {props.amount}</b></div>
)
}

function App() {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Header text="give feedback"/>
      <button onClick={() => setGood(good + 1)}>good</button>
      <button onClick={() => setNeutral(neutral + 1)}>neutral</button>
      <button onClick={() => setBad(bad + 1)}>bad</button>
      <h1>statistics</h1>
      <p/>
      <Result text="good" amount={good}/>
      <Result text="neutral" amount={neutral}/>
      <Result text="bad" amount={bad}/>
    </div>
  );
}

export default App;
