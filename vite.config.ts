import { defineConfig } from 'vitest/config';
import packageJson from './package.json' with { type: 'json' };

const externalDeps = [
  ...Object.keys(packageJson.dependencies || {}),
  ...Object.keys(packageJson.peerDependencies || {})
];

export default defineConfig({
  build: {
    outDir: './dist/esm',
    emptyOutDir: false,
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
      fileName: 'index'
    },
    rollupOptions: {
      external: id =>
        externalDeps.some(dep => id === dep || id.startsWith(`${dep}/`))
    }
  },

  test: {
    coverage: {
      enabled: true,
      include: ['src/**/*'],
      provider: 'istanbul',
      reporter: [['text', { maxCols: 100 }], 'html', 'clover', 'json']
    },
    dir: './test',
    name: packageJson.name,
    typecheck: {
      enabled: true
    },
    watch: false
  }
});
