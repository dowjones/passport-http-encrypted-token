# passport-http-encrypted-token

[![Code Climate](https://codeclimate.com/github/dowjones/passport-http-encrypted-token/badges/gpa.svg)](https://codeclimate.com/github/dowjones/passport-http-encrypted-token) [![Build Status](https://travis-ci.org/dowjones/passport-http-encrypted-token.svg?branch=master)](https://travis-ci.org/dowjones/passport-http-encrypted-token) [![Coverage Status](https://coveralls.io/repos/github/dowjones/passport-http-encrypted-token/badge.svg)](https://coveralls.io/github/dowjones/passport-http-encrypted-token)

HTTP Encrypted Token authentication strategy for [Passport](http://passportjs.org/).

This module lets you authenticate HTTP requests using encrypted tokens 
in your Node.js applications. **Encrypted_token** is a custom authentication 
scheme used by Professional Information Business (PIB) group in Dow Jones.
Encrypted tokens are typically used protect API endpoints, and are
issued using Dow Jones Session server.

By plugging into Passport, encrypted token support can be easily and unobtrusively
integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/) and [Koa](https://github.com/rkusa/koa-passport).

This work is based on [passport-http-bearer](https://github.com/jaredhanson/passport-http-bearer).

## Install

```console
$ npm install passport-http-encrypted-token
```

## Usage

#### Configure Strategy

The HTTP Encrypted token authentication strategy authenticates users using a encrypted_token.  
The strategy requires a `verify` callback, which accepts that
credential and calls `done` providing a user.

```js
const EncryptedTokenStrategy = require('passport-http-encrypted-token').Strategy

passport.use(new EncryptedTokenStrategy(
  function(token, done) {
    User.findOne({ token: token }, function (err, user) {
      if (err) { return done(err) }
      if (!user) { return done(null, false) }
      return done(null, user)
    })
  }
))
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'Encrypted_token'` strategy, to
authenticate requests.  Requests containing encrypted tokens do not require session
support, so the `session` option can be set to `false`.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```js
app.get('/profile', 
  passport.authenticate('Encrypted_token', { session: false }),
  function(req, res) {
    res.json(req.user)
  }
)
````


## Tests

```console
$ npm install
$ npm test
```

## Example

Use `curl` to send an authenticated request.

```bash
$ curl -H "Authorization: Encrypted_token 123456789" http://127.0.0.1:3000/
```

## Credits

- [Jared Hanson](http://github.com/jaredhanson) (passport bearer auth implementation)

## License

[ISC](/LICENSE)

Released 2016 by [Hrusikesh Panda](https://github.com/mrchief) @ [Dow Jones](https://github.com/dowjones) 