<script lang="ts">
    import { page } from "$app/stores"
    import { windows } from "$stores/windows"
    import Desktop from "$components/Desktop.svelte"
    import Taskbar from "$components/Taskbar.svelte"
    import type { User } from "@prisma/client"
    import { createOnboardingWindow } from "$stores/windows/onboarding"

    if ($page.data.session?.user && ($page.data.session.user as User).newUser) createOnboardingWindow()
</script>

<div id="container">
    <Desktop />
    <Taskbar />
    {#each $windows as win}
        <svelte:component this={win.component} bind:win />
    {/each}
</div>

