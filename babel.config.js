module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
      },
    ],
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    [
      'import',
      {
        libraryName: 'vant',
        libraryDirectory: 'es',
        // style: true,
        style: (name) => `${name}/style/less`,
      },
      'vant',
    ],
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: {
          version: 3,
          proposals: true,
        },
        useESModules: true,
      },
    ],
  ],
}
