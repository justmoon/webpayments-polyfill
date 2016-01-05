define(function (require) {
  var registerSuite = require('intern!object')
  var assert = require('intern/chai!assert')
  require('src/entrypoints/polyfill')

  registerSuite({
    name: 'polyfill',
    beforeEach: function () {
    },
    registerPaymentHandler: {
      'is a function': function () {
        assert.isFunction(window.navigator.registerPaymentHandler)
      }
    },
    requestPayment: {
      'is a function': function () {
        assert.isFunction(window.navigator.requestPayment)
      }
    }
  })
})
