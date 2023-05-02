import { useDispatch, useSelector } from "react-redux";
import { vote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

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
  const anecdotes = useSelector((state) => state.anecdotes);
  const filter = useSelector((state) => state.filter).toLowerCase();
  const lastNotification = useSelector((state) => state.notification);
  const lastTimeOutId = (lastNotification) ? lastNotification.timeoutId : null;

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
            dispatch(setNotification(`you voted '${anecdote.content}'`, 10, lastTimeOutId));
          }}
        />
      ))}
    </div>
  );
};

export default AnecdoteList;
