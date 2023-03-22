const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  if (blogs.length===0) return 0
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favouriteBlog = (blogs) => {
  const blog = blogs.reduce((ret, blog) => (ret===undefined ? blog : (ret.likes < blog.likes) ? blog : ret ), undefined)
  const favourite = {
    title: blog.title,
    author: blog.author,
    likes: blog.likes}

  console.log({favourite})
  
  return (favourite)
}

const mostBlogs = (blogs) => {
  const authors = 
    blogs
      .reduce((authors, blog) => {
        authors[blog.author] = authors[blog.author] || {author:blog.author, blogs: 0}
        authors[blog.author].blogs+=1
        return authors
      }, [])
 
  const result = 
    Object.keys(authors).reduce((mostblogs, key) => {
      mostblogs = (authors[key].blogs > mostblogs.blogs) ? authors[key] : mostblogs
      return(mostblogs)
    }, {name:'no entries', blogs: 0})

  return (result)

}

const mostLikes = (blogs) => {
  const authors = 
    blogs
      .reduce((authors, blog) => {
        authors[blog.author] = authors[blog.author] || {author: blog.author, likes: 0}
        authors[blog.author].likes+=blog.likes
        return authors
      }, [])
 
  const result = 
    Object.keys(authors).reduce((mostlikes, key) => {
      mostlikes = (authors[key].likes > mostlikes.likes) ? authors[key] : mostlikes
      return(mostlikes)
    }, {author:'no entries', likes: 0})

  return (result)

}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}
