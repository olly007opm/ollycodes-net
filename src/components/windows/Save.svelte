<script lang="ts">
    import WindowBase from "$components/WindowBase.svelte"
    import type { SaveWindow } from "$windows/save"
    import { closeWindow } from "$stores/windows"
    import ExplorerContent from "$components/ExplorerContent.svelte"
    import Select from "$components/Select.svelte"
    import { page } from "$app/stores"
    import type { User } from "@prisma/client"

    export let win: SaveWindow

    let selectedFolders: string[] = []
    let selectedFiles: string[] = []

    function handleClick(event: MouseEvent, id: string, folder: boolean) {
        selectedFolders = []
        selectedFiles = []
        folder ? selectedFolders.push(id) : selectedFiles.push(id)
    }

    function saveButton() {
        if (!win.callback || !win.fileName || !win.typeId) return
        win.callback(win.folderId, win.fileName, win.typeId)
        closeWindow(win)
    }

    $: dropdownOptions = win.fileTypes ? win.fileTypes.map(type => ({ value: type.id, label: type.name })) : []
    $: canSave = win.fileName && win.typeId && $page.data.session?.user
        && (win.folder?.ownerId === $page.data.session.user.id || ($page.data.session.user as User).admin)
</script>

<WindowBase bind:win>
    <div class="explorer-window">
        <div class="file-select-toolbar">
            <span>Look In:</span>
            <form on:submit|preventDefault={() => win.navigateAddress()}>
                <input class="form-control" bind:value={win.newAddress}>
                <button class="btn" type="submit">Go</button>
            </form>
            <button class="btn w-24" on:click={() => win.folder?.parentId ? win.navigate(win.folder.parentId) : {}}>
                <img src="/custom-icon/explorer/up-active.png" alt="up">
            </button>
        </div>
        <ExplorerContent bind:win {handleClick} handleFileOpen={() => {}} bind:selectedFolders bind:selectedFiles />
        <div class="file-select-footer">
            <span>File name:</span>
            <input class="form-control" bind:value={win.fileName}>
            <button class="btn" on:click={saveButton} disabled={!canSave}>Save</button>
            <span>Extension:</span>
            <Select placeholder="Select an extension" bind:options={dropdownOptions} bind:value={win.typeId} />
            <button class="btn" on:click={() => closeWindow(win)}>Cancel</button>
        </div>
    </div>
</WindowBase>