import { useSelector, useDispatch } from "react-redux";
import { voteAnecdote } from "../reducers/anecdoteReducer";
import { notificationChange } from "../reducers/notificationReducer";

const AnecdoteList = () => {
  const dispatch = useDispatch();
  const anecdotes = useSelector((state) => {
    return state.anecdotes.filter(
      (anecdote) => anecdote.content.indexOf(state.filter) !== -1
    );
  });

  const vote = (id) => {
    dispatch(voteAnecdote(id));
    dispatch(
      notificationChange(
        `You voted '${anecdotes.find((a) => a.id === id).content}'`
      )
    );
    setTimeout(() => {
      dispatch(notificationChange(""));
    }, 5000);
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
