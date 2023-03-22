const {mostLikes} = require('../utils/list_helper.js')

const expectedAuthor = {
  author: "Edsger W. Dijkstra",
  likes: 17
}

describe('Most Likes', () => {
  const blogs = require('./testData')

  test('Most Likes', () => {
    const result = mostLikes(blogs)
    expect(result).toEqual(expectedAuthor)
  })

})