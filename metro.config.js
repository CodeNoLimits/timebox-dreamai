const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for web
config.resolver.platforms = ['web', 'native', 'ios', 'android'];
config.resolver.alias = {
  'react-native': 'react-native-web',
};

module.exports = config;