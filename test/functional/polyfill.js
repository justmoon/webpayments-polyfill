define(function (require) {
  var registerSuite = require('intern!object')
  var assert = require('intern/chai!assert')

  registerSuite({
    name: 'polyfill',

    'register handler': function () {
      return this.remote
        .get(require.toUrl('src/demo/register.html'))
        .findById('register')
          .click()
          .end()
        .acceptAlert()
        .get(require.toUrl('src/demo/pay.html'))
        .findById('pay')
          .click()
          .end()
        .switchToFrame('webpay_polyfill')
        .switchToFrame('webpay_polyfill_inner')
        .findByCssSelector('button')
          .click()
          .end()
    }
  })
})
