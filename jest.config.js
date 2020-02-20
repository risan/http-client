module.exports = {
  verbose: true,
  collectCoverage: true,
  moduleNameMapper: {
    '^ky$': require.resolve('ky').replace('index.js', 'umd.js'),
  },
};
