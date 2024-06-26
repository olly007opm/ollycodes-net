<script>
    import { signIn } from "@auth/sveltekit/client"
    import Taskbar from "$components/Taskbar.svelte"
</script>

<div id="container">
    <button on:click={() => signIn("github")}>Sign In with GitHub</button>
    <Taskbar />
</div>

