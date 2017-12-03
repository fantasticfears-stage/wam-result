const path = require('path');
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
var webpack = require('webpack');

module.exports = {
  entry: './index.js',
  output: {filename: 'bundle.js', path: path.resolve(__dirname, 'public/js')},
  module: {
    rules: [{
      use: {
        loader: 'babel-loader',
        options: {
          plugins: ['lodash'],
          presets: [['env', { modules: false, targets: { node: 4 } }]]
        }
      },
      test: /\.js$/,
      exclude: /node_modules/,
    }, {
      test: /\.csv$/,
      use: [
        {
          loader: 'raw-loader',
          options: {
            name: 'public/data'
          }
        }
      ]
    }]
  },
  plugins: [
    new LodashModuleReplacementPlugin({ collections: true }),
    new webpack.optimize.UglifyJsPlugin()
  ]
};
