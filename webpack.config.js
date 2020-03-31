const path = require('path');

const resouceLoader = ({ test, type, isServer }) => ({
  test,
  use: [
    {
      loader: 'url-loader',
      options: {
        limit: 8192,
        fallback: 'file-loader',
        publicPath: `/_next/static/${type}/`,
        outputPath: `${isServer ? '../' : ''}static/${type}/`,
        name: '[name]-[hash].[ext]'
      }
    }
  ]
});

const fontsLoader = isServer =>
  resouceLoader({
    test: /\.(eot|ttf|woff|woff2)$/,
    type: 'fonts',
    isServer
  });

const imageLoader = isServer =>
  resouceLoader({
    type: 'images',
    test: /\.(png|jpg|gif)$/,
    isServer
  });

const mp3Loader = isServer =>
  resouceLoader({
    type: 'audio',
    test: /\.(mp3)$/,
    isServer
  });

module.exports = {
  config: {
    resolve: {
      alias: {
        components: path.resolve(__dirname, './components'),
        constants: path.resolve(__dirname, './constants'),
        context: path.resolve(__dirname, './context'),
        core: path.resolve(__dirname, './core'),
        utils: path.resolve(__dirname, './utils'),
        validation: path.resolve(__dirname, './validation'),
        theme: path.resolve(__dirname, './core/theme'),
        services: path.resolve(__dirname, './services'),
        sources: path.resolve(__dirname, './sources'),
        graphQL: path.resolve(__dirname, './graphql'),
        public: path.resolve(__dirname, './public'),
        api: path.resolve(__dirname, './api'),
        hooks: path.resolve(__dirname, './hooks')
      }
    },
    node: {
      fs: 'empty'
    }
  },
  imageLoader,
  fontsLoader,
  mp3Loader
};
