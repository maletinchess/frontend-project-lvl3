const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: process.env.NODE_ENV || 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(scss)$/,
        use: [
          'style-loader', // inject CSS to page
          'css-loader', // translates CSS into CommonJS modules
          'postcss-loader',
          'sass-loader', // compiles Sass to CSS
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'template.html',
    }),
  ],
};
