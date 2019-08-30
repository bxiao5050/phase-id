module.exports = {
  roots: [
    "./test"
  ],
  "transform": {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.tsx?$": "ts-jest"
  },
  "verbose": true,
  testURL: "http://localhost/index.html?appId=10000&advChannel=30001&sdkVersion=v2.3.8&region=test",
  globals: {
    IS_TEST: false,
    IS_DEV: true,
    RG: {
      jssdk: {
        config: {

        }
      }
    }
  },
  moduleNameMapper: {
    "^SDK/(.*)$": "<rootDir>/src/jssdk/$1",
    "^Base/(.*)$": "<rootDir>/src/jssdk/Base/$1",
  }
}
