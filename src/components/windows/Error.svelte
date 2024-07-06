<script lang="ts">
    import WindowBase from "$components/WindowBase.svelte"
    import { ErrorWindow } from "$windows/error"
    import { onMount } from "svelte"
    import { closeWindow } from "$stores/windows"

    export let win: ErrorWindow
    onMount(() => win.ready = true)
</script>

<WindowBase bind:win>
    <div class="error-window">
        <div class="error-content">
            <img src={win.icon} alt={win.id}>
            <h1>{win.errorTitle}</h1>
            <span>{win.errorMessage}</span>
        </div>
        <div class="error-footer">
            <button class="btn" on:click={() => closeWindow(win)}>Close</button>
        </div>
    </div>
</WindowBase>