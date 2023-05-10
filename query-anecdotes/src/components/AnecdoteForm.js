import { useMutation, useQueryClient } from "react-query";
import { createAnecdote } from "../requests";
import { useNotificationDispatch } from "./NotificationContext";
import { useNotificationValue } from "./NotificationContext";

const AnecdoteForm = () => {
  const queryClient = useQueryClient();
  const dispatch = useNotificationDispatch();
  const oldNotification = useNotificationValue();

  const logMessage = (text) => {
    if (oldNotification.timeoutId) {
      clearTimeout(oldNotification.timeoutId);
    }
    if (text) {
      const timeoutId = setTimeout(() => {
        dispatch({ text: null, timeoutId: null });
      }, 5000);
      try {
        dispatch({ text, timeoutId });
      } catch (e) {
        console.log("error:", e.data);
      }
    }
  };

  const newAnecdoteMutation = useMutation(createAnecdote, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("anecdotes");
      logMessage(`Added anecdote '${data.content}'`);
    },
    onError: (error) => {
      logMessage(`error: ${error.response.data.error}`);
    },
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    try {
      newAnecdoteMutation.mutate({ content, votes: 0 });
    } catch (e) {
      logMessage(e.data)
   }
};

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
