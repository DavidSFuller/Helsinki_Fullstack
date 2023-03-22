const listHelper = require('../utils/list_helper.js')

describe('favourite blog', () => {
  const blogs = require('./testData')

  test('favourite blog', () => {
  /*
    // this gets the record from the _id
    const blog = blogs.filter(blog => blog._id === '5a422b3a1b54a676234d17f9')[0]
    console.log('Expecting blog:', {blog})

    const expected = {
      title: blog.title,
      author: blog.author,
      likes: blog.likes}
*/
    const expected = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    }

    console.log({expected})

    const result = listHelper.favouriteBlog(blogs)
    expect(result).toEqual(expected)
  })
})