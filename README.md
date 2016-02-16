# webpayments-polyfill

> Experimental web payments polyfill

**WARNING: The [Web Payments spec](http://wicg.github.io/paymentrequest/) is still under heavy development. This implementation (and its API) will change often and without notice.**

## Example

``` js
new PaymentRequest(['interledger'], {
  amount: '100',
  currencyCode: 'USD',
  countryCode: 'US'
}, {
  interledger: {
    account: 'https://localhost:3001/accounts/mellie'
  }
}).show().then(function () {
  // payment request accepted
})
```

## Installation

### Quickstart

The fastest way to include the polyfill is with a script tag:

``` html
<script src="https://web-payments.net/polyfill.js"></script>
```

### Webpack/Browserify

If you are using a tool like [webpack](https://webpack.github.io/) or [browserify](http://browserify.org/), you can also just install this library from NPM:

``` sh
npm install -S webpayments
```

### Async embed code

The basic script tag method will be blocking. A non-blocking alternative is the following embed code:

``` html
<script>
void function(w,e,b,p,a,y) {
  w[p] = w[p] || (function (cb) { this.push(cb); return this }).bind([]);
  a = e.createElement(b); a.async = 1; a.src = '//web-payments.net/polyfill.js';
  y = e.getElementsByTagName(b)[0]; y.parentNode.insertBefore(a,y);
}(window,document,'script','WebPaymentsOnLoad');
</script>
```

You can then register a callback to be called when the polyfill has been loaded:

``` html
<script>
WebPaymentsOnLoad(function () {
  new PaymentRequest(/* ... */)
})
</script>
```

### Usage

*TODO: Add API documentation*

For now, please see the spec: https://github.com/WICG/paymentrequest/blob/gh-pages/explainer.md
