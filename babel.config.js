module.exports = function (api) {
  api.cache(true);

  const isWeb = process.env.EXPO_TARGET === 'web' || 
                process.env.BABEL_ENV === 'web' ||
                process.env.NODE_ENV === 'production';

  return {
    presets: ['babel-preset-expo'],
    plugins: isWeb ? [] : ['react-native-reanimated/plugin'],
  };
};
