const path = require('path')
const IndexHtmlPlugin = require('indexhtml-webpack-plugin')
const postcssImport = require('postcss-import')

module.exports = {
  devtool: 'eval',
  entry: {
    'registry.html': './src/polyfill/registry.html',
    'polyfill.js': './src/polyfill',
    'registry.js': './src/polyfill/registry',
    'wallet.js': './src/entrypoints/wallet.jsx'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]',
    publicPath: '/'
  },
  plugins: [
    new IndexHtmlPlugin('registry.html', 'registry.html')
  ],
  module: {
    loaders: [{
      test: /\.jsx$/,
      loader: 'babel',
      include: path.join(__dirname, 'src')
    }, {
      test: /\.js$/,
      loader: 'babel',
      include: path.join(__dirname, 'src')
    }, {
      test: /\.html$/,
      loader: 'html'
    }, {
      test: /^((?!\.module).)*\.css$/,
      loaders: [
        'style',
        'css?importLoaders=1',
        'postcss'
      ]
    }, {
      test: /\.module\.css$/,
      loaders: [
        'style',
        'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!',
        'postcss'
      ]
    }]
  },
  postcss: function (webpack) {
    return [
      postcssImport({
        addDependencyTo: webpack
      })
    ]
  }
}
