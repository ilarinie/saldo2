/* eslint-disable */
const esbuild = require('esbuild')

// Automatically exclude all node_modules from the bundled version
const { nodeExternalsPlugin } = require('esbuild-node-externals')

esbuild.build({
  entryPoints: ['./server/index.ts'],
  outdir: './dist',
  bundle: true,
  minify: false,
  platform: 'node',
  sourcemap: true,
  target: 'node14',
  watch: {
    onRebuild(error, result) {
      if (error) console.error('watch build failed:', error)
      else console.log('watch build succeeded:', result)
    },
  },
  loader: {
    '.ts': 'ts'
  },
  tsconfig: './server/tsconfig.json',
  plugins: [nodeExternalsPlugin()]
}).catch(() => process.exit(1))