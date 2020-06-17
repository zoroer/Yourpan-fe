const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.base.config.js');

console.log(`
  \n=====================================================\n
  当前编译模式为: development
  \n=====================================================\n
`);

module.exports = merge(common, {
  mode: 'development',
  output: {
    path: path.resolve(__dirname, '../output'),
    filename: "[name]/[name].[hash:8].js",
    chunkFilename: "[name]/[name].[hash:8].js",
    publicPath: '/'
  },
  devServer: {
    hot: true,
    open: true,
    compress: true,
    contentBase: path.join(__dirname, "output"),
    proxy: process.env.proxyEnv === 'proxy'
      ? {
        '/api': {
          target: 'todo',
          changeOrigin: true,
          secure: false
        }
      }
      : {
        '/api': {
          target: ' https://www.easy-mock.com/mock/5ee9a15fdbebf20874bb1b81/pan',
          changeOrigin: true,
          secure: false
        }
      },
    headers: {
      'Set-Cookie': 'pan_token=62F8FAD5033694690D41970A2D4387D73255F265BF426C64A107A071B709A93346208DF8EDDE276B9C9064755ED7F2CC;'
    },
  },
  plugins: [
  ],
  devtool: 'inline-source-map'
});
