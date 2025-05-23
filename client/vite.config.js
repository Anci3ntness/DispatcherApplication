import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import checker from "vite-plugin-checker";

export default defineConfig({
    plugins: [
        react(),
        checker({
            eslint: { useFlatConfig: true, lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"' },
        }),
    ],
    server: {
        port: 3000,
    },
});
