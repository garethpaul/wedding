#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const less = require('../app/node_modules/less');

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'app', 'public', 'css', 'main.less');
const outputPath = path.join(root, 'app', 'public', 'css', 'main.css');
const source = fs.readFileSync(sourcePath, 'utf8');
const sourceDigest = crypto.createHash('sha256').update(source).digest('hex');

less.render(source, {
  filename: sourcePath,
  javascriptEnabled: false,
  sourceMap: undefined
}).then((result) => {
  const banner = `/* source-sha256: ${sourceDigest} */\n`;
  fs.writeFileSync(outputPath, banner + result.css, 'utf8');
}).catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
