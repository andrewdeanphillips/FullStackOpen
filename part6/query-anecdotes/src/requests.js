import axios from "axios"

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = () =>
    axios.get(baseUrl).then(res => res.data)

export const createAnecdote = async (newAnecdote) => {
    try {
        const response = await axios.post(baseUrl, newAnecdote)
        return response.data
    } catch (error) {
        if (error.response && error.response.status === 400) {
            throw new Error('Error, anecdote must be >= 5 characters long')
        }
        throw error
    }
}


export const updateAnecdote = updatedAnecdote =>
    axios.put(`${baseUrl}/${updatedAnecdote.id}`, updatedAnecdote).then(res => res.data)