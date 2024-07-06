<script lang="ts">
    import { offset, flip, shift } from "svelte-floating-ui/dom"
    import { createFloatingActions } from "svelte-floating-ui"
    import { createExplorerWindow } from "$windows/explorer"
    import { createNotepadWindow } from "$windows/notepad"

    const [floatingRef, floatingContent] = createFloatingActions({
        strategy: "absolute",
        placement: "left-start",
        middleware: [offset(-8), flip(), shift()]
    })

    export let startMenuOpen: boolean
    let submenuOpen = false
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<div
    class="start-submenu" use:floatingRef
    on:mouseenter={() => submenuOpen = true} on:mouseleave={() => submenuOpen = false}
>
    <button class="start-submenu-button" class:active={submenuOpen}>
        <img src="/icon/directory_program_group-2.png" alt="programs">
        <span>Programs</span>
        <img src="/custom-icon/dropdown-side.png" class="dropdown-side" alt="dropdown">
    </button>
    {#if submenuOpen}
        <div class="start-submenu-content" use:floatingContent>
            <button on:click={() => { createExplorerWindow("root"); startMenuOpen = false }}>
                <img src="/icon/computer_explorer-2.png" alt="file explorer">
                <span>File Explorer</span>
            </button>
            <button on:click={() => { createNotepadWindow(); startMenuOpen = false }}>
                <img src="/icon/notepad-1.png" alt="notepad">
                <span>Notepad</span>
            </button>
            <button on:click={() => startMenuOpen = false} disabled>
                <img src="/icon/msie1-0.png" alt="internet explorer">
                <span>Internet Explorer</span>
            </button>
            <button on:click={() => startMenuOpen = false} disabled>
                <img src="/icon/network_cool_two_pcs-5.png" alt="internet messaging">
                <span>Internet Messaging</span>
            </button>
        </div>
    {/if}
</div>
