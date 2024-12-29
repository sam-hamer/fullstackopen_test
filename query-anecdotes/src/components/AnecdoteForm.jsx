import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAnecdote } from "../requests";

const AnecdoteForm = ({ setNotification }) => {
  const queryClient = useQueryClient();
  const addAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
      setNotification(`created anecdote '${newAnecdote.content}'`, 5);
    },
    onError: (error) => {
      setNotification(error.response.data.error, 5);
    },
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    console.log("new anecdote");
    addAnecdoteMutation.mutate({ content, important: true });
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
