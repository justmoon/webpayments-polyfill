'use strict'

;(function () {
  const ownUri = document.currentScript.src

  // TODO Avoid creating a message listener on the host page
  window.addEventListener('message', receiveMessage, false)

  function isPaymentAppInstalled (id) {
    // TODO Implement
    openIframe().then(function (iframe) {
      sendMessage(iframe, {
        type: 'query',
        id
      }).then(function (result) {
        return result
      }).catch(function (error) {
        // For security reasons we never throw an error we just return false
        return false
      })
    })
  }

  function registerPaymentApp (manifest) {
    openIframe().then(function (iframe) {
      sendMessage(iframe, {
        type: 'register',
        manifest
      }).then(function (result) {
        console.log('registration complete')
        document.body.removeChild(iframe)
      }).catch(function (error) {
        console.error('registration error: ' + error)
      })
    })
  }

  function requestPayment (request, options) {
    // TODO Implement
    openIframe().then(function (iframe) {
      sendMessage(iframe, {
        type: 'pay',
        request,
        options
      }).catch(function (error) {
        console.error('payment error: ' + error)
      })
    })
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

  function openIframe () {
    return new Promise(function (resolve, reject) {
      const iframe = document.createElement('iframe')
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
    return ownUri.substring(0, ownUri.lastIndexOf('/')) + '/mediator.html'
  }

  if (!window.navigator.payments) {
    window.navigator.payments =
    {
      isPaymentAppInstalled: isPaymentAppInstalled,
      registerPaymentApp: registerPaymentApp,
      requestPayment: requestPayment
    }
  }
})()
