const Blog = require('../models/blog')

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
const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs, newBlog, blogWithoutLikes, blogWithoutTitle, blogWithoutUrl, blogsInDb
}