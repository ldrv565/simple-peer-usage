const merge = require('webpack-merge');
const withOffline = require('next-offline');

const {
  config: cfg,
  fontsLoader,
  imageLoader,
  mp3Loader
} = require('./webpack.config');

module.exports = withOffline({
  webpack(config, { isServer }) {
    const { rules } = config.module;
    rules.push(imageLoader(isServer));
    rules.push(fontsLoader(isServer));
    rules.push(mp3Loader(isServer));

    rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgProps: {
              fill: 'currentColor'
            }
          }
        }
      ]
    });

    return merge(config, cfg);
  }
});
