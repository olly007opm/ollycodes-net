<script lang="ts">
    import WindowBase from "$components/WindowBase.svelte"
    import type { Folder, File } from "$windows/abstractExplorer"
    import type { FileSelectWindow } from "$windows/fileSelect"
    import { closeWindow } from "$stores/windows"
    import ExplorerContent from "$components/ExplorerContent.svelte"

    export let win: FileSelectWindow
    $: folder = win.folder as Folder

    let selectedFolders: string[] = []
    let selectedFiles: string[] = []
    $: selectedFile = selectedFiles.length === 1 ? folder.files.find(f => f.id === selectedFiles[0]) : null
    $: fileName = selectedFile ? selectedFile.name + "." + selectedFile.type.extension : ""

    function handleClick(event: MouseEvent, id: string, folder: boolean) {
        selectedFolders = []
        selectedFiles = []
        folder ? selectedFolders.push(id) : selectedFiles.push(id)
    }

    function handleFileOpen(file: File) {
        if (file.type.application === win.application && win.callback) {
            win.callback(file)
            closeWindow(win)
        }
    }

    const openButton = () => selectedFile && handleFileOpen(selectedFile as File)
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
        <ExplorerContent bind:win {handleClick} {handleFileOpen} bind:selectedFolders bind:selectedFiles />
        <div class="file-select-footer">
            <span>File name:</span>
            <input class="form-control" bind:value={fileName} readonly>
            <button class="btn" on:click={openButton}>Open</button>
            <span>Files of type:</span>
            <input class="form-control" value={win.extensions} readonly>
            <button class="btn" on:click={() => closeWindow(win)}>Cancel</button>
        </div>
    </div>
</WindowBase>