import { useDispatch, useSelector } from "react-redux";
import { createAnecdote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const AnecdoteForm = () => {
  const dispatch = useDispatch();
  const lastNotification = useSelector((state) => state.notification);
  const lastTimeOutId = (lastNotification) ? lastNotification.timeoutId : null;
  
  const addAnecdote = async (event) => {
    event.preventDefault();
    if (event.target.content.value === "") return;
    const content = event.target.content.value;
    event.target.content.value = "";
    //console.log("new content:", content);
    dispatch(createAnecdote(content));
    dispatch(setNotification(`new anecdote '${content}' added.`, 10, lastTimeOutId));
   };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <input name="content" /><br/>
        <button id="create-button">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
