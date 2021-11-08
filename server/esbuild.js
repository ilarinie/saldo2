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
  target: 'node12',
  loader: {
    '.ts': 'ts'
  },
  tsconfig: './server/tsconfig.json',
  plugins: [nodeExternalsPlugin()]
}).catch(() => process.exit(1))