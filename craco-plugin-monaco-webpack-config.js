const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
module.exports = {
  overrideWebpackConfig: ({ webpackConfig, cracoConfig, pluginOptions, context: { env, paths } }) => {
    webpackConfig.plugins.push(new MonacoWebpackPlugin({
      // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
      languages: ["markdown"]
    }));
    return webpackConfig;
  }
};
