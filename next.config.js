const withPWA = require("next-pwa");

// const __DEV__ = process.argv[2] === "dev";
const config = {
  reactStrictMode: true,
  pwa: {
    dest: "public",
    fallbacks: {
      // document: '/other-offline',  // if you want to fallback to a custom page other than /_offline
      // font: '/static/font/fallback.woff2',
      // audio: ...,
      // video: ...,
    },
  },
};

module.exports = withPWA(config);
