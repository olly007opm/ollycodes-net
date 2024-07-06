<script lang="ts">
    import { page } from "$app/stores"
    import { offset, flip, shift } from "svelte-floating-ui/dom"
    import { createFloatingActions } from "svelte-floating-ui"
    import { createExplorerWindow } from "$stores/windows/explorer"

    const [floatingRef, floatingContent] = createFloatingActions({
        strategy: "absolute",
        placement: "left-start",
        middleware: [offset(-8), flip(), shift()]
    })

    export let startMenuOpen: boolean
    let submenuOpen = false
    $: user = $page.data.session?.user
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<div
    class="start-submenu" use:floatingRef
    on:mouseenter={() => submenuOpen = true} on:mouseleave={() => submenuOpen = false}
>
    <button class="start-submenu-button" class:active={submenuOpen}>
        <img src="/icon/directory_open_file_mydocs-1.png" alt="documents">
        <span>Documents</span>
        <img src="/custom-icon/dropdown-side.png" class="dropdown-side" alt="dropdown">
    </button>
    {#if submenuOpen}
        <div class="start-submenu-content" use:floatingContent>
            <button on:click={() => { createExplorerWindow("root"); startMenuOpen = false }}>
                <img src="/icon/computer_explorer-2.png" alt="my computer">
                <span>My Computer</span>
            </button>
            <button on:click={() => { createExplorerWindow("documents"); startMenuOpen = false }} disabled={!user}>
                <img src="/icon/directory_open_file_mydocs-1.png" alt="my documents">
                <span>My Documents</span>
            </button>
            <button on:click={() => { createExplorerWindow("bin"); startMenuOpen = false }} disabled={!user}>
                <img src="/icon/recycle_bin_empty-0.png" alt="recycle bin">
                <span>Recycle Bin</span>
            </button>
        </div>
    {/if}
</div>
