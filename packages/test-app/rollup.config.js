import inItPlugin from 'rollup-plugin-in-it-stats';

const InIt = inItPlugin.default;

export default {
  input: './build/src/index.js',
  output: {
    format: 'es',
    dir: 'dist',
  },
  plugins: [
    new InIt({
      appId: 'test-app',
      serverUrl: null,
    }),
  ],
};
