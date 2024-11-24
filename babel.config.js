module.exports = {
  presets: ['module:@react-native/babel-preset'],
  env: {
    production: {
      plugins: [
        'react-native-paper/babel',
        // react-native-reanimated/plugin has to be listed last.
        'react-native-reanimated/plugin',
      ],
    },
  },
};
