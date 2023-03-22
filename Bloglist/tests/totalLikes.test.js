const {totalLikes} = require('../utils/list_helper.js')

describe('total likes', () => {
  const blogs = require('./testData')
  const expectedSum = 36

  test('sum of likes = '+ expectedSum, () => {
    const result = totalLikes(blogs)
    expect(result).toBe(expectedSum)
  })
})