const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const configs = require(`./src/configs/${process.env.NODE_ENV}`);
const webpack = require("webpack");

const isDev = process.env.NODE_ENV === "development";

module.exports = {
  entry: {
    bundle: "./src/index.js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },
  plugins: [
    new webpack.EnvironmentPlugin(configs),
    new MiniCssExtractPlugin({
      path: path.resolve(__dirname, "dist"),
      filename: "style.css"
    })
  ],
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        use: "eslint-loader"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /(\.css|\.scss)$/,
        exclude: /node_modules/,
        use: [{ loader: MiniCssExtractPlugin.loader, options: { hmr: isDev } }, "css-loader", "sass-loader"]
      },
      { test: /\.hbs$/, exclude: /node_modules/, loader: "handlebars-loader" }
    ]
  }
};
