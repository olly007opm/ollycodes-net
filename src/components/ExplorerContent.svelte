<script lang="ts">
    import { page } from "$app/stores"
    import type { Folder } from "$windows/abstractExplorer.js"
    import type { FileSelectWindow } from "$windows/fileSelect"

    export let win: FileSelectWindow
    export let handleClick: Function
    export let handleFileOpen: Function
    export let selectedFolders: string[]
    export let selectedFiles: string[]

    $: folder = win.folder as Folder
    let renamingInput: HTMLInputElement

    function clearSelection() {
        selectedFolders = []
        selectedFiles = []
    }

    function handleBackgroundClick(event: MouseEvent) {
        if ((event.target as HTMLElement).classList.contains("explorer-content")) {
            clearSelection()
        }
    }

    function renameKeydown(e: KeyboardEvent) {
        if (e.key === "Enter") win.renaming = null
    }

    $: if (renamingInput) renamingInput.focus()
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<div class="explorer-content" on:click={handleBackgroundClick}>
    {#if folder}
        {#each folder.children as item}
            <button
                class="explorer-icon" class:explorer-icon-selected={selectedFolders.includes(item.id)}
                on:click={e => handleClick(e, item.id, true)}
                on:dblclick={() => { win.navigate(item.id); clearSelection() }}
            >
                <img src={item.icon || "/icon/directory_open_cool-4.png"} alt={item.name}>
                {#if win.renaming === item.id}
                    <input
                        bind:this={renamingInput} class="rename-input" bind:value={item.name} on:keydown={renameKeydown}
                        on:blur={() => { win.renameItem(true, item.id, item.name); win.renaming = null }} type="text"
                    />
                {:else}
                    <span>{item.name}</span>
                {/if}
                {#if !item.public && item.ownerId !== $page.data.session?.user?.id}
                    <img class="folder-lock" src="/custom-icon/explorer/lock.png" alt="lock icon">
                {/if}
            </button>
        {/each}
        {#each folder.files as item}
            <button
                class="explorer-icon" class:explorer-icon-selected={selectedFiles.includes(item.id)}
                on:click={e => handleClick(e, item.id, false)} on:dblclick={() => handleFileOpen(item)}
            >
                <img src={item.type.icon || "/icon/file_lines-1.png"} alt={item.name}>
                {#if win.renaming === item.id}
                    <input
                        bind:this={renamingInput} class="rename-input" bind:value={item.name} on:keydown={renameKeydown}
                        on:blur={() => { win.renameItem(false, item.id, item.name); win.renaming = null }} type="text"
                    />
                {:else}
                    <span>{item.name}.{item.type.extension}</span>
                {/if}
            </button>
        {/each}
    {/if}
</div>