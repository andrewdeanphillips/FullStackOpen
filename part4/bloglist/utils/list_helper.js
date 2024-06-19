const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, item) => {
        return sum + item.likes
    }, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.length === 0
        ? {}
        : blogs.reduce(
            (prev, current) => {
                return prev.likes > current.likes
                    ? prev
                    : current
            }
        )
}

const mostBlogs = (blogs) => {
    const blogsByAuthors = _.countBy(blogs, (blog) => {
        return blog.author
    })

    const entries = Object.entries(blogsByAuthors)

    const most = entries.reduce((max, entry) => {
        return entry[1] > max[1]
            ? entry
            : max
    }, ["", 0])

    return {
        author: most[0],
        blogs: most[1]
    }
}

const mostLikes = (blogs) => {
    const totalLikesForAuthors =
        _(blogs)
            .groupBy('author')
            .map((objs, key) => ({
                'author': key,
                'total likes': _.sumBy(objs, 'likes')
            }))
            .value()

    const most = totalLikesForAuthors.reduce((max, entry) => {
        return entry['total likes'] > max['total likes']
            ? entry
            : max
    }, { 'author': '', 'total likes': 0 })

    return {
        author: most['author'],
        likes: most['total likes']
    }
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}