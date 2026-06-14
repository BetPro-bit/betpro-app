const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web') {
    if (moduleName === 'expo-linear-gradient') {
      return { filePath: path.resolve(__dirname, 'shims/LinearGradient.js'), type: 'sourceFile' };
    }
    if (moduleName === 'expo-secure-store') {
      return { filePath: path.resolve(__dirname, 'shims/SecureStore.js'), type: 'sourceFile' };
    }
    if (moduleName === 'react-native-reanimated') {
      return { filePath: path.resolve(__dirname, 'shims/Reanimated.js'), type: 'sourceFile' };
    }
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
