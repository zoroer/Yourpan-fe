const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    app: './src/main.js'
  },
  module: {
    rules: [{
      test: /\.vue$/,
      exclude: /node_modules/,
      use: ['vue-loader']
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      use: ['babel-loader']
    }, {
      test: /\.(le|c)ss$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'postcss-loader',
        'less-loader',
      ]
    }, {
      test: /\.(png|jpeg|jpg|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'static/imgs/[name].[hash].[ext]'
      }
    }, {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'static/medias/[name].[hash].[ext]'
      }
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'static/fonts/[name].[hash].[ext]'
      }
    }]
  },
  plugins: [
    new VueLoaderPlugin(),
    new cleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      chunks: ['publicSource', 'nodeCommon', 'vue', 'element-ui', 'app'],
      favicon: path.resolve(__dirname, '../assets/logo.ico'),
      minify:{
        removeComments: true, // 删除注释
        collapseWhitespace: true // 删除空格
      }
    }),
    new MiniCssExtractPlugin({
      filename: '[name]/[name].[hash:8].css',
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        publicSource: {
          chunks: 'all',
          name: 'publicSource',
          test: /[\\/]src[\\/]common[\\/]public-source[\\/]/,
          minSize: 0,
          minChunks: 2
        },
        nodeCommon: {
          name: 'nodeCommon',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'all',
          enforce: true
        },
        vue: {
          chunks: 'all',
          test: /[\\/]node_modules[\\/]vue[\\/]/,
          name: 'vue',
          minChunks: 1,
          maxInitialRequests: 10,
          minSize: 0,
          priority: 2
        },
        'element-ui': {
          chunks: 'all',
          test: /[\\/]node_modules[\\/]element-ui[\\/]/,
          name: 'element-ui',
          minChunks: 1,
          maxInitialRequests: 10,
          minSize: 0,
          priority: 2
        },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  resolve:{
    extensions: ['.js', '.vue', '.json', 'css'],
    alias:{
      vue: 'vue/dist/vue.js',
      '@': path.resolve('./src'),
      '@common': path.resolve('./src/common'),
      '@api': path.resolve('./src/api')
    }
  },
  performance: {
    hints: false
  }
};
