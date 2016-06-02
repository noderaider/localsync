import rewire from './rewire'
import chai from 'chai'
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const should = chai.should()

describe('localsync', () => {
  const localsync = require('../lib').default

  it('should have default function export', () => {
    should.exist(localsync)
    localsync.should.be.a('function')
  })
  it('should throw if no handler passed', () => {
    (() => localsync()).should.throw()
  })
  it('should export an object', () => {
    localsync(() => {}).should.be.an('object')
  })
  it('should export startSync, stopSync, isSyncRunning properties', () => {
    const { startSync, stopSync, isSyncRunning } = localsync(() => {})
    should.exist(startSync)
    should.exist(stopSync)
    should.exist(isSyncRunning)
    startSync.should.be.a('function')
    stopSync.should.be.a('function')
    isSyncRunning.should.be.a('function')
  })
})
