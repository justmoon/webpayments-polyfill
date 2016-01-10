define(function (require) {
  var registerSuite = require('intern!object')
  var assert = require('intern/chai!assert')
  require('src/polyfill/index.js')

  registerSuite({
    name: 'polyfill',
    beforeEach: function () {
    },
    registerPaymentHandler: {
      'is a function': function () {
        assert.isFunction(window.navigator.registerPaymentHandler)
      }
    },
    PaymentRequest: {
      'is a function': function () {
        assert.isFunction(window.PaymentRequest)
      }
    }
  })
})
