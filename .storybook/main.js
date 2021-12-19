module.exports = {
  "stories": [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  "framework": "@storybook/web-components",
  "webpackFinal": async (config) => {
    config.output.publicPath = '/playground/';
    return config;
  },
  "managerWebpack": async (config) => {
    config.output.publicPath = '/playground/';
    return config;
  },
}