import { useSelector, useDispatch } from "react-redux";
import { updateVote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const AnecdoteList = () => {
  const dispatch = useDispatch();
  const anecdotes = useSelector((state) => {
    return state.anecdotes.filter(
      (anecdote) => anecdote.content.indexOf(state.filter) !== -1
    );
  });

  const vote = (id) => {
    const anecdoteToUpdate = anecdotes.find((a) => a.id === id);
    dispatch(updateVote(anecdoteToUpdate));
    dispatch(setNotification(`You voted '${anecdoteToUpdate.content}'`, 5));
  };

  return (
    <div>
      {anecdotes
        .sort((a, b) => b.votes - a.votes)
        .map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote.id)}>vote</button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default AnecdoteList;
