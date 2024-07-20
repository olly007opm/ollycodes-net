<script lang="ts">
    import { page } from "$app/stores"
    import WindowBase from "$components/WindowBase.svelte"
    import { ExplorerWindow } from "$windows/explorer"
    import { createNotepadWindow } from "$windows/notepad"
    import type { Folder, File } from "$windows/abstractExplorer"

    export let win: ExplorerWindow
    $: folder = win.folder as Folder

    let selectedFolders: string[] = []
    let selectedFiles: string[] = []

    function clearSelection() {
        selectedFolders = []
        selectedFiles = []
    }

    function selectAll() {
        selectedFolders = folder.children.map(item => item.id)
        selectedFiles = folder.files.map(item => item.id)
    }

    function invertSelection() {
        selectedFolders = folder.children.map(item => item.id).filter(id => !selectedFolders.includes(id))
        selectedFiles = folder.files.map(item => item.id).filter(id => !selectedFiles.includes(id))
    }

    function handleClick(event: MouseEvent, id: string, folder: boolean) {
        if (event.shiftKey) {
            if (folder) {
                if (selectedFolders.includes(id)) selectedFolders.splice(selectedFolders.indexOf(id), 1)
                else selectedFolders.push(id)
            } else {
                if (selectedFiles.includes(id)) selectedFiles.splice(selectedFiles.indexOf(id), 1)
                else selectedFiles.push(id)
            }
        } else {
            clearSelection()
            folder ? selectedFolders.push(id) : selectedFiles.push(id)
        }
    }

    function handleFileOpen(file: File) {
        if (file.type.application === "notepad") createNotepadWindow(file.id)
    }

    function handleBackgroundClick(event: MouseEvent) {
        if ((event.target as HTMLElement).classList.contains("explorer-content")) clearSelection()
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<WindowBase bind:win>
    <div class="explorer-window">
        <div class="file-select-toolbar">
            <span>Look In:</span>
            <form on:submit|preventDefault={() => win.navigateAddress()}>
                <input class="form-control" bind:value={win.newAddress}>
                <button class="btn" type="submit">Go</button>
            </form>
            <button class="btn w-24" on:click={() => win.folder?.parentId ? win.navigate(win.folder.parentId) : {}}>
                <img src="/custom-icon/folder-up-color.png" alt="up">
            </button>
        </div>
        <div class="explorer-content" on:click={handleBackgroundClick}>
            {#if folder}
                {#each folder.children as item}
                    <button
                        class="explorer-icon" class:explorer-icon-selected={selectedFolders.includes(item.id)}
                        on:click={e => handleClick(e, item.id, true)} on:dblclick={() => win.navigate(item.id)}
                    >
                        <img src={item.icon || "/icon/directory_open_cool-4.png"} alt={item.name}>
                        <span>{item.name}</span>
                        {#if !item.public && item.ownerId !== $page.data.session?.user?.id}
                            <img class="folder-lock" src="/custom-icon/lock.png" alt="lock icon">
                        {/if}
                    </button>
                {/each}
                {#each folder.files as item}
                    <button
                        class="explorer-icon" class:explorer-icon-selected={selectedFiles.includes(item.id)}
                        on:click={e => handleClick(e, item.id, false)} on:dblclick={() => handleFileOpen(item)}
                    >
                        <img src={item.type.icon || "/icon/file_lines-1.png"} alt={item.name}>
                        <span>{item.name}.{item.type.extension}</span>
                    </button>
                {/each}
            {/if}
        </div>
        <div class="file-select-footer">
            <span>File name:</span>
            <input class="form-control">
            <button class="btn">Open</button>
            <span>Files of type:</span>
            <input class="form-control">
            <button class="btn">Cancel</button>
        </div>
    </div>
</WindowBase>