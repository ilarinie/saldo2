/* eslint-disable */
var fs = require('fs')
var fse = require('fs-extra')
var childProcess = require('child_process')
/* eslint-enable */

if (fs.existsSync('./build')) {
  fse.removeSync('./build')
}

if (fs.existsSync('./dist')) {
  fse.removeSync('./dist')
}

const main = async () => {
const { execa } = await import('execa')
childProcess.execSync('npm list esbuild', { stdio: 'inherit'})

  console.log('building server')
  childProcess.execSync('npx tsc -p server/tsconfig.json', { stdio: 'inherit'})
  console.log('server built')
  console.log('building client')
  childProcess.execSync('npx vite build', { stdio: 'inherit'})
  console.log('client built')
  fse.moveSync('./build', './dist/public', { overwrite: true })

}

main()

