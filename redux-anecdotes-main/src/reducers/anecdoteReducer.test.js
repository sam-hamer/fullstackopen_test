import deepFreeze from "deep-freeze";
import anecdoteReducer from "./anecdoteReducer";

describe("anecdote reducer", () => {
  const initialState = [
    {
      content: "test",
      id: "1",
      votes: 0,
    },
  ];

  test("vote is incremented", () => {
    const action = {
      type: "VOTE",
      payload: {
        id: "1",
      },
    };
    const state = initialState;

    deepFreeze(state);
    const newState = anecdoteReducer(state, action);
    expect(newState).toEqual([
      {
        content: "test",
        id: "1",
        votes: 1,
      },
    ]);
  });

  test("create new anecdote", () => {
    const action = {
      type: "CREATE",
      payload: {
        content: "test",
        id: "2",
        votes: 5,
      },
    };
    const state = initialState;

    deepFreeze(state);
    const newState = anecdoteReducer(state, action);
    expect(newState).toEqual([
      ...initialState,
      { content: "test", id: "2", votes: 5 },
    ]);
  });
});
