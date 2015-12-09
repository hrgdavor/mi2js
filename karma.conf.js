// Karma configuration
// Generated on Thu Jun 05 2014 13:56:40 GMT+0200 (Central European Daylight Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'src/mi2.js',
      'src/comp.js',
      'src/poly/bind.js',
      'src/NWGroup.js',
      'src/InputGroup.js',
      'src/*.js',
      'src/util/filter.sample.js',

      'src/base/Tpl.js',
      'src/base/Button.js',
      'src/base/Group.js',
      'src/base/Loop.js',
      'src/base/InputBase.js',
      'src/base/MultiCheck.js',
      'src/base/Table.js',

      'spec/*.js',
      'spec/base/*.js',
      // 'spec/loopSpec.js',
      // 'spec/tableSpec.js',

       {pattern: 'spec/test.json', included: false}
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: [
        'PhantomJS',
        // 'Chrome'
    ],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
