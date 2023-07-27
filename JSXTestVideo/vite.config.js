// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import { babel } from "@rollup/plugin-babel";

export default defineConfig({
    plugins: [
        react(),
        // babel({
        //     babelHelpers: "runtime",
        //     extensions: [".js", ".jsx", ".es6", ".es", ".mjs", "ts"],
        // }),
    ],
    // esbuild: {

    //     jsxFactory: "React.createElement",
    //     jsxFragment: "React.Fragment",
    // },
    // optimizeDeps: {
    //     include: ["./Components/**/*.jsx"],
    // },
    build: {
        minify: false,

        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: "./components/TestComponent.jsx",
            name: "jsxvideotest",
            fileName: "components.bundle.min",
            formats: ['es', 'umd'],
        },

        rollupOptions: {
            // into your library
            // external: ["react", "react-dom"],
            output: {
                format: "iife",
                // globals: {
                //     react: "react",
                //     "react-dom": "ReactDOM",
                // },
            },
        },
    },
    // resolve: {
    //     dedupe: ["react", "react-dom"],
    // }
});
