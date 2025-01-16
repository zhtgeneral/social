const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const withStorybook = require('@storybook/react-native/metro/withStorybook');

module.exports = withStorybook(config, {
  enabled: process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true",
  configPath: path.resolve(__dirname, './.storybook'),
  onDisabledRemoveStorybook: true,
});