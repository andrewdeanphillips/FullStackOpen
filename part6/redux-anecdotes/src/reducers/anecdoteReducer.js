const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)

const reducer = (state = initialState, action) => {
  console.log('state now: ', state)
  console.log('action', action)

  switch(action.type) {
  case 'ADD_ANECDOTE': {
    return [...state, asObject(action.payload.anecdote)]
  }
  case 'ADD_VOTE': {
    console.log('payload: ', action.payload)
    const id = action.payload.id
    console.log('state now: ', state)
    const anecdoteToChange = state.find(a => a.id === id)
    console.log('anecdote to change: ',anecdoteToChange)
    const changedAnecdote = {
      ...anecdoteToChange,
      votes: anecdoteToChange.votes+1
    }
    console.log('changed anecdote: ', changedAnecdote)

    return state.map(anecdote => anecdote.id !== id ? anecdote: changedAnecdote
    )
  }

  default:
    return state
  }


}

export const addVoteTo = (id) => {
  console.log('vote id: ', id)
  return {
    type: 'ADD_VOTE',
    payload: { id }
  }
}

export const addAnecdote = (anecdote) => {
  return {
    type: 'ADD_ANECDOTE',
    payload: { anecdote }
  }
}



export default reducer