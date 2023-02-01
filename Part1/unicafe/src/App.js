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

const Statistics = ({good, bad, all}) => {
  return (  
    <div>
      <b>average {(good-bad) / all}</b>
      <br/><b>positive {good / all}</b>
    </div>)
}

const Results = ({good, neutral, bad, all}) => {
  if (all === 0) {
    return(<div><b>No feedback given</b></div>)
  }
  return (
    <div>
      <Result text="good" amount={good}/>
      <Result text="neutral" amount={neutral}/>
      <Result text="bad" amount={bad} all={all}/>
      <Result text="all" amount={all} all={all}/>
      <Statistics good={good} bad={bad} all={all}/>
    </div>
  )
}

function App() {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const all = good + neutral + bad
  console.log(good,neutral,bad,all)
  
   return (
    <div>
      <Header text="give feedback"/>
      <button onClick={() => setGood(good + 1)}>good</button>
      <button onClick={() => setNeutral(neutral + 1)}>neutral</button>
      <button onClick={() => setBad(bad + 1)}>bad</button>
      <h1>statistics</h1>
      <p/>
      <Results good={good} neutral={neutral} bad={bad} all={all}/>
     </div>
  );
}

export default App;
