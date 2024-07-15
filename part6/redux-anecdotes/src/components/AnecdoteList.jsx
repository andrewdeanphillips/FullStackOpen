import { useSelector, useDispatch } from 'react-redux'
import { addVoteTo } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(({ filter, anecdotes }) => {
    return anecdotes.filter(anecdote => {
      return anecdote.content.toLowerCase().includes(filter.toLowerCase())
    })

  })

  anecdotes.sort((a,b) => b.votes - a.votes)
  const dispatch = useDispatch()

  const addVote = (id) => {
    console.log('add vote id: ', id)
    dispatch(addVoteTo(id))
  }

  return (
    <div>
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
    </div>

  )
}

export default AnecdoteList