module.exports = {
  roots: [
    "./test"
  ],
  "transform": {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.tsx?$": "ts-jest"
  },
  "verbose": true,
  testURL: "http://localhost?appId=10000&advChannel=30001&sdkVersion=v2.3.8&region=sg",
  globals: {
    "md5": str => str
  }
}
