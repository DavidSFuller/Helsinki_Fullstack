import { useDispatch, useSelector } from "react-redux";
import { vote } from "../reducers/anecdoteReducer";
import {
  notificationSet,
  notificationClear,
} from "../reducers/notificationReducer";

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <div>
      {anecdote.content}&nbsp; has {anecdote.votes} vote
      {anecdote.votes === 1 ? " " : "s "}
      <button onClick={handleClick}>vote</button>
    </div>
  );
};

const AnecdoteList = () => {
  const dispatch = useDispatch();
  const myState = useSelector((state) => state);
  //console.log("state:", myState);
  const anecdotes = useSelector((state) => myState.anecdotes);
  const filter = useSelector((state) => state.filter).toLowerCase();

  const anecdotesToShow =
    filter === ""
      ? [...anecdotes]
      : anecdotes.filter((anecdote) => {
          return anecdote.content.toLowerCase().includes(filter);
        });
  //console.log("anecdotesToShow:", anecdotesToShow)
  const orderedAnecdotes = anecdotesToShow.sort(
    (a1, a2) => a2.votes - a1.votes
  );

  return (
    <div>
      {orderedAnecdotes.map((anecdote) => (
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => {
            dispatch(vote(anecdote));
            dispatch(notificationSet(`you voted ${anecdote.content}`));
            setTimeout(() => {
              dispatch(notificationClear());
            }, 5000);
          }}
        />
      ))}
    </div>
  );
};

export default AnecdoteList;
