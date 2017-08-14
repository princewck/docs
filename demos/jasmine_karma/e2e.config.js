const Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');
const path = require('path');
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['test/e2e/test-spec.js'],
  capabilities: {
    'browserName': 'chrome'
  },
  jasmineNodeOpts: {
    showColors: true, // Use colors in the command line report.
  },
  onPrepare: function () {
    // Add a screenshot reporter and store screenshots to `/tmp/screnshots`:
    jasmine.getEnv().addReporter(new Jasmine2HtmlReporter({
      savePath: path.resolve(__dirname, './test/screenshots')
    }));
  }
};