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
    {
      name: "compression",
      options: {
        brotli: true,
        gzip: true,
        compressionPlugin: {
          filename: "[path].gz[query]",
          algorithm: "gzip",
          test: /\.(js|css|html|svg)$/,
          compressionOptions: { level: 9 },
          minRatio: 0.8,
        },
        brotliPlugin: {
          asset: "[path].br[query]",
          test: /\.(js|css|html|svg)$/,
          minRatio: 0.8,
        },
      },
    },
  ],
  modify: (config, { dev, target }) => {},
};
