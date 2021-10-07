/* eslint-disable */
var fs = require('fs');
var fse = require('fs-extra');
var childProcess = require('child_process');
/* eslint-enable */

if (fs.existsSync('./build')) {
  fse.removeSync('./build');
}

if (fs.existsSync('./dist')) {
  fse.removeSync('./dist');
}

childProcess.execSync('tsc --build && vite build', { stdio: 'inherit' });

fse.moveSync('./build', './dist/public', { overwrite: true });
