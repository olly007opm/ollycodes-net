<script lang="ts">
    import { page } from "$app/stores"
    import { onMount } from "svelte"
    import { windows } from "$stores/windows"
    import Desktop from "$components/Desktop.svelte"
    import Taskbar from "$components/Taskbar.svelte"
    import type { User } from "@prisma/client"
    import { createOnboardingWindow } from "$windows/onboarding"
    import { createNotepadWindow } from "$windows/notepad"

    if ($page.data.session?.user && ($page.data.session.user as User).newUser) createOnboardingWindow()
    onMount(() => { if (!$page.data.session) createNotepadWindow("welcome") })
</script>

<div id="container">
    <Desktop />
    <Taskbar />
    {#each $windows as win}
        <svelte:component this={win.component} bind:win />
    {/each}
</div>

