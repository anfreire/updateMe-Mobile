const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');
const {withNativeWind} = require('nativewind/metro');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {};

const mergedConfig = mergeConfig(getDefaultConfig(__dirname), config);

const reanimatedConfig = wrapWithReanimatedMetroConfig(mergedConfig);

const nativeWindConfig = withNativeWind(reanimatedConfig, {
  input: './global.css',
});

module.exports = nativeWindConfig;
