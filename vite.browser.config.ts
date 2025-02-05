import esbuild from 'esbuild';
import { Plugin, defineConfig } from 'vite';

const minifyBundle = (): Plugin => ({
  name: 'minify-bundle',
  async generateBundle(_, bundle) {
    for (const asset of Object.values(bundle)) {
      if (asset.type === 'chunk') {
        asset.code = (
          await esbuild.transform(asset.code, {
            minify: true,
            legalComments: 'inline'
          })
        ).code;
      }
    }
  }
});

export default defineConfig({
  plugins: [minifyBundle()],
  ssr: {
    noExternal: true
  },
  build: {
    emptyOutDir: true,
    lib: {
      entry: 'src/index.ts',
      fileName: 'css-color.min',
      formats: ['es']
    },
    outDir: 'dist/browser',
    sourcemap: true
  }
});
