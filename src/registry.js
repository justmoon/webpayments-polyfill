'use strict'

window.addEventListener('message', receiveMessage, false)

function receiveMessage (event) {
  if (typeof event.data !== 'object') return

  try {
    const result = processMessage(event)
    event.source.postMessage({
      type: 'callback',
      callbackId: event.data.callbackId,
      result
    }, '*')
  } catch (err) {
    // TODO If an "expected" error occurs, report it back to the caller, otherwise
    //      report a generic error.
  }
}

function processMessage (event) {
  switch (event.data.type) {
    case 'register':
      return register(event)
    case 'unregister':
      return unregister(event)
    case 'check':
      return check(event)
    case 'pay':
      return pay(event)
  }
}

function register (event) {
  validateOrigin(event)

  // TODO Validate method
  // TODO A modal dialog would be better
  const result = window.confirm('Allow ' + event.origin + ' to handle all ' + event.data.method + ' payments?')
  if (result) {
    window.localStorage.setItem('handler:' + event.data.method, event.data.uri)
    return true
  }
}

function unregister (event) {
  const uri = window.localStorage.getItem('handler:' + event.data.method)
  if (matchesOrigin(uri, event.origin)) {
    window.localStorage.removeItem('handler:' + event.data.method)
  }
  return true
}

function check (event) {
  const uri = window.localStorage.getItem('handler:' + event.data.method)
  if (matchesOrigin(uri, event.origin)) {

  }
  return uri
}

function pay (event) {
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
}

function matchesOrigin (uri, origin) {
  const location = parseUri(uri)
  const uriOrigin = location.protocol + '//' + location.host
  return origin === uriOrigin
}

function validateOrigin (event) {
  if (!matchesOrigin(event.data.uri, event.origin)) {
    event.source.postMessage({
      type: 'callback',
      callbackId: event.data.callbackId,
      error: {
        name: 'SecurityError',
        message: 'Can only check custom handler in the document\'s origin.'
      }
    }, '*')
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
