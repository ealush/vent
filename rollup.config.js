import { terser } from 'rollup-plugin-terser';
import compiler from "@ampproject/rollup-plugin-closure-compiler";

const build = ({ lang = "" } = {}) => ({
  input: "lib/vent.js",
  output: [
    {
      file: ["lib/vent.min", lang, "js"].filter(Boolean).join("."),
      format: "iife",
    },
  ],
  plugins: [
    compiler({
      compilation_level: "ADVANCED_OPTIMIZATIONS",
      ...(lang === "es5" && {
        rewrite_polyfills: true,
        language_out: "ECMASCRIPT5",
      }),
    }),
    terser(),
  ],
});

export default [build(), build({ lang: "es5" })];
