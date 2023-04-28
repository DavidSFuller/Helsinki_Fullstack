import { useDispatch } from "react-redux";
import { createAnecdote } from "../reducers/anecdoteReducer";

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const addAnecdote = (event) => {
    event.preventDefault();
    if (event.target.content.value === "") return;
    const content = event.target.content.value;
    event.target.content.value = "";
    //console.log("new content:", content);
    dispatch(createAnecdote(content));
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
