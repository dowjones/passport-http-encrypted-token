import { default as chai, expect } from 'chai'
import chaiPassport from 'chai-passport-strategy'
import Strategy from '../src/encryptedTokenStrategy'

chai.use(chaiPassport)

describe('EncryptedTokenStrategy', () => {
  const strategy = new Strategy(() => {})

  it('should be named encrypted token', () => {
    expect(strategy.name).to.equal('EncryptedToken')
  })

  it('should throw if constructed without a verify callback', () => {
    expect(() => new Strategy()).to.throw(TypeError, 'EncryptedTokenStrategy requires a verify callback')
  })

  describe('that encounters an error during verification', () => {
    const strategy = new Strategy((token, done) => done(new Error('something went wrong')))

    describe('handling a request', () => {
      let err

      before(done => {
        chai.passport.use(strategy)
          .error(e => {
            err = e
            done()
          })
          .req(req => {
            req.headers.authorization = 'Encrypted_token vF9dft4qmT'
          })
          .authenticate()
      })

      it('should error', () => {
        expect(err).to.be.an.instanceof(Error)
        expect(err.message).to.equal('something went wrong')
      })
    })
  })
})
