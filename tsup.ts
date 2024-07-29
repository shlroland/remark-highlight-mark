import type { Options } from 'tsup'
export const config: () => Options = () => ({
  entry: ['./src/index.ts'],
  splitting: false,
  clean: true,
  outDir: './lib',
  format: 'esm',
  dts: true,
})
