import rewire from 'rewire'
const should = require('chai').should()

describe('lib', () => {
  const lib = rewire('../lib')

  it('should have default function export', () => {
    should.exist(lib.default)
    lib.default.should.be.a('function')
  })
})
