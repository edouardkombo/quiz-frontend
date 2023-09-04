import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            _: path.resolve(__dirname, "src"),
        },
    },   
    plugins: [
        vue(),
    ],	
    server: {
        hmr: {
            host: "quizz.xtipper.com/ws",
            port: 8181,
	    protocol: "wss",
        },
    },	
});
