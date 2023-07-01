# Legacy In It Stats Plugin

## Description

This plugin is used to generate stats file for webpack and send it to the in-it server.
to analyze the bundles of your app over time.

## Installation

```bash
npm install --save-dev legacy-in-it-stats-plugin
```

## Usage

```js
// webpack.config.js
const LegacyInItStatsPlugin = require('legacy-in-it-stats-plugin');

module.exports = {
  // ...
  plugins: [
    new LegacyInItStatsPlugin({
      // options
    }),
  ],
};
```

## Options

reportFilename: string; // filename of the json report
serverUrl: string;      // url of the in-it server
buildId: string;        // id of the build
outDir: string;         // directory to write the report to
name?: string;          // name of the app