import { store } from '../store/index.js'

describe('Redux Store', () => {
  it('should be defined', () => {
    expect(store).toBeDefined()
  })

  it('should have getState function', () => {
    expect(typeof store.getState).toBe('function')
  })
})