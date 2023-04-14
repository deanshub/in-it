import inItPlugin from 'rollup-plugin-in-it';

const InIt = inItPlugin.default

export default  {
  input: './build/index.js',
  output: {
      format: 'es',
      dir: 'dist',
  },
  plugins: [new InIt()]
};