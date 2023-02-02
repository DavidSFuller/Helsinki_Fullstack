import { useState } from 'react'

const Header = (props) => {
  console.log(props)
return (
    <h1> {props.text} </h1>
)
}

const StatisticLine = (props) => {
  console.log(props)
return (
    <div><b>{props.text} {props.amount}</b></div>
)
}

const Results = ({good, neutral, bad, all}) => {
  if (all === 0) {
    return(<div><b>No feedback given</b></div>)
  }
  return (
    <div>
      <StatisticLine text="good" amount={good}/>
      <StatisticLine text="neutral" amount={neutral}/>
      <StatisticLine text="bad" amount={bad}/>
      <StatisticLine text="all" amount={all}/>
      <StatisticLine text="average" amount={(good-bad)/all}/>
      <StatisticLine text="positive" amount={good/all*100 + ' %'}/>
     </div>
  )
}


const Button = (props) => {
    return (
    <div>
      <button onClick={props.onClick}>{props.text}</button>
    </div>
  )
}

function App() {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const all = good + neutral + bad
  const GoodClick = () => {setGood(good + 1)}
  const NeutralClick = () => {setNeutral(neutral + 1)}
  const BadClick = () => {setBad(bad + 1)}

  console.log(good,neutral,bad,all)
  
   return (
    <>
      <Header text="give feedback"/>
      <Button onClick={GoodClick} text='good' />
      <Button onClick={NeutralClick} text='neutral'/>
      <Button onClick={BadClick} text='bad'/>
      <h1>statistics</h1>
      <p/>
      <Results good={good} neutral={neutral} bad={bad} all={all}/>
     </>
  );
}

export default App;
