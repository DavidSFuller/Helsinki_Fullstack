import { useQuery, useMutation, useQueryClient } from "react-query";
import { getAnecdotes, updateAnecdote } from "../requests";
import { useNotificationDispatch } from "./NotificationContext";
import { useNotificationValue } from "./NotificationContext";

const AnecdoteList = () => {
  const queryClient = useQueryClient();
  const dispatch = useNotificationDispatch();
  const oldNotification = useNotificationValue();

  const AnecdoteMutation = useMutation(updateAnecdote, {
    onSuccess: () => {
      queryClient.invalidateQueries("anecdotes");
    },
  });

  const handleVote = (anecdote) => {
    //console.log("oldNotification:", oldNotification);
    if (oldNotification.timeoutId) {
      //console.log("clear timeout:", oldNotification.timeoutId);
      clearTimeout(oldNotification.timeoutId);
    }
    AnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 });
    const timeoutId = setTimeout(() => {
      dispatch({ notification: null, timeoutId: null });
    }, 5000);
    //console.log("notification:", notification);
    dispatch({
      text: `Voted for anecdote '${anecdote.content}'`,
      timeoutId: timeoutId,
    });
  };

  const result = useQuery("anecdotes", getAnecdotes);
  
   if (result.isLoading) {
     return <div>loading data...</div>;
  } else if (result.isError) {
     return <div>anecdote service not available due to problems in server</div>;
  }

  const anecdotes = result.data;

  return anecdotes.map((anecdote) => (
    <div key={anecdote.id}>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={() => handleVote(anecdote)}>vote</button>
      </div>
    </div>
  ));
};

export default AnecdoteList;
