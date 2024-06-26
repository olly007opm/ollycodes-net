<script>
import { signIn } from "@auth/sveltekit/client"
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<button on:click={() => signIn("github")}>Sign In with GitHub</button>