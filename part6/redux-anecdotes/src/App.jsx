import { addVoteTo, addAnecdote } from './reducers/anecdoteReducer'
import { useSelector, useDispatch } from 'react-redux'

const App = () => {
  const anecdotes = useSelector(state => state).sort((a,b) => b.votes - a.votes)
  const dispatch = useDispatch()

  const addVote = (id) => {
    console.log('add vote id: ', id)
    dispatch(addVoteTo(id))
  }

  const handleAddAnecdote = (event) => {
    event.preventDefault()
    console.log(event.target.anecdote.value)
    dispatch(addAnecdote(event.target.anecdote.value))
    event.target.anecdote.value = ''
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
      <h2>create new</h2>
      <form onSubmit={handleAddAnecdote}>
        <div><input name ="anecdote"/></div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default App