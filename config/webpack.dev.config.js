const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.base.config.js');
const devMode = process.env.proxyEnv? process.env.proxyEnv : 'development';

console.log(`
  \n========================================================\n
  当前编译模式为: ${devMode}
  \n========================================================\n
`);

// 接口调用
const apiMap = {
  'proxy': {
    '/pan': {
      target: 'todo',
      changeOrigin: true,
      secure: false
    }
  },
  'dev': {
    '/pan': {
      target: ' https://www.easy-mock.com/mock/5ee9a15fdbebf20874bb1b81/pan',
      changeOrigin: true,
      secure: false
    }
  }
};

module.exports = merge(common, {
  mode: 'development',
  output: {
    path: path.resolve(__dirname, '../output'),
    filename: "static/js/[name]/[name].js",
    chunkFilename: "static/js/[name]/[name]js",
    publicPath: '/'
  },
  devServer: {
    hot: true,
    open: true,
    compress: true,
    contentBase: path.join(__dirname, "output"),
    proxy: process.env.proxyEnv === 'proxy'
      ? apiMap.proxy
      : apiMap.dev,
    headers: {
      'Set-Cookie': 'pan_token=62F8FAD5033694690D41970A2D4387D73255F265BF426C64A107A071B709A93346208DF8EDDE276B9C9064755ED7F2CC;'
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devtool: 'inline-source-map'
});
