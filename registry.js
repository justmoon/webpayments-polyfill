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

	eval("'use strict';\n\nwindow.addEventListener('message', receiveMessage, false);\n\nfunction receiveMessage(event) {\n  if (typeof event.data !== 'object') return;\n\n  switch (event.data.type) {\n    case 'register':\n      var location = parseUri(event.data.uri);\n      var uriOrigin = location.protocol + '//' + location.host;\n      if (event.origin !== uriOrigin) {\n        event.source.postMessage({\n          type: 'callback',\n          callbackId: event.data.callbackId,\n          error: {\n            name: 'SecurityError',\n            message: 'Can only register custom handler in the document\\'s origin.'\n          }\n        }, '*');\n      }\n      // TODO Validate scheme\n      // TODO A modal dialog would be better\n      var result = window.confirm('Allow ' + event.origin + ' to handle all ' + event.data.scheme + ' payments?');\n      if (result) {\n        window.localStorage.setItem('handler:' + event.data.scheme, event.data.uri);\n        event.source.postMessage({\n          type: 'callback',\n          callbackId: event.data.callbackId,\n          result: true\n        }, '*');\n      }\n      break;\n    case 'pay':\n      if (typeof event.data.schemeData !== 'object') {\n        event.data.schemeData = {};\n      }\n      // TODO Validate schemes\n      var _iteratorNormalCompletion = true;\n      var _didIteratorError = false;\n      var _iteratorError = undefined;\n\n      try {\n        for (var _iterator = event.data.supportedInstruments[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {\n          var instrument = _step.value;\n\n          var paymentData = Object.assign({}, event.data.details, event.data.schemeData[instrument]);\n          var encodedPaymentData = encodeQueryData(paymentData);\n          var baseUri = window.localStorage.getItem('handler:' + instrument);\n          var uri = baseUri + '?' + encodedPaymentData;\n          console.log('uri', uri, instrument);\n          if (uri) {\n            window.location.href = uri;\n            return;\n          }\n        }\n      } catch (err) {\n        _didIteratorError = true;\n        _iteratorError = err;\n      } finally {\n        try {\n          if (!_iteratorNormalCompletion && _iterator['return']) {\n            _iterator['return']();\n          }\n        } finally {\n          if (_didIteratorError) {\n            throw _iteratorError;\n          }\n        }\n      }\n\n      break;\n  }\n}\n\nfunction parseUri(uri) {\n  var parser = document.createElement('a');\n  parser.href = uri;\n  return parser;\n}\n\nfunction encodeQueryData(data) {\n  return Object.keys(data).map(function (key) {\n    return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);\n  }).join('&');\n}\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/entrypoints/registry.js\n ** module id = 0\n ** module chunks = 2\n **/\n//# sourceURL=webpack:///./src/entrypoints/registry.js?");

/***/ }
/******/ ]);