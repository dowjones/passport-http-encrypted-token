import {default as chai, expect} from 'chai'
import chaiPassport from 'chai-passport-strategy'
import Strategy from '../src/encryptedTokenStrategy'

chai.use(chaiPassport)

describe('EncryptedTokenStrategy', () => {
  const strategy = new Strategy((token, done) => {
    if (token === 'vF9dft4qmT') {
      return done(null, {id: '1234'})
    }
    return done(null, false, 'The access token expired')
  })

  describe('handling a request with wrong token', () => {
    let challenge

    before(done => {
      chai.passport.use(strategy)
        .fail(c => {
          challenge = c
          done()
        })
        .req(req => {
          req.headers.authorization = 'Encrypted_token WRONG'
        })
        .authenticate()
    })

    it('should fail with challenge', () => {
      expect(challenge).to.be.a.string
      expect(challenge).to.equal('Encrypted_token, error="invalid_token", error_description="The access token expired"')
    })
  })

  describe('handling a request with malformed authorization header', () => {
    let status

    before(done => {
      chai.passport.use(strategy)
        .fail(s => {
          status = s
          done()
        })
        .req(req => {
          req.headers.authorization = 'Encrypted_token'
        })
        .authenticate()
    })

    it('should fail with status', () => {
      expect(status).to.be.a.number
      expect(status).to.equal(400)
    })
  })

  describe('handling a request with non-Encrypted_token credentials', () => {
    let challenge

    before(done => {
      chai.passport.use(strategy)
        .fail(c => {
          challenge = c
          done()
        })
        .req(req => {
          req.headers.authorization = 'XXXXX vF9dft4qmT'
        })
        .authenticate()
    })

    it('should fail with challenge', () => {
      expect(challenge).to.be.a.string
      expect(challenge).to.equal('Encrypted_token')
    })
  })

  describe('failing a request with hash containing message', () => {
    const strategy = new Strategy((token, done) => {
      if (token === 'vF9dft4qmT') {
        return done(null, {id: '1234'}, {scope: 'read'})
      }
      return done(null, false, {message: 'The access token expired'})
    })

    describe('handling a request with wrong token', () => {
      let challenge

      before(done => {
        chai.passport.use(strategy)
          .fail(c => {
            challenge = c
            done()
          })
          .req(req => {
            req.headers.authorization = 'Encrypted_token WRONG'
          })
          .authenticate()
      })

      it('should fail with challenge', () => {
        expect(challenge).to.be.a.string
        expect(challenge).to.equal('Encrypted_token, error="invalid_token", error_description="The access token expired"')
      })
    })
  })
})
