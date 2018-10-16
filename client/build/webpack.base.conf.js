const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const isDev = process.env.NODE_ENV == 'development'

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const glob = require('glob')

const entries = {}
const htmlWebpackPluginArray = []
glob.sync('./src/pages/**/app.js').forEach(path => {
  const reg = /^\.\/src\/pages\/(.+)\/app\.js$/
  const chunk = path.match(reg)[1]
  entries[chunk] = path

  const filename = chunk + '.html'
  const htmlConf = {
    filename: filename,
    template: path.replace(/.js/g, '.html'),
    inject: 'body',
    favicon: './src/assets/img/logo.png',
    hash: false,
    chunks: ['manifest', 'vendors', 'commons', chunk],
    minify: {
      collapseWhitespace: true
    }
  }
  htmlWebpackPluginArray.push(new HtmlWebpackPlugin(htmlConf))
})

let config = {
  target: 'web',
  mode: isDev ? 'development' : 'production',
  resolve: {
    extensions: ['.js', '.vue', '.css', '.styl'],
    alias: {
      assets: resolve('src/assets'),
			components: resolve('src/components'),
			utils: resolve('src/utils'),
			pages: resolve('src/pages')
    }
  },
  entry: entries,
  output: {
    filename: 'assets/js/[name].js',
    path: path.resolve(__dirname, '../../server/public'),
    publicPath: '/public/'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /\.(eot|ttf|woff|woff2|svgz)$/,
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
  plugins: [
    new VueLoaderPlugin()
  ]
}


module.exports = {
  config,
  htmlWebpackPluginArray,
  entries
}

