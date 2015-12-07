/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	eval("'use strict';(function () {\n  var ownUri = document.currentScript.src;\n\n  // TODO Avoid creating a message listener on the host page\n  window.addEventListener('message', receiveMessage, false);\n\n  function registerPaymentHandler(scheme, uri) {\n    openIframe().then(function (iframe) {\n      sendMessage(iframe, {\n        type: 'register',\n        scheme: scheme,\n        uri: uri\n      }).then(function (result) {\n        console.log('registration complete');\n        document.body.removeChild(iframe);\n      })['catch'](function (error) {\n        console.error('registration error: ' + error);\n      });\n    });\n  }\n\n  function requestPayment(supportedInstruments, details, schemeData) {\n    // TODO Implement\n    openIframe().then(function (iframe) {\n      sendMessage(iframe, {\n        type: 'register',\n        supportedInstruments: supportedInstruments,\n        details: details,\n        schemeData: schemeData\n      })['catch'](function (error) {\n        console.error('payment error: ' + error);\n      });\n    });\n  }\n\n  var callbacks = [];\n  var unique = 0;\n  function receiveMessage(event) {\n    switch (event.data.type) {\n      case 'callback':\n        var callback = callbacks[event.data.callbackId];\n        if (callback) {\n          callback(event);\n        }\n    }\n  }\n\n  function sendMessage(iframe, message) {\n    return new Promise(function (resolve, reject) {\n      callbacks[++unique] = function (event) {\n        if (event.data.error) {\n          if (typeof event.data.error !== 'object') return;\n\n          var error = new Error(event.data.error.message);\n          error.name = event.data.error.name;\n          reject(error);\n        } else {\n          resolve(event.data.result);\n        }\n      };\n\n      message.callbackId = unique;\n      iframe.contentWindow.postMessage(message, '*');\n    });\n  }\n\n  function openIframe() {\n    return new Promise(function (resolve, reject) {\n      var iframe = document.createElement('iframe');\n      iframe.src = getIframeUri();\n      iframe.frameborder = 0;\n      iframe.allowtransparency = true;\n      iframe.name = 'payments_polyfill';\n      Object.assign(iframe.style, {\n        position: 'fixed',\n        top: 0,\n        left: 0,\n        width: '100%',\n        height: '100%',\n        zIndex: 9999,\n        border: 0\n      });\n      document.body.appendChild(iframe);\n      iframe.onload = function () {\n        resolve(iframe);\n      };\n    });\n  }\n\n  function getIframeUri() {\n    return ownUri.substring(0, ownUri.lastIndexOf('/')) + '/registry.html';\n  }\n\n  if (!window.requestPayment) {\n    window.navigator.registerPaymentHandler = registerPaymentHandler;\n    window.navigator.requestPayment = requestPayment;\n  }\n})();\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/entrypoints/polyfill.js\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/entrypoints/polyfill.js?");

/***/ }
/******/ ]);