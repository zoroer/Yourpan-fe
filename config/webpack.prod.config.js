const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.base.config.js');

console.log(`
  \n========================================================\n
  当前编译模式为: production
  \n========================================================\n
`);

module.exports = merge(common, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../output'),
    publicPath: '/',
    filename: "static/js/[name]/[name].[hash:8].js",
    chunkFilename: "static/js/[name]/[name].[hash:8].js"
  }
});
