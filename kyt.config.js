const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const path = require('path');
const aliasesConfig = require('./webpack.aliases.config.js');
const packageJSON = require('./package.json');

module.exports = {
  reactHotLoader: false,
  debug: false,
  hasServer: false,
  clientURL: 'http://localhost:3002',
  modifyWebpackConfig: (config, options) => {
    if (options.type === 'client') {
      // Aliases
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        ...aliasesConfig.resolve.alias,
      };
      config.devtool = 'source-map';
      // config.entry.background = './src/background/index.js';
      // config.entry.contentScript = './src/contentScript/index.js';
      config.entry.popup = './src/popup/index.js';
      delete config.entry.main;

      if (config.devServer) config.devServer.publicPath = '.';
      config.output.publicPath = '.';

      if (options.environment === 'production') {
        config.optimization = {};
        config.output.filename = '[name].js';
        config.output.chunkFilename = '[name].js';
      }

      config.plugins.push(
        new CopyWebpackPlugin([
          {
            from: 'src/manifest.json',
            transform(content) {
              // Overwrite manifest.json with metadata from package.json
              return Buffer.from(
                JSON.stringify({
                  ...JSON.parse(content.toString()),
                  name: packageJSON.name,
                  description: packageJSON.description,
                  version: packageJSON.version,
                })
              );
            },
          },
          {
            from: 'src/public/**/*',
            transformPath: (target) => {
              return target.replace(/src\/public\//, '');
            },
          },
          {
            from: 'node_modules/web-vitals/dist/web-vitals.umd.js',
            transformPath: (target) => {
              return target.replace(/node_modules\/web-vitals\/dist\//, '');
            },
          },
        ]),
        new HtmlWebpackPlugin({
          template: path.join(__dirname, 'src/popup', 'popup.ejs'),
          filename: 'popup.html',
          chunks: ['popup'],
        }),
        new WriteFilePlugin({ test: /^(?!.*(hot)).*/ })
      );
    }

    return config;
  },
};
