const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
  entry: path.resolve(__dirname, 'app/main.js'),
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle-[hash].js'
  },
  module: {
    rules: [
      {
        test: /(\.js|\.jsx)$/,
        use: {
          loader: 'babel-loader'
        },
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              module: true
            }
          },
          {
            loader: 'postcss-loader'
          }
        ]
      }
    ],
  },
  plugins: [
    new webpack.BannerPlugin('版权所有，翻版必究'),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'app/index.tmpl.html')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new ExtractTextPlugin("style.css")
  ],
  devtool: 'eval-source-map',
  devServer: {
    port: 8099,
    hot: true,
    inline: true,
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, 'public'),
    host: '127.0.0.1',
    setup(app) {
      app.get('/api', (req, res) => {
        res.send({
          name: 'nameA',
          param1: {
            age: 20,
            gender: 'female'
          }
        });
      });
    }
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.css', '.scss'],
    modules: [
      "node_modules",
      path.join(__dirname, 'node_modules')
    ],
    alias: {
      '@': path.resolve(__dirname, 'app/Components')
    }
  }
}