module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@assets': './src/assets',
          '@components': './src/components',
          '@constant': './src/constant',
          '@container': './src/container',
          '@hooks': './src/hooks',
          '@navigation': './src/navigation',
          '@rtkServices': './src/rtkServices',
          '@socket': './src/socket',
          '@store': './src/store',
          '@translation': './src/translation',
          '@utils': './src/utils',
        },
      },
    ],
    // Must be listed last.
    'react-native-worklets/plugin',
  ],
};
