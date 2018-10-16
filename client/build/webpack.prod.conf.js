const path = require('path')
const webpack = require('webpack')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const webpackBase= require('./webpack.base.conf')
const webpackBaseConf = webpackBase.config
const htmlWebpackPluginArray = webpackBase.htmlWebpackPluginArray
const webpackMerge = require('webpack-merge')

const extractLoader = {
  loader: MiniCssExtractPlugin.loader,
  options: {
  }
}
const isDev = process.env.NODE_ENV == 'development'

const config = webpackMerge(webpackBaseConf, {
  output: {
    filename: 'assets/js/[name].[chunkhash:8].js'
  },
  module: {
    rules: [
      {
        test: /\.css/,
        use: [
          extractLoader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.styl/,
        use: [
          extractLoader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          'stylus-loader'
        ]
      },
      {
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 2048,
              name: 'assets/img/[name].[hash:8].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].[contenthash:8].css'
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new CleanWebpackPlugin([path.resolve(__dirname, '../../server/public')], {
      root: path.resolve(__dirname, '../../')
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
    }),
    ...htmlWebpackPluginArray
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vender: {
          test: /node_modules\//,
          name: 'vendors',
          priority: 10,
          enforce: true,
        },
        commons: {
          name: 'commons',
          priority: 1,
          minChunks: 2,
          enforce: true,
        }
      }
    },
    runtimeChunk: {
      name: 'manifest'
    },
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false,
        uglifyOptions: {
          // https://www.npmjs.com/package/uglify-js
          compress: {
            drop_console: true,//console
          }
        }
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
})

module.exports = config
