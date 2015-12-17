var path              = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var webpack           = require('webpack');
var merge             = require('webpack-merge');
// Load *package.json* so we can use `dependencies` from there
var pkg               = require('./package.json');

var TARGET            = process.env.npm_lifecycle_event; //What is this????
var ROOT_PATH         = path.resolve(__dirname);
var APP_PATH          = path.resolve(ROOT_PATH, 'app');
var BUILD_PATH        = path.resolve(ROOT_PATH, 'build');

process.env.BABEL_ENV = TARGET;

var common = {
  entry : APP_PATH,
  output: {
    path    : BUILD_PATH,
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test   : /\.css$/,
        loaders: ['style', 'css'],
        include: APP_PATH
      },
      {
        test   : /\.jsx?$/,
        loaders: ['babel'],
        include: APP_PATH
      }
    ]
  },
  devServer: {
    historyApiFallback: true, //HTML5 History API ????
    hot               : true,
    inline            : true,
    progress          : true,

    // parse host and port from env so this is easy
    // to customize
    host: process.env.HOST,
    port: process.env.PORT
  },
  plugins: [
    //new webpack.HotModuleReplacementPlugin(),
    new HtmlwebpackPlugin({
      title: 'Kanban app'
    })
  ]
};


if(TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devtool  : 'eval-source-map',
    devServer: {
      historyApiFallback: true,
      hot               : true,
      inline            : true,
      progress          : true
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  });
}

if(TARGET === 'build') {
  module.exports = merge(common, {
    entry: {
      app    : APP_PATH,
      vendors: Object.keys(pkg.dependencies).filter(function(v) {
        // Exclude alt-utils as it won't work with this setup
        // due to the way the package has been designed
        // (no package.json main).
        return v !== 'alt-utils';
      })
    },
    output: {
      path    : './build/',
      filename: 'bundle.js'
    },
    devtool: 'source-map',
    plugins: [
      // Extract vendor and manifest files
      new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor', 'manifest']
      }),
      // Setting DefinePlugin affects React library size!
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  });
}
