// eslint-disable-next-line no-undef
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve = {
        ...webpackConfig.resolve,
        fallback: {
          fs: false,
        },
      };
      return webpackConfig;
    },
  },
};
