/** @type {import('tailwindcss').Config} */
export default {
    content : ['./src/**/*.{html,js,svelte,ts}'],
    theme : {
        extend : {
            colors: {
                teal: "#008080",
                base: {
                    100: "var(--base-100)",
                    200: "var(--base-200)",
                    300: "var(--base-300)",
                    900: "var(--base-900)"
                }
            },
        }
    },
    plugins : []
}

