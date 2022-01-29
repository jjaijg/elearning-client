const path = require("path");
// razzle.config.js
module.exports = {
  plugins: [
    {
      name: "purgecss",
      options: {
        // This path options is required for PurgeCSS to analyzed all of our content
        path: path.resolve(__dirname, "src/**/*"),
      },
    },
  ],
  modify: (config, { dev, target }) => {},
};
