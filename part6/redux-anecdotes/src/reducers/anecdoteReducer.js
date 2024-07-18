import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    removeAnecdote(state, action) {
      const id = action.payload
      return state.filter(anecdote => anecdote.id !== id)
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }

  }
})

export const { removeAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initaliseAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const newAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const addVoteTo = (id) => {
  return async dispatch => {
    const updatedAnecdote = await anecdoteService.addVote(id)
    dispatch(removeAnecdote(id))
    dispatch(appendAnecdote(updatedAnecdote))
  }
}

export default anecdoteSlice.reducer