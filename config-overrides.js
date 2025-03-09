const { override } = require("customize-cra");

module.exports = override((config) => {
  if (!config.resolve) {
    config.resolve = {};
  }
  config.resolve.alias = {
    ...config.resolve.alias,
    path: require.resolve("path-browserify"),
  };
  return config;
});
