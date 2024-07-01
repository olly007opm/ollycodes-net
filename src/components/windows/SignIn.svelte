<script lang="ts">
    import { onMount } from "svelte"
    import WindowBase from "$components/WindowBase.svelte"
    import { signIn } from "@auth/sveltekit/client"
    import { closeWindow, type Window } from "$stores/windows"

    export let win: Window

    onMount(() => win.ready = true)
</script>

<WindowBase bind:win>
    <div class="wizard-window">
        <div class="wizard-banner bg-teal">
            <img src="/banner/onboarding.png" alt="key" class="h-full p-16">
        </div>
        <div class="wizard-content gap-4">
            <span>Choose a provider to sign in with.</span>
            <button class="btn btn-auth" on:click={() => signIn("auth0")}>
                <img src="/custom-icon/github.png" alt="auth0 logo">
                <span>Sign in with Auth0</span>
            </button>
            <button class="btn btn-auth" on:click={() => signIn("github")}>
                <img src="/custom-icon/github.png" alt="github logo">
                <span>Sign in with GitHub</span>
            </button>
        </div>
        <div class="wizard-footer">
            <button class="btn" on:click={() => closeWindow(win)}>Close</button>
        </div>
    </div>
</WindowBase>