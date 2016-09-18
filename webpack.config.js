var path = require('path');
var nodeExternals = require('webpack-node-externals');

var dir_src = path.resolve(__dirname, 'src');
var dir_html = path.resolve(__dirname, 'html');
var dir_build = path.resolve(__dirname, 'build');

module.exports  = {
  entry: path.resolve(dir_src, 'index.js'),
  output: {
    path: dir_build,
    filename: "redux-simple-models.js",
    libraryTarget: "umd",
    library: 'redux-simple-models',
  },
  externals: [nodeExternals()],
  module: {
    loaders: [
      {
        loader: "babel-loader",
        // Skip any files outside of your project's `src` directory
        include: [
          dir_src
        ],
        // Only run `.js` and `.jsx` files through Babel
        test: /\.jsx?$/,
        // Options to configure babel with
        query: {
          plugins: ['transform-runtime'],
          presets: ['es2015', 'stage-0'],
        }
      },
    ]
  }
};
