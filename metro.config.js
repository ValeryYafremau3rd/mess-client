const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

config.projectRoot = __dirname;
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "node_modules"),
];

config.transformer.publicPath = "./";

config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = [
  "browser",
  "require",
  "react-native",
  "default",
];

module.exports = config;