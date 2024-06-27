<script>
    import { windows } from "$stores/windows"
    import Desktop from "$components/Desktop.svelte"
    import Taskbar from "$components/Taskbar.svelte"
    import WindowBase from "$components/WindowBase.svelte"
</script>

<div id="container">
    <Desktop />
    <Taskbar />
    {#each $windows as win}
        <WindowBase bind:win />
    {/each}
</div>

