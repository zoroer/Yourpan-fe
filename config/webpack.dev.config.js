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
    '/api': {
      target: 'http://39.105.161.126:8082/api',
      changeOrigin: true,
      secure: false
    }
  },
  'dev': {
    '/api': {
      target: 'http://39.105.161.126:8090/mock/5ef80e172779b004ec638aea/api',
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
      'Set-Cookie': 'pan_token=testToken;Path=/'
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devtool: 'inline-source-map'
});
