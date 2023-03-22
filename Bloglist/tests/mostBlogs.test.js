const {mostBlogs} = require('../utils/list_helper.js')

const expectedAuthor = {
  author: 'Robert C. Martin',
  blogs: 3
}
console.log('looking for:', JSON.stringify(expectedAuthor, null, 2))

describe('Most Blogs', () => {
  const blogs = require('./testData')

  test('Most Blogs', () => {
    const result = mostBlogs(blogs)
    console.log('found author:', JSON.stringify(result, null, 2))
    expect(result).toEqual(expectedAuthor)
  })

})