import rewire from 'rewire'
import chai from 'chai'
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const should = chai.should()

describe('lib', () => {
  const lib = rewire('../lib')

  it('should have default function export', () => {
    should.exist(lib.default)
    lib.default.should.be.a('function')
  })
  describe('localsync', () => {
    const localsync = lib.default
    it('should throw if no args passed', () => (() => localsync()).should.throw())
    it('should throw if one arg passed', () => (() => localsync('key')).should.throw())
    it('should throw if two args passed', () => (() => localsync('key', () => { foo: 'bar' })).should.throw())
    it('should export an object', () => {
      localsync('namesync', () => { foo: 'bar' }, value => {}).should.be.an('object')
    })

    describe('returns controls', () => {
      let controls = null
      beforeEach(() => { controls = localsync('namesync', () => { foo: 'bar' }, value => {}) })
      afterEach(() => { controls = null })

      it('should export startSync property', () => should.exist(controls.startSync))
      it('should export startSync function', () => controls.startSync.should.be.a('function'))
      it('should export stopSync property', () => should.exist(controls.stopSync))
      it('should export stopSync function', () => controls.stopSync.should.be.a('function'))
      it('should export triggerSync property', () => should.exist(controls.triggerSync))
      it('should export triggerSync function', () => controls.triggerSync.should.be.a('function'))
      it('should export isSyncRunning property', () => should.exist(controls.isSyncRunning))
      it('should export isSyncRunning boolean', () => controls.isSyncRunning.should.be.a('boolean'))
      it('should export isFallback property', () => should.exist(controls.isFallback))
      it('should export isFallback boolean', () => controls.isFallback.should.be.a('boolean'))
    })

    describe('does not use fallback', () => {
      let controls = null
      beforeEach(() => { controls = localsync('namesync', () => { foo: 'bar' }, value => {}) })
      afterEach(() => { controls = null })
      it('for no user agent', () => controls.isFallback.should.be.false)

    })

    describe('uses fallback', () => {
      const userAgentsIE =  [ 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko'
                            , 'Mozilla/5.0 (compatible, MSIE 11, Windows NT 6.3; Trident/7.0;  rv:11.0) like Gecko'
                            , 'Mozilla/5.0 (compatible; MSIE 10.6; Windows NT 6.1; Trident/5.0; InfoPath.2; SLCC1; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; .NET CLR 2.0.50727) 3gpp-gba UNTRUSTED/1.0'
                            , 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 7.0; InfoPath.3; .NET CLR 3.1.40767; Trident/6.0; en-IN)'
                            , 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0)'
                            ]
      const navigatorsIE =  [ { appName: 'Microsoft Internet Explorer'}
                            , { appName: 'Netscape', appVersion: 'Trident/7.0'}
                            ]
      for(let nav of navigatorsIE) {
        describe('works for navigator', () => {
          let undo = null
          let controls = null
          before(() => {
            undo = lib.__set__('navigator', nav)
            controls = localsync('namesync', () => { foo: 'bar' }, value => {})
          })
          after(() => {
            controls = null
            undo()
          })
          it(`${JSON.stringify(nav)}`, () => controls.isFallback.should.be.true)
        })
      }
    })
  })
})
