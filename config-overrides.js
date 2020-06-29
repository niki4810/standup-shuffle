const path = require("path");
module.exports = function override(config, env) {
  return {
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.alias,
        actions: path.resolve(__dirname, "src/actions"),
        components: path.resolve(__dirname, "src/components"),
        store: path.resolve(__dirname, "src/store"),
        utils: path.resolve(__dirname, "src/utils")
      }
    }
  }
}
