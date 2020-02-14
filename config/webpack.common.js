const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');

const devMode = process.env.NODE_ENV !== 'production';
const moreHtmls = []
const pugRegExp = /.*\.pug$/
const imgPath = 'src/static/images'
const fontsPath = 'src/static/fonts'

fs.readdirSync('./src/pug/pages')
  .forEach(name => {
    if (pugRegExp.test(name)) {
      moreHtmls.push(new HtmlWebpackPlugin({
        filename: `${name.slice(0,-4)}.html`,
        template: `./pug/pages/${name}`,
      }), new HtmlWebpackPugPlugin())
    }
  }
)

const images = fs.readdirSync(imgPath)
  .filter(file => file.match(/.*\.(jpg|jpeg|png|svg|gif)$/))
  .map(i => 'static/images/' + i)

const fonts = fs.readdirSync(fontsPath)
  .filter(file => file.match(/.*\.(eot|svg|ttf|otf|woff|woff2)$/))
  .map(f => 'static/fonts/' + f)

const babel = {
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
  }
}

const scss = {
  test: /\.(sa|sc|c)ss$/,
  use: [
    {
      loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
    },
    'css-loader',
    'postcss-loader',
    'sass-loader',
  ],
}

const url = {
  test: /\.(svg|png|jpg|jpeg|gif)$/i,
  exclude: [
    path.join(process.cwd(), './src/static/fonts'),
  ],
  use: [
    { loader: 'url-loader',
      options: {
        limit: 8192,
        name: '[name].[ext]',
        outputPath: 'images/',
      },
    },
    { loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: 'images/',
      },
    }
  ]
}

const font = {
  test: /\.(woff(2)?|woff|ttf|otf|eot|svg)$/i,
  exclude: path.join(process.cwd(), './src/static/images'),
  use: [
    { loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: 'fonts/',
      },
    },
  ],
}

const pug = {
  test: /\.pug$/,
  use: [
    { loader: "html-loader",
      options: {
        minimize: false,
        removeComments: false,
        collapseWhitespace: false,
        attrs: false,
      },
    },
    { loader: 'pug-html-loader',
      options: {
        pretty: true,
      },
    },
  ]
}

module.exports = {
  context: path.join(process.cwd(), 'src'),
  entry: [
    './js/index.js',
    './scss/index.scss',
    ...images,
    ...fonts
  ],
  output: {
    path: path.join(process.cwd(), 'dist'),
    filename: '[name].bundle.[hash].js',
    publicPath: '/',
  },
  module: {
    rules: [ babel, scss, url, font, pug, ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery/dist/jquery.min.js",
      jQuery: "jquery/dist/jquery.min.js",
      "window.jQuery": "jquery/dist/jquery.min.js"
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
    }),
    ...moreHtmls,
  ],
  resolve: {
    extensions: ['.js', '.scss', '.pug', 'html'],
    modules: [path.join(process.cwd(), 'src'), 'node_modules'],
    alias: {
      '@fortawesome': '@fortawesome/fontawesome-free',
    }
  },
};