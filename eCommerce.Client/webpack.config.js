const fs = require('fs');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env = {}) => {
  const { qa, production, local, preprod } = env;

  let activeEnv = 'development';
  if (qa) {
    activeEnv = 'qa';
  } else if (production) {
    activeEnv = 'production';
  } else if (local) {
    activeEnv = 'local';
  } else if (preprod) {
    activeEnv = 'preprod';
  }

  const copyPatterns = [
    { from: './public/favicon.ico', to: './favicon.ico' },
    { from: './public/favicon.svg', to: './favicon.svg' },
    { from: './public/favicon-32x32.png', to: './favicon-32x32.png' },
    { from: './public/apple-touch-icon.png', to: './apple-touch-icon.png' },
    { from: './public/safari-pinned-tab.svg', to: './safari-pinned-tab.svg' },
    { from: './public/web.config', to: './' },
    { from: './public/silent-renew.html', to: './' },
  ].filter(({ from }) => fs.existsSync(path.resolve(__dirname, from)));

  return {
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
    entry: './src/index.js',
    mode: production ? 'production' : 'development',
    devtool: 'source-map',
    output: {
      path: path.resolve(__dirname, './build'),
      filename: '[name].[contenthash:8].bundle.js',
      publicPath: '/',
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        maxSize: 500000,
      },
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: {
        root: __dirname,
        src: path.resolve(__dirname, 'src/'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }]],
            },
          },
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|jp(e*)g|svg|gif|pdf)$/,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 8000,
            },
          },
          generator: {
            filename: 'images/[hash]-[name][ext]',
          },
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: () => [require('precss'), require('autoprefixer')],
                },
              },
            },
            {
              loader: require.resolve('sass-loader'),
              options: {
                implementation: require('sass'),
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html',
      }),
      new MiniCssExtractPlugin({
        filename: 'assets/[name].css',
      }),
      new Dotenv({
        path: `./.env.${activeEnv}`,
      }),
      new CopyPlugin({
        patterns: copyPatterns,
      }),
    ],
    devServer: {
      static: path.join(__dirname, 'build'),
      compress: true,
      port: 3000,
      historyApiFallback: true,
      open: true,
    },
  };
};
