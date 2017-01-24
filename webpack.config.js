const webpack = require('webpack')
const path = require('path')

let ignores = []
if (process.env.small) {
  ignores.push('\\.\\/components')
  console.log('Building without extra components (env: small)')
}
let ignore = new RegExp(`^(${ignores.reduce((a, b) => `${a}|${b}`, '')})$`)

module.exports = {
  entry: path.resolve('.', 'index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.IgnorePlugin(ignore),
    // webpack breaks gl-matrix for some reason
    new webpack.NormalModuleReplacementPlugin(/^gl-matrix$/,
      path.resolve(__dirname, 'node_modules', 'gl-matrix', 'dist', 'gl-matrix-min.js'))
  ]
}
