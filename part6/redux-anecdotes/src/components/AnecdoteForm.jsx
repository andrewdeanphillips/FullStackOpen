import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const handleAddAnecdote = (event) => {
    event.preventDefault()
    dispatch(addAnecdote(event.target.anecdote.value))
    dispatch(setNotification(`new anecdote ${event.target.anecdote.value} created`))
    event.target.anecdote.value = ''
    setTimeout(() => {
      dispatch(clearNotification())
    }, 5000)
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleAddAnecdote}>
        <div><input name ="anecdote"/></div>
        <button type="submit">create</button>
      </form>
    </div>

  )
}

export default AnecdoteForm