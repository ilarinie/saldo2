var fs = require('fs');
var fse = require('fs-extra');
var childProcess = require('child_process');

if (fs.existsSync('./build')) {
  fse.removeSync('./build');
}

if (fs.existsSync('./dist')) {
  fse.removeSync('./dist');
}

childProcess.execSync('tsc && vite build', { stdio: 'inherit' });
childProcess.execSync('tsc -p server/tsconfig.json', { stdio: 'inherit' });

fse.moveSync('./build', './dist/public', { overwrite: true });
