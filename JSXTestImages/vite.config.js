// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    esbuild: {
        jsxFactory: "React.createElement",
        jsxFragment: "React.Fragment",
    },

    build: {
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: "./components/TestComponent.jsx",
            name: "jsxvideotest",
            fileName: "components.bundle.min",
        },
        rollupOptions: {
            external: ["react"],
            output: {
                globals: {
                    react: "React",
                },
            },
        },
    },
});
