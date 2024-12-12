import { createAnecdote } from "../reducers/anecdoteReducer";
import { notificationChange } from "../reducers/notificationReducer";
import { useDispatch } from "react-redux";
import anecdoteService from "../services/anecdotes";

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const createNew = async (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    const newAnecdote = await anecdoteService.createNew(content);
    dispatch(createAnecdote(newAnecdote));
    dispatch(notificationChange(`Added anecdote: '${content}'`));
    setTimeout(() => {
      dispatch(notificationChange(""));
    }, 5000);
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={createNew}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  );
};

export default AnecdoteForm;
