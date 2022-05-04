const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: {
    main: path.resolve(__dirname, './src/pages/landing-page/landing-page.component.js'),
    serp: path.resolve(__dirname, './src/pages/serp/serp.js'),
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'pe viitor',
      template: path.resolve(__dirname, './src/index.html'), // template file
      filename: 'index.html', // output file
      chunks: ['main']
    }),
    new HtmlWebpackPlugin({
      title: 'pe viitor',
      template: path.resolve(__dirname, './src/pages/serp/index.html'), // template file
      filename: 'rezultate/index.html', // output file
      chunks: ['serp']
    }),
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],

  mode: 'development',
  devServer: {
    historyApiFallback: true,
    open: true,
    compress: true,
    hot: true,
    port: 2001,
  },
  module: {
    rules: [
      // Javascript
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      // Images
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
      },
      // Fonts and SVGs
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline',
      },
      // CSS, PostCSS, and Sass
      {
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
    ]
  }
}