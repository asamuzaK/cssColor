import { tanstackViteConfig } from '@tanstack/config/vite';
import { defineConfig, mergeConfig } from 'vitest/config';
import packageJson from './package.json';

const config = defineConfig({
  test: {
    coverage: {
      enabled: true,
      provider: 'istanbul',
      include: ['src/**/*']
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
