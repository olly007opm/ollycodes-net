import adapter from '@sveltejs/adapter-auto'
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
		}
	}
}

export default config
