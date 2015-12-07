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
      // TODO Validate scheme
      // TODO A modal dialog would be better
      const result = window.confirm('Allow ' + event.origin + ' to handle all ' + event.data.scheme + ' payments?')
      if (result) {
        window.localStorage.setItem('handler:' + event.data.scheme, event.data.uri)
        event.source.postMessage({
          type: 'callback',
          callbackId: event.data.callbackId,
          result: true
        }, '*')
      }
      break
    case 'pay':
      if (typeof event.data.schemeData !== 'object') {
        event.data.schemeData = {}
      }
      // TODO Validate schemes
      for (const instrument of event.data.supportedInstruments) {
        const paymentData = Object.assign({}, event.data.details, event.data.schemeData[instrument])
        const encodedPaymentData = encodeQueryData(paymentData)
        const baseUri = window.localStorage.getItem('handler:' + instrument)
        const uri = baseUri + '?' + encodedPaymentData
        console.log('uri', uri, instrument)
        if (uri) {
          window.location.href = uri
          return
        }
      }
      break
  }
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
