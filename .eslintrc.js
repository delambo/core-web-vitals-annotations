module.exports = {
  extends: ['kyt'],

  plugins: ['kyt', 'pretty-lights'],

  globals: {
    jsdom: false,
    chrome: 'writable',
  },

  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack.aliases.config.js',
      },
    },
  },

  rules: {},

  overrides: [
    {
      files: ['*.test.js'],
      rules: {
        'global-require': 0,
      },
    },
  ],
};
