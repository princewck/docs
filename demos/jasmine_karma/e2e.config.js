exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['test/e2e/test-spec.js'],
  // capabilities: {
  //   'browserName': 'phantomjs',
  //   'phantomjs.binary.path': require('phantomjs').path
  // }
};