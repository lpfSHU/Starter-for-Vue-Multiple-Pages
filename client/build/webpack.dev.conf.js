const webpack = require('webpack')

const webpackBase = require('./webpack.base.conf')
const webpackBaseConf = webpackBase.config
const htmlWebpackPluginArray = webpackBase.htmlWebpackPluginArray
const webpackMerge = require('webpack-merge')
const isDev = process.env.NODE_ENV == 'development'

const openPage = webpackBaseConf.output.publicPath.replace(/^\//, '') + 'index'
const config = webpackMerge(webpackBaseConf, {
  module: {
    rules: [
      {
        test: /\.css/,
        use: [
          'vue-style-loader',
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
          'vue-style-loader',
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
          }
        ]
      }
    ]
  },
  devtool: '#cheap-module-eval-source-map',
  devServer: {
    port: '8000',
    host: '0.0.0.0',
    overlay: {
      errors: true
    },
    open: true,
    openPage,
    hot: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: { '^/api': '/api' }
      }
		},
    historyApiFallback: {
      // rewrites: [
      //   { from: /^\/public\/pageA/, to: '/public/pageA.html' },
      // ],
      rewrites: htmlWebpackPluginArray.map(v => {
        let reg = '^' + (webpackBaseConf.output.publicPath + v.options.filename).replace(/\.html$/, '')
        return {
          from: new RegExp(reg),
          to: webpackBaseConf.output.publicPath + v.options.filename
        }
      })
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
    }),
    ...htmlWebpackPluginArray
  ]
})

module.exports = config
