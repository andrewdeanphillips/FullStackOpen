import { useContext } from "react"
import NotificationContext from "../NotificationContext"

const AnecdoteForm = ({ newAnecdoteMutation } ) => {
  const [notification, notificationDispatch] = useContext(NotificationContext)


  const onCreate = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0})
    notificationDispatch({ type: 'SET', payload: `Created anecdote ${content}`})
    setTimeout(() => notificationDispatch({ type: 'CLEAR' }), 5000)

}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm