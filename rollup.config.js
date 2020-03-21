import compiler from '@ampproject/rollup-plugin-closure-compiler';

export default {
    input: 'lib/vent.js',
    output: [{
      file: 'lib/vent.min.js',
      format: 'iife',
    }, {
      file: 'lib/vent.min.es5.js',
      format: 'iife',
    }, ],
    plugins: [
      compiler({
        compilation_level: 'ADVANCED_OPTIMIZATIONS'
      }),
    ],
  }