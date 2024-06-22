const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: 'Facebook Blog',
        author: 'Mark',
        url: 'https://www.facebook.com',
        likes: 5
    },
    {
        title: 'Myspace Blog',
        author: 'Tom',
        url: 'https://www.myspace.com',
        likes: 3
    }
]

const newBlog = {
    title: 'LinkedIn Blog',
    author: 'CEO',
    url: 'https://www.linkedin.com',
    likes: 7
}

const blogWithoutLikes = {
    title: 'YouTube Blog',
    author: 'John Cena',
    url: 'https://www.youtube.com'
}

const blogWithoutTitle = {
    author: 'Triple H',
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
    blogsInDb,
    usersInDb
}