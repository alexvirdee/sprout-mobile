module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@screens': './src/screens',
            '@navigation': './src/navigation',
            '@theme': './src/theme',
            '@store': './src/store',
            '@services': './src/services',
            '@hooks': './src/hooks',
            '@app-types': './src/types',
            '@utils': './src/utils',
            '@features': './src/features',
          },
        },
      ],
    ],
  };
};
