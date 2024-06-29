const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: 'Facebook Blog',
        url: 'https://www.facebook.com',
        likes: 5
    },
    {
        title: 'Myspace Blog',
        url: 'https://www.myspace.com',
        likes: 3
    }
]

const newBlog = {
    title: 'LinkedIn Blog',
    url: 'https://www.linkedin.com',
    likes: 7
}

const blogWithoutLikes = {
    title: 'YouTube Blog',
    url: 'https://www.youtube.com'
}

const blogWithoutTitle = {
    url: 'https://www.instagram.com',
    likes: 10
}

const blogWithoutUrl = {
    title: 'Instagram Blog',
    author: 'Triple H',
    likes: 10
}

const initialUsers = [
    {
        username: 'trumper',
        name: 'Donald Trump',
        password: 'freedom'
    },
    {
        username: 'bbam',
        name: 'Barrack Obama',
        password: 'ilovebeingbarrack'
    }
]


const newUser = {
    username: 'jc28',
    name: 'John Cena',
    password: 'WWE'
}

const shortUsernameUser = {
    username: 'ff',
    name: 'Short UserMan',
    password: 'fsdffsfs'
}

const shortPasswordUser = {
    username: 'shortpass',
    name: 'Short PassMan',
    password: 'hc'
}

const existingUsernameUser = {
    username: 'trumper',
    name: 'Michael Trump',
    password: 'trumpppppp'
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialBlogs,
    newBlog,
    blogWithoutLikes,
    blogWithoutTitle,
    blogWithoutUrl,
    initialUsers,
    newUser,
    shortUsernameUser,
    shortPasswordUser,
    existingUsernameUser,
    blogsInDb,
    usersInDb
}