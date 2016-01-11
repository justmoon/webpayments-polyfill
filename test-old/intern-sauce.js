define({
  // Default desired capabilities for all environments. Individual capabilities can be overridden by any of the
  // specified browser environments in the `environments` array below as well. See
  // <https://theintern.github.io/intern/#option-capabilities> for links to the different capabilities options for
  // different services.
  //
  // Note that the `build` capability will be filled in with the current commit ID or build tag from the CI
  // environment automatically
  capabilities: {
  },

  // Browsers to run integration testing against. Note that version numbers must be strings if used with Sauce
  // OnDemand. Options that will be permutated are browserName, version, platform, and platformVersion; any other
  // capabilities options specified for an environment will be copied as-is
  environments: [
    { browserName: 'firefox' },
    { browserName: 'internet explorer', version: ['9', '10', '11'], platform: [ 'Windows 7' ] },
    { browserName: 'chrome' },
    { browserName: 'safari' }
  ],

  // Maximum number of simultaneous integration tests that should be executed on the remote WebDriver service
  maxConcurrency: 2,

  // Name of the tunnel class to use for WebDriver tests.
  // See <https://theintern.github.io/intern/#option-tunnel> for built-in options
  tunnel: 'SauceLabsTunnel',

  // Configuration options for the module loader; any AMD configuration options supported by the AMD loader in use
  // can be used here.
  // If you want to use a different loader than the default loader, see
  // <https://theintern.github.io/intern/#option-useLoader> for instruction
  loaderOptions: {
    // Packages that should be registered with the loader in each testing environment
    packages: [ { name: 'myPackage', location: '.' } ]
  },

  // Non-functional test suite(s) to run in each browser
  suites: [ 'test/unit/polyfill' ],

  // Functional test suite(s) to execute against each browser once non-functional tests are completed
  functionalSuites: [ 'test/functional/polyfill' ],

  // A regular expression matching URLs to files that should not be included in code coverage analysis
  excludeInstrumentation: /^(?:test|node_modules)\//,

  // Leave remote browser running after a failure
  leaveRemoteOpen: 'fail'
})
