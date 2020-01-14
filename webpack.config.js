const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const dotenv = require('dotenv');

const debug = process.env.NODE_ENV !== 'production';
const env = dotenv.config().parsed;
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

module.exports = {
  entry: './src/index.tsx',
  mode: debug ? 'development' : 'production',
  output: {
    path: '/dist',
    filename: 'js/[name].bundle.min.js',
    chunkFilename: 'js/[name].bundle.js',
  },
  devServer: {
    inline: true,
    contentBase: '/dist',
    port: 3000,
    historyApiFallback: true,
    hot: true,
    overlay: true,
    stats: 'minimal',
  },
  devtool: debug ? 'cheap-module-eval-source-map' : false,
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        exclude: [/node_modules/, /\.test.tsx?$/],
        options: {
          transpileOnly: true,
        },
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: debug
          ? ['style-loader', 'css-loader', 'sass-loader']
          : [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(eot|ttf|woff|woff2|otf|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 100000,
              name: './assets/fonts/[name].[ext]',
              publicPath: '../',
            },
          },
        ],
      },
      {
        test: /\.(gif|png|jpe?g)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets/images/',
            },
          },
        ],
      },
    ],
  },
  plugins: debug
    ? [
        new ForkTsCheckerWebpackPlugin({
          async: false,
        }),
        new webpack.HotModuleReplacementPlugin(),
        new CircularDependencyPlugin({
          exclude: /a\.js|node_modules/,
          failOnError: true,
          cwd: process.cwd(),
        }),
        new HtmlWebpackPlugin({
          template: path.resolve(__dirname, 'public', 'index.html'),
        }),
      ]
    : [
        new webpack.DefinePlugin(envKeys),
        new ForkTsCheckerWebpackPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new MiniCssExtractPlugin({
          filename: '[name].css',
          chunkFilename: '[id].css',
        }),
        new webpack.LoaderOptionsPlugin({
          minimize: true,
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new HtmlWebpackPlugin({
          template: path.resolve(__dirname, 'public', 'index.html'),
          minify: {
            collapseWhitespace: true,
            removeAttributeQuotes: false,
          },
        }),
        new CompressionPlugin({
          test: /\.(html|css|js|gif|svg|ico|woff|ttf|eot)$/,
          exclude: /(node_modules)/,
        }),
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
        }),
      ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        terserOptions: {
          ie8: true,
          safari10: true,
          sourceMap: true,
        },
      }),
    ],
  },
};
