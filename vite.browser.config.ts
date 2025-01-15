import esbuild from 'esbuild';
import { defineConfig, Plugin } from 'vite';

const minifyBundle = (): Plugin => ({
  name: 'minify-bundle',
  async generateBundle(_, bundle) {
    for (const asset of Object.values(bundle)) {
      if (asset.type === 'chunk') {
        asset.code = (
          await esbuild.transform(asset.code, {
            minify: true,
            legalComments: 'eof'
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
    emptyOutDir: false,
    outDir: 'dist/browser',
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: () => {
        return '[name].min.js';
      }
    },
    sourcemap: true
  }
});
