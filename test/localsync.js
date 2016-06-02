import rewire from 'rewire'
const should = require('chai').should()

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

      it('should export start property', () => should.exist(controls.start))
      it('should export start function', () => controls.start.should.be.a('function'))
      it('should export stop property', () => should.exist(controls.stop))
      it('should export stop function', () => controls.stop.should.be.a('function'))
      it('should export trigger property', () => should.exist(controls.trigger))
      it('should export trigger function', () => controls.trigger.should.be.a('function'))
      it('should export isRunning property', () => should.exist(controls.isRunning))
      it('should export isRunning boolean', () => controls.isRunning.should.be.a('boolean'))
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
      const navigatorsIE =  [ { appName: 'Microsoft Internet Explorer' }
                            , { appName: 'Netscape', appVersion: 'Trident/7.0' }
                            , { appName: 'Netscape', appVersion: '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10240' }
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
