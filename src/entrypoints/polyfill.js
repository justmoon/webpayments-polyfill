'use strict'

;(function () {
  var ownUri = document.currentScript.src

  // TODO Avoid creating a message listener on the host page
  window.addEventListener('message', receiveMessage, false)

  function registerPaymentHandler (scheme, uri) {
    openIframe().then(function (iframe) {
      sendMessage(iframe, {
        type: 'register',
        scheme,
        uri
      }).then(function (result) {
        console.log('registration complete')
        document.body.removeChild(iframe)
      }).catch(function (error) {
        console.error('registration error: ' + error)
      })
    })
  }

  function requestPayment (supportedInstruments, details, schemeData) {
    openIframe().then(function (iframe) {
      sendMessage(iframe, {
        type: 'pay',
        supportedInstruments,
        details,
        schemeData
      }).catch(function (error) {
        console.error('payment error: ' + error)
      })
    })
  }

  var callbacks = []
  var unique = 0
  function receiveMessage (event) {
    switch (event.data.type) {
      case 'callback':
        var callback = callbacks[event.data.callbackId]
        if (callback) {
          callback(event)
        }
    }
  }

  function sendMessage (iframe, message) {
    return new Promise(function (resolve, reject) {
      callbacks[++unique] = function (event) {
        if (event.data.error) {
          if (typeof event.data.error !== 'object') return

          var error = new Error(event.data.error.message)
          error.name = event.data.error.name
          reject(error)
        } else {
          resolve(event.data.result)
        }
      }

      message.callbackId = unique
      iframe.contentWindow.postMessage(message, '*')
    })
  }

  function openIframe () {
    return new Promise(function (resolve, reject) {
      var iframe = document.createElement('iframe')
      iframe.src = getIframeUri()
      iframe.frameborder = 0
      iframe.allowtransparency = true
      iframe.name = 'payments_polyfill'
      Object.assign(iframe.style, {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 9999,
        border: 0
      })
      document.body.appendChild(iframe)
      iframe.onload = function () {
        resolve(iframe)
      }
    })
  }

  function getIframeUri () {
    return ownUri.substring(0, ownUri.lastIndexOf('/')) + '/registry.html'
  }

  if (!window.requestPayment) {
    window.navigator.registerPaymentHandler = registerPaymentHandler
    window.navigator.requestPayment = requestPayment
  }
})()
