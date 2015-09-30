var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: path.join(__dirname, 'src/'),
  entry: {
    'font-guess': './font-guess.js'
  },
  output: {
    path: path.join(__dirname, 'dist/'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'FontGuess'
  },
  module: {
    loaders: [
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]
};
