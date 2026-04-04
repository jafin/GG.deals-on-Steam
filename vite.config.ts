import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';
import { version as pkgVersion } from './package.json';

const version = process.env.APP_VERSION || pkgVersion;

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'preact',
  },
  build: {
    minify: false,
  },
  plugins: [
    monkey({
      entry: 'src/main.tsx',
      userscript: {
        name: 'GG.deals on Steam',
        namespace: 'ggdeals-on-steam',
        version,
        description: 'Displays the current lowest prices from GG.deals directly on Steam store pages.',
        author: 'jafin (Jizlus)',
        icon: 'https://raw.githubusercontent.com/jafin/GG.deals-on-Steam/refs/heads/server/icons/ggdeals_logo_white.png',
        match: [
          'https://store.steampowered.com/*',
        ],
        grant: [
          'GM_xmlhttpRequest',
          'GM_getValue',
          'GM_setValue',
          'GM_deleteValue',
        ],
        connect: [
          'api.gg.deals',
          'raw.githubusercontent.com',
        ],
        require: [
          'https://cdn.jsdelivr.net/npm/preact@10.29.1/dist/preact.umd.js',
          'https://cdn.jsdelivr.net/npm/preact@10.29.1/hooks/dist/hooks.umd.js',
          'https://cdn.jsdelivr.net/npm/preact@10.29.1/jsx-runtime/dist/jsxRuntime.umd.js',
          'https://cdn.jsdelivr.net/npm/@preact/signals-core@1.14.1/dist/signals-core.min.js',
          'https://cdn.jsdelivr.net/npm/@preact/signals@2.9.0/dist/signals.min.js',
        ],
      },
      build: {
        externalGlobals: {
          'preact': 'preact',
          'preact/hooks': 'preactHooks',
          'preact/jsx-runtime': 'jsxRuntime',
          '@preact/signals-core': 'preactSignalsCore',
          '@preact/signals': 'preactSignals',
        },
      },
    }),
  ],
});
