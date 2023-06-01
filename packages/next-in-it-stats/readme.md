# Next In-It Stats

Keep track of your next.js app's bundle.

> next-in-it-stats is a TypeScript package that helps you analyze and keep track of your nextjs bundle sizes over time. It provides valuable insights into the growth and changes in your bundles, allowing you to set limits and detect bloated dependencies.

## Installation

```bash
npm install next-in-it-stats
```

## Integration

```js
// next.config.js
const withInItStats = require('next-in-it-stats')({
  legacy: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = withInItStats(nextConfig);
```

## Usage
Now when you run `npm build` you'll see a link to analyze your bundles.
![analyze link](../../images/analyze%20link.png)

You can click it to see the bundle analyzer report.
![bundle analyzer report](../../images/bundle%20analyzer%20report.png)

Or you can see your apps page (after logging in) and click on the app you want to analyze.
![apps page](../../images/apps%20page.png)


## Limit bundles (work in progress)

```js
// .in-itrc.js
module.exports = {
    "track": "**/*", // globby to which files in the build dir you want to track (default)
    "limits": [
        {
            "server/chunks/**/*": {
                "maxSize": "10mb",
            }
        },
        {
            "static/chunks/app/layout*": {
                "maxSize": "10kb",
                "maxDifference": "10%", // not yet supported
            }
        },
        {
            "static/chunks/app/page*": {
                "maxSize": "5kb",
                "prohibitedModules": [ // not yet supported
                    "lodash",
                ]
            }
        },
    ]
};
```
