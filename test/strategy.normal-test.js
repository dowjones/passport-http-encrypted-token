import { default as chai, expect } from 'chai'
import chaiPassport from 'chai-passport-strategy'
import Strategy from '../src/encryptedTokenStrategy'

chai.use(chaiPassport)

describe('EncryptedTokenStrategy', () => {
  const strategy = new Strategy((token, done) => {
    if (token === 'vF9dft4qmT') {
      return done(null, { id: '1234' })
    }
    return done(null, false)
  })

  describe('handling a request with valid token in header', () => {
    let user, info

    before(done => {
      chai.passport.use(strategy)
        .success((u, i) => {
          user = u
          info = i
          done()
        })
        .req(req => {
          req.headers.authorization = 'Encrypted_token vF9dft4qmT'
        })
        .authenticate()
    })

    it('should supply user', () => {
      expect(user).to.be.an.object
      expect(user.id).to.equal('1234')
    })

    it('should supply info', () => {
      expect(info).to.be.an.object
    })
  })

  describe('handling a request without credentials', () => {
    let challenge

    before(done => {
      chai.passport.use(strategy)
        .fail(c => {
          challenge = c
          done()
        })
        .req(req => {
        })
        .authenticate()
    })

    it('should fail with challenge', () => {
      expect(challenge).to.be.a.string
      expect(challenge).to.equal('Encrypted_token')
    })
  })

  describe('handling a request with capitalized scheme', () => {
    let user
    let info

    before(done => {
      chai.passport.use(strategy)
        .success((u, i) => {
          user = u
          info = i
          done()
        })
        .req(req => {
          req.headers.authorization = 'ENCRYPTED_TOKEN vF9dft4qmT'
        })
        .authenticate()
    })

    it('should supply user', () => {
      expect(user).to.be.an.object
      expect(user.id).to.equal('1234')
    })

    it('should supply info', () => {
      expect(info).to.be.an.object
    })
  })

  describe('handling a request with scheme at beginning of input', () => {
    let challenge

    before(done => {
      chai.passport.use(strategy)
        .fail(c => {
          challenge = c
          done()
        })
        .req(req => {
          req.headers.authorization = 'Encrypted_tokenX vF9dft4qmT'
        })
        .authenticate()
    })

    it('should fail with challenge', () => {
      expect(challenge).to.be.a.string
      expect(challenge).to.equal('Encrypted_token')
    })
  })

  describe('handling a request with scheme at end of input', () => {
    let challenge

    before(done => {
      chai.passport.use(strategy)
        .fail(c => {
          challenge = c
          done()
        })
        .req(req => {
          req.headers.authorization = 'XEncrypted_token vF9dft4qmT'
        })
        .authenticate()
    })

    it('should fail with challenge', () => {
      expect(challenge).to.be.a.string
      expect(challenge).to.equal('Encrypted_token')
    })
  })
})
