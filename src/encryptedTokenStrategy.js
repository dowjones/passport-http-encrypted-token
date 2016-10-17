/**
 * Based on https://github.com/jaredhanson/passport-http-bearer to support Encrypted_token auth
 */

import PassportStrategy from 'passport-strategy'

/**
 * Creates an instance of `EncryptedTokenStrategy`.
 *
 * The HTTP Encrypted_token authentication strategy authenticates requests based on
 * a  token contained in the `Authorization` header field.
 *
 * Applications must supply a `verify` callback, for which the function
 * signature is:
 *
 *     function(token, done) { ... }
 *
 * `token` is the encrypted token provided as a credential. The verify callback
 * is responsible for finding the user who possesses the token, and invoking
 * `done` with the following arguments:
 *
 *     done(err, user, info)
 *
 * If the token is not valid, `user` should be set to `false` to indicate an
 * authentication failure.  Additional token `info` can optionally be passed as
 * a third argument, which will be set by Passport at `req.authInfo`, where it
 * can be used by later middleware for access control.  This is typically used
 * to pass any scope associated with the token.
 *
 *
 * Examples:
 *
 *     passport.use(new EncryptedTokenStrategy(
 *       function(token, done) {
 *         // do something with token, e.g. get user
 *         return done(null, user)
 *     ))
 *
 */
class Strategy extends PassportStrategy {
  /**
   * @constructor
   * @param {Function} verify
   * @api public
   */
  constructor (verify) {
    super()

    if (!verify) { throw new TypeError('EncryptedTokenStrategy requires a verify callback') }

    this.name = 'EncryptedToken'
    this._verify = verify
  }

  /**
   * Authenticate request based on the contents of a HTTP authorization
   * header, body parameter, or query parameter.
   *
   * @param {Object} req
   * @api protected
   */
  authenticate (req) {
    let token

    if (req.headers && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ')
      if (parts.length === 2) {
        const scheme = parts[0]
        const credentials = parts[1]

        if (/^Encrypted_token$/i.test(scheme)) {
          token = credentials
        }
      } else {
        return this.fail(400)
      }
    }

    if (!token) { return this.fail(this._challenge()) }

    const self = this

    function verified (err, user, info = {}) {
      if (err) { return self.error(err) }
      if (!user) {
        if (typeof info === 'string') {
          info = { message: info }
        }
        return self.fail(self._challenge('invalid_token', info.message))
      }
      self.success(user, info)
    }

    this._verify(token, verified)
  }

  /**
   * Build authentication challenge.
   *
   * @api private
   */
  _challenge (code, desc) {
    let challenge = `Encrypted_token`
    if (code) {
      challenge += `, error="${code}"`
    }
    if (desc && desc.length) {
      challenge += `, error_description="${desc}"`
    }

    return challenge
  }
}

export default Strategy
