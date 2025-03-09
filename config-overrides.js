const { override } = require("customize-cra");

module.exports = override((config) => {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    encoding: false, // Fix untuk error encoding/lib/iconv-loader.js
  };
  return config;
});
