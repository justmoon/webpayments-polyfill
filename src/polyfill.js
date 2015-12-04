'use strict'

;(function () {
  const ownUri = document.currentScript.src

  // TODO Avoid creating a message listener on the host page
  window.addEventListener('message', receiveMessage, false)

  function registerPaymentHandler (scheme, uri) {
    const iframe = document.createElement('iframe')
    iframe.src = getIframeUri()
    document.body.appendChild(iframe)
    iframe.onload = function () {
      sendMessage(iframe, {
        type: 'register',
        scheme,
        uri
      }).then(function (result) {
        console.log('registration complete')
      }).catch(function (error) {
        console.error('registration error: ' + error)
      })
    }
  }

  function requestPayment (supportedInstruments, details, schemeData) {
    // TODO Implement
    const iframe = document.createElement('iframe')
    iframe.src = getIframeUri()
    document.body.appendChild(iframe)
    iframe.onload = function () {
      sendMessage(iframe, {
        type: 'pay',
        supportedInstruments,
        details,
        schemeData
      }).then(function (result) {
        console.log('registration complete')
      }).catch(function (error) {
        console.error('registration error: ' + error)
      })
    }
  }

  const callbacks = []
  let unique = 0
  function receiveMessage (event) {
    switch (event.data.type) {
      case 'callback':
        const callback = callbacks[event.data.callbackId]
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

          const error = new Error(event.data.error.message)
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

  function getIframeUri () {
    return ownUri.substring(0, ownUri.lastIndexOf('/')) + '/registry.html'
  }

  window.navigator.registerPaymentHandler = registerPaymentHandler
  window.navigator.requestPayment = requestPayment
})()
