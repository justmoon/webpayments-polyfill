'use strict'

;(function () {
  var ownUri = document.currentScript.src

  function PaymentRequest (supportedMethods, details, options, data) {
    this.supportedMethods = supportedMethods.slice()
    this.details = cloneObject(details)
    this.options = cloneObject(options) || {}
    this.data = cloneObject(data) || {}

    this.state = 'created'
    this.shippingAddress = null
    this.shippingOption = null
    this.updating = false
  }

  PaymentRequest.prototype.show = function () {
    var self = this
    if (this.state !== 'created') {
      // TODO: Should be an InvalidStateError
      throw new Error('show() must only be called on a newly created PaymentRequest.')
    }
    this.state = 'interactive'
    return new Channel().open().then(function (channel) {
      return channel.sendMessage({
        type: 'pay',
        supportedMethods: self.supportedMethods,
        details: self.details,
        methodData: self.data
      }).then(function () {
        channel.close()
        self.state = 'accepted'
      })
    })
  }

  function registerPaymentHandler (method, uri) {
    const channel = new Channel()
    return channel.open().then(function () {
      return channel.sendMessage({
        type: 'register',
        method,
        uri
      })
    }).then(function () {
      console.log('registration complete')
      channel.close()
    }).catch(function (error) {
      console.error('registration error: ' + error)
    })
  }

  function unregisterPaymentHandler (method, uri) {
    const channel = new Channel()
    return channel.open().then(function () {
      return channel.sendMessage({
        type: 'unregister',
        method
      })
    }).then(function () {
      console.log('removal complete')
      channel.close()
    }).catch(function (error) {
      console.error('removal error: ' + error)
    })
  }

  function getPaymentHandler (method, uri) {
    const channel = new Channel()
    return channel.open().then(function () {
      return channel.sendMessage({
        type: 'check',
        method,
        uri
      })
    }).then(function (result) {
      channel.close()
      return result
    })
  }

  function Channel () {
    this.uri = getIframeUri()
    this.callbacks = []
    this.unique = 0
  }

  Channel.OUTER_IFRAME_NAME = 'webpay_polyfill'

  Channel.INNER_IFRAME_NAME = 'webpay_polyfill_inner'

  Channel.IFRAME_STYLE = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 9999,
    border: 0
  }

  Channel.PROXY_SRC =
    'frames.' + Channel.INNER_IFRAME_NAME + '.postMessage(message, "*")'

  Channel.prototype.open = function () {
    var self = this

    // The outer iframe is used for receiving incoming messages. We want to
    // avoid polluting the top level document's postMessage channel.
    var outerIframe = this.outerIframe = document.createElement('iframe')
    outerIframe.frameborder = 0
    outerIframe.allowtransparency = true
    outerIframe.name = Channel.OUTER_IFRAME_NAME
    Object.assign(outerIframe.style, Channel.IFRAME_STYLE)
    document.body.appendChild(outerIframe)
    outerIframe.contentWindow.addEventListener('message', this.receiveMessage.bind(this), false)

    // We want event.source for our messages to point to the outer iframe's
    // window object. So we need to proxy our messages with this little trick.
    var IframedFunction = outerIframe.contentWindow.Function
    this.postMessageProxied = new IframedFunction('message', Channel.PROXY_SRC)

    return new Promise(function (resolve, reject) {
      var innerIframe = self.innerIframe = document.createElement('iframe')
      innerIframe.src = getIframeUri()
      innerIframe.frameborder = 0
      innerIframe.allowtransparency = true
      innerIframe.name = Channel.INNER_IFRAME_NAME
      Object.assign(innerIframe.style, Channel.IFRAME_STYLE)
      outerIframe.contentWindow.document.body.appendChild(innerIframe)
      innerIframe.onload = function () {
        resolve(self)
      }
    })
  }

  Channel.prototype.close = function () {
    document.body.removeChild(this.outerIframe)
  }

  Channel.prototype.receiveMessage = function receiveMessage (event) {
    switch (event.data.type) {
      case 'callback':
        var callback = this.callbacks[event.data.callbackId]
        if (callback) {
          callback(event)
        }
        break
      default:
        throw new Error('Webpayment Polyfill: Unexpected postMessage received')
    }
  }

  Channel.prototype.sendMessage = function sendMessage (message) {
    var self = this
    return new Promise(function (resolve, reject) {
      self.callbacks[++self.unique] = function (event) {
        if (event.data.error) {
          if (typeof event.data.error !== 'object') return

          var error = new Error(event.data.error.message)
          error.name = event.data.error.name
          reject(error)
        } else {
          resolve(event.data.result)
        }
      }

      message.callbackId = self.unique
      self.postMessageProxied(message)
    })
  }

  function getIframeUri () {
    return ownUri.substring(0, ownUri.lastIndexOf('/')) + '/registry.html'
  }

  // Utilities
  function cloneObject (obj) {
    return JSON.parse(JSON.stringify(obj || null))
  }

  if (!window.PaymentRequest) {
    window.PaymentRequest = PaymentRequest
    window.navigator.registerPaymentHandler = registerPaymentHandler
    window.navigator.unregisterPaymentHandler = unregisterPaymentHandler
    window.navigator.getPaymentHandler = getPaymentHandler
  }

  if (typeof exports === 'object') {
    exports.PaymentRequest = PaymentRequest
    exports.registerPaymentHandler = registerPaymentHandler
    exports.unregisterPaymentHandler = unregisterPaymentHandler
    exports.getPaymentHandler = getPaymentHandler
  }
})()
