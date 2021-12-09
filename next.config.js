const withPWA = require("next-pwa");

// const __DEV__ = process.argv[2] === "dev";
const config = {
  reactStrictMode: true,
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
  },
};

module.exports = withPWA(config);
