var assert = require('chai').assert
require('src/polyfill/index.js')

describe('polyfill', function (require) {
  describe('registerPaymentHandler', function () {
    beforeEach(function () {
    })

    it('is a function', function () {
      assert.isFunction(window.navigator.registerPaymentHandler)
    })
  })

  describe('PaymentRequest', function () {
    it('is a function', function () {
      assert.isFunction(window.PaymentRequest)
    })
  })
})
