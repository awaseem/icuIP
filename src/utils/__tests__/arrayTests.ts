import { difference } from '../array'

describe('Array tests', () => {
  it('should diff with no problems', () => {
    const expectedValue = [1]
    const actualValue = difference([1, 2, 3, 4], [2, 3, 4])

    expect(actualValue).toEqual(expectedValue)
  })

  it('should diff all the values since the array is empty', () => {
    const expectedValue = [1, 2, 3, 4]
    const actualValue = difference([1, 2, 3, 4], [])

    expect(actualValue).toEqual(expectedValue)
  })

  it('should return empty array since no values are within the comparing array', () => {
    const expectedValue: readonly number[] = []
    const actualValue = difference([], [1, 2, 3, 4, 5, 6, 7])

    expect(actualValue).toEqual(expectedValue)
  })
})
