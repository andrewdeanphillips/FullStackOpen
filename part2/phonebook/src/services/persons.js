import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

const update = newObject => {
    const updateUrl = baseUrl + `/${newObject.id}`
    const request = axios.put(updateUrl, newObject)
    return request.then(response => response.data)
}

const erase = id => {
    const deleteUrl = baseUrl + `/${id}`
    const request = axios.delete(deleteUrl)
    return request.then(response => response.data)
}

export default { getAll, create, update, erase}