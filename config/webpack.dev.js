const webpack = require('webpack');
const path = require('path');
const Merge = require('webpack-merge');
const CommonConfig = require('./webpack.common.js');

process.env.NODE_ENV = 'development'

module.exports = Merge(CommonConfig, {
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devtool: 'inline-source-map',
  devServer: {
    publicPath: '/',
    disableHostCheck: true,
    allowedHosts: ['*'],
    port: 3000,
    open: false,
    contentBase: path.join(process.cwd(), 'src/static'), // static file location
    host: 'localhost',
    noInfo: false,
    stats: 'minimal',
    hot: true  // hot module replacement. Depends on HotModuleReplacementPlugin
  }
});