import { useState } from 'react'

const getRandomInt = (max) => {
  const randomNumber = Math.random()
  const selection = Math.floor(randomNumber* max); // 0<=max<1
  console.log('getRandomInt',selection)
  return selection
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  
  const [selected, setSelected] = useState(0)
  const [votes, setVote] = useState(Array.from({ length: anecdotes.length }).fill(0))
  const [mostVotes, setMost] = useState(-1)
  console.log('Votes', votes)
  
  // Math.getRandomInt gave error: "Uncaught TypeError: Math.getRandomInt is not a function"
  const handleNext = () => {
    let selection = getRandomInt(anecdotes.length)
    console.log('selection:',selection)
    setSelected(selection)
    }

 const handleVote = () => {
  const copyVotes = [ ...votes ]
  console.log('To add 1 to element ', selected ,' from ', copyVotes[selected])
  copyVotes[selected] +=1
  console.log('mod copyVotes:', copyVotes)
  setVote(copyVotes)
  console.log('mostVotes=',mostVotes, copyVotes[selected], copyVotes[mostVotes])
  if (mostVotes === -1 || copyVotes[selected] > copyVotes[mostVotes]) {
    setMost(selected)
    console.log('Most votes set to ', mostVotes)
  }
}

console.log(selected)

  if (mostVotes===-1) {
    console.log('mostVotes===-1')
    return (
      <div>
        <h1>Anecdote of the day</h1>
        {anecdotes[selected]}
        <br/>Has {votes[selected]} votes
        <br/><button onClick={handleVote}>vote</button>
        <button onClick={handleNext}>next anecdote</button>
      </div>
    )
  }
  console.log('mostVotes not equal to -1')

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]}
      <br/>Has {votes[selected]} votes
      <br/><button onClick={handleVote}>vote</button>
      <button onClick={handleNext}>next anecdote</button>
      <h1>Anecdotes with most votes</h1>
      {anecdotes[mostVotes]}
    </div>
  )
}

export default App;
