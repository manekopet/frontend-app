const webpack = require("webpack");
const path = require("path");
module.exports = function override(config) {
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      "@/apis": path.resolve(__dirname, "src/apis"),
      "@/hooks": path.resolve(__dirname, "src/hooks"),
      "@/redux": path.resolve(__dirname, "src/redux"),
      "@/providers": path.resolve(__dirname, "src/providers"),
      "@/functions": path.resolve(__dirname, "src/functions"),
      "@/types": path.resolve(__dirname, "src/types"),
      "@/pages": path.resolve(__dirname, "src/pages"),
      "@/assets": path.resolve(__dirname, "src/assets"),
      "@/utils": path.resolve(__dirname, "src/utils"),
      "@/components": path.resolve(__dirname, "src/components"),
      "@/configs": path.resolve(__dirname, "src/configs"),
      "@/http": path.resolve(__dirname, "src/http"),
    },
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".d.ts"],
  };
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    util: require.resolve("util"),
    assert: require.resolve("assert"),
    http: false,
    https: false,
    os: false,
    url: false,
    fs: false,
    process: false,
    path: false,
    zlib: false,
  });
  config.resolve.fallback = fallback;
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ]);
  config.ignoreWarnings = [/Failed to parse source map/];
  const loaders = config.module.rules[1].oneOf;
  loaders.splice(loaders.length - 1, 0, {
    test: /\.(js|mjs|cjs)$/,
    exclude: /@babel(?:\/|\\{1,2})runtime/,
    loader: require.resolve("babel-loader"),
    options: {
      babelrc: false,
      configFile: false,
      compact: false,
      presets: [
        [
          require.resolve('babel-preset-react-app/dependencies'),
          {
            helpers: true
          },
        ],
      ],
      cacheDirectory: true,
      cacheCompression: false,
    },
  });
  config.module.rules.push({
    test: /\.(js|mjs|jsx|ts|tsx|cjs)$/,
    enforce: "pre",
    loader: require.resolve("source-map-loader"),
    resolve: {
      fullySpecified: false,
    },
  });
  config.module.rules.push({
    test: /\.svg$/i,
    issuer: /\.[jt]sx?$/,
    use: ["@svgr/webpack"],
  });
  return config;
};