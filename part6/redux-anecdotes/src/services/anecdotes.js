import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (content) => {
  const object = { content, votes: 0 }
  const response = await axios.post(baseUrl, object)
  return response.data
}

const addVote = async (id) => {
  const anecdoteUrl = `${baseUrl}/${id}`
  const objecttoUpdate = await axios.get(anecdoteUrl).then(response => response.data)
  console.log(objecttoUpdate)
  objecttoUpdate.votes = objecttoUpdate.votes + 1
  const response = await axios.put(anecdoteUrl, objecttoUpdate)
  return response.data
}

export default { getAll, createNew, addVote }