'use strict'

window.addEventListener('message', receiveMessage, false)

function receiveMessage (event) {
  if (typeof event.data !== 'object') return

  switch (event.data.type) {
    case 'query':
      const app = window.localStorage.getItem('paymentApp:' + event.data.id)
      return (app && event.origin === app.origin)
    case 'register':
      const appManifest = event.data.manifest
      // {
      //  id: "http://paypal.com/app/",
      //  origin: "http://paypal.com",
      //  label: "Paypal",
      //  icon: "https://paypal.com/app/icon.png",
      //  endpoint: "https://paypal.com/app/"
      // }

      // TODO Does the manifest even need an origin? Why not just use the origin of the current document?
      if (event.origin !== appManifest.origin) {
        event.source.postMessage({
          type: 'callback',
          callbackId: event.data.callbackId,
          error: {
            name: 'SecurityError',
            message: 'Can only register payment apps with the same origin as the current document.'
          }
        }, '*')
      }
      // TODO Validate payment method
      // TODO Check if the app is already installed (is this an upgrade)
      // TODO A modal dialog would be better (or the permissions API)
      const result = window.confirm('Do you want to install the payment app ' + appManifest.label + '?')
      if (result) {
        installPaymentApp(appManifest)
        event.source.postMessage({
          type: 'callback',
          callbackId: event.data.callbackId,
          result: true
        }, '*')
      }
      break
    case 'pay':
      const req = event.data.request
      if (typeof event.data.options !== 'object') {
        event.data.options = {}
      }
      const opts = event.data.options
      const methods = []
      // TODO 1. Get all supported payment methods
      // TODO 2. Get all installed payment apps that support at least one of those methods
      // TODO 3. Display modal dialogue allowing user to select an app
      // TODO 4. Forward request to that app
      for (const subreq of req) {
        const supportedMethods = subreq.methods
        const paymentData = Object.assign({}, event.data.details, event.data.schemeData[instrument])
        const encodedPaymentData = encodeQueryData(paymentData)
        const baseUri = window.localStorage.getItem('paymentApp:' + instrument)
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

function installPaymentApp(appManifest) {
  var apps = window.localStorage.getItem('paymentApps')
  if (!apps) {
    apps = []
  }
  apps.push(appManifest.id)
  window.localStorage.setItem('paymentApp:' + appManifest.id, appManifest)
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
