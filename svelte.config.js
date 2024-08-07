import adapter from '@sveltejs/adapter-vercel'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			$css: "./src/css",
			$components: "./src/components",
			$stores: "./src/stores",
			$windows: "./src/windows",
		}
	}
}

export default config
