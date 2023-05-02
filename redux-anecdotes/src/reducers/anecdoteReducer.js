import { createSlice } from "@reduxjs/toolkit";
import anecdoteservice from "../services/anecdotes";

const initialState = [];

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState,
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload);
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
    updateAnecdote(state, action) {
      return state.map((anecdote) =>
        anecdote.id !== action.payload.id ? anecdote : action.payload
      );
    },
  },
});

export const { appendAnecdote, setAnecdotes, updateAnecdote } =
  anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteservice.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteservice.createNew(content);
    dispatch(appendAnecdote(newAnecdote));
  };
};

export const vote = (anecdote) => {
  //console.log("anecdote to change:", anecdote)
  const changedAnecdote = {
    ...anecdote,
    votes: anecdote.votes + 1,
  };

  return async (dispatch) => {
    const newAnecdote = await anecdoteservice.update(changedAnecdote);
    dispatch(updateAnecdote(newAnecdote));
  };

};

export default anecdoteSlice.reducer;
