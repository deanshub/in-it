import inItPlugin from 'rollup-plugin-in-it-stats';

const InIt = inItPlugin.default; // TODO: fix this

export default {
  input: './build/src/index.js',
  output: {
    format: 'es',
    dir: 'dist',
  },
  plugins: [
    new InIt({
      name: 'test-app',
      // serverUrl: 'http://localhost:3001/api/stats',
    }),
  ],
};
