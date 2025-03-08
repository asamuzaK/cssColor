import { tanstackViteConfig } from '@tanstack/vite-config';
import { defineConfig, mergeConfig } from 'vitest/config';
import packageJson from './package.json';

const config = defineConfig({
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

export default mergeConfig(
  config,
  tanstackViteConfig({
    entry: './src/index.ts',
    srcDir: './src',
    cjs: false
  })
);
