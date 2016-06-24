import rewire from 'rewire'
const should = require('chai').should()

describe('lib', () => {
  const lib = rewire('../lib')
  const mechanisms = [ 'storagesync', 'cookiesync', 'serversync', 'socketsync', 'webrtcsync' ]

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

    describe('adheres to localsync interface', () => {
      let controls = null
      beforeEach(() => { controls = localsync('namesync', () => { foo: 'bar' }, value => {}) })
      afterEach(() => { controls = null })

      it('should have start property', () => should.exist(controls.start))
      it('should have start function', () => controls.start.should.be.a('function'))
      it('should have stop property', () => should.exist(controls.stop))
      it('should have stop function', () => controls.stop.should.be.a('function'))
      it('should have trigger property', () => should.exist(controls.trigger))
      it('should have trigger function', () => controls.trigger.should.be.a('function'))
      it('should have mechanism property', () => should.exist(controls.mechanism))
      it('should have mechanism string', () => controls.mechanism.should.be.a('string'))
      it('should have valid mechanism', () => mechanisms.should.include(controls.mechanism))
      it('should have isRunning property', () => should.exist(controls.isRunning))
      it('should have isRunning boolean', () => controls.isRunning.should.be.a('boolean'))
      it('should have isFallback property', () => should.exist(controls.isFallback))
      it('should have isFallback boolean', () => controls.isFallback.should.be.a('boolean'))
      it('should have isServer property', () => should.exist(controls.isServer))
      it('should have isServer boolean', () => controls.isServer.should.be.a('boolean'))
    })

    describe('server environment', function() {
      let controls = null
      beforeEach(() => { controls = localsync('namesync', () => { foo: 'bar' }, value => {}) })
      afterEach(() => { controls = null })
      it('mechanism should be serversync', () => {
        should.exist(controls.mechanism)
        controls.mechanism.should.equal('serversync')
      })
      it('isServer should be true', () => controls.isServer.should.be.true)
      it('isFallback should be false', () => controls.isFallback.should.be.false)
    })

    describe('modern browser environment', function() {
      const navigatorsIE =  [ { appName: 'Netscape', appVersion: '5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36' }
                            ]
      for(let nav of navigatorsIE) {
        describe(`navigator ${JSON.stringify(nav)}`, () => {
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
          it('mechanism should be storagesync', () => {
            should.exist(controls.mechanism)
            controls.mechanism.should.equal('storagesync')
          })
          it('isServer should be false', () => controls.isServer.should.be.false)
          it('isFallback should be false', () => controls.isFallback.should.be.false)
        })
      }
    })

    describe('legacy browser environment', function() {
      const navigatorsIE =  [ { appName: 'Microsoft Internet Explorer' }
                            , { appName: 'Netscape', appVersion: 'Trident/7.0' }
                            , { appName: 'Netscape', appVersion: '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10240' }
                            ]
      for(let nav of navigatorsIE) {
        describe(`navigator ${JSON.stringify(nav)}`, () => {
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
          it('mechanism should be cookiesync', () => {
            should.exist(controls.mechanism)
            controls.mechanism.should.equal('cookiesync')
          })
          it('isServer should be false', () => controls.isServer.should.be.false)
          it('isFallback should be true', () => controls.isFallback.should.be.true)
        })
      }
    })
  })
})
