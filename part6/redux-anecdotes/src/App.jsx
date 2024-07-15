import AnecdoteForm from './components/AnecdoteForm'
import { addVoteTo, addAnecdote } from './reducers/anecdoteReducer'
import { useSelector, useDispatch } from 'react-redux'

const App = () => {
  const anecdotes = useSelector(state => state).sort((a,b) => b.votes - a.votes)
  const dispatch = useDispatch()

  const addVote = (id) => {
    console.log('add vote id: ', id)
    dispatch(addVoteTo(id))
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => addVote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
      <AnecdoteForm />
    </div>
  )
}

export default App