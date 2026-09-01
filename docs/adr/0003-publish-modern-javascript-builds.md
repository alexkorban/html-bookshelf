# Publish modern JavaScript builds

The package will be written in JavaScript and publish an ESM API, a browser
IIFE build, and a Node.js 20+ command-line tool. Version 1 will not ship a
CommonJS build, which keeps the browser and package distribution small and
avoids a duplicate compatibility surface.
