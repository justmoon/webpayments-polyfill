const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const config = require('./webpack.config.development')

new WebpackDevServer(webpack(config), {
  hot: true,
  publicPath: config.output.publicPath
}).listen(3000, 'localhost', (err, result) => {
  if (err) {
    console.error(err)
    return
  }

  console.log('Listening at localhost:3000')
})
