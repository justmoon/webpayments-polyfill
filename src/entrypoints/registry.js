'use strict'

window.addEventListener('message', receiveMessage, false)

function receiveMessage (event) {
  if (typeof event.data !== 'object') return

  switch (event.data.type) {
    case 'register':
      const location = parseUri(event.data.uri)
      const uriOrigin = location.protocol + '//' + location.host
      if (event.origin !== uriOrigin) {
        event.source.postMessage({
          type: 'callback',
          callbackId: event.data.callbackId,
          error: {
            name: 'SecurityError',
            message: 'Can only register custom handler in the document\'s origin.'
          }
        }, '*')
      }
      // TODO Validate method
      // TODO A modal dialog would be better
      const result = window.confirm('Allow ' + event.origin + ' to handle all ' + event.data.method + ' payments?')
      if (result) {
        window.localStorage.setItem('handler:' + event.data.method, event.data.uri)
        event.source.postMessage({
          type: 'callback',
          callbackId: event.data.callbackId,
          result: true
        }, '*')
      }
      break
    case 'pay':
      if (typeof event.data.methodData !== 'object') {
        event.data.methodData = {}
      }
      // TODO Validate methods
      for (const method of event.data.supportedMethods) {
        const paymentData = Object.assign({}, event.data.details, event.data.methodData[method])
        paymentData.return = window.location.href + '?callbackId=' + event.data.callbackId
        const encodedPaymentData = encodeQueryData(paymentData)
        const baseUri = window.localStorage.getItem('handler:' + method)
        const uri = baseUri + '?' + encodedPaymentData
        if (uri) {
          window.location.href = uri
          return
        }
      }
      break
  }
}

// Handle payment return URI
//
// After a payment, we ask the payment method to redirect back to a URI such as
// https://web-payments.net/registry.html?callbackId=?
//
// We then want to postMessage to our parent frame to indicate the payment flow
// has completed.
if (window.location.search.indexOf('?callbackId=') === 0) {
  window.parent.postMessage({
    type: 'callback',
    callbackId: Number(window.location.search.substr(12)),
    result: true
  }, '*')
}

function parseUri (uri) {
  const parser = document.createElement('a')
  parser.href = uri
  return parser
}

function encodeQueryData (data) {
  return Object.keys(data).map((key) => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
  }).join('&')
}
