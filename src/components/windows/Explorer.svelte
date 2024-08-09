<script lang="ts">
    import WindowBase from "$components/WindowBase.svelte"
    import { ExplorerWindow } from "$windows/explorer"
    import { createNotepadWindow } from "$windows/notepad"
    import { closeWindow } from "$stores/windows"
    import ToolbarDropdown from "$components/ToolbarDropdown.svelte"
    import type { Folder, File } from "$windows/abstractExplorer"
    import ExplorerContent from "$components/ExplorerContent.svelte"
    import { page } from "$app/stores"
    import type { User } from "@prisma/client"

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

    function deleteSelected() {
        if (!canEdit) return
        win.deleteItems(selectedFiles, selectedFolders)
        clearSelection()
    }

    function renameSelected() {
        if (!canEdit || selectedFiles.length + selectedFolders.length !== 1) return
        win.renaming = selectedFiles.length === 1 ? selectedFiles[0] : selectedFolders[0]
    }

    function createFolder() {
        if (!folderOwner) return
        let newFolderNames = folder.children
            .map(item => item.name)
            .filter(name => name.match(/^New Folder \d+$/))
            .sort((a, b) => parseInt(b.replace("New Folder ", "")) - parseInt(a.replace("New Folder ", "")))
        if (newFolderNames.length) {
            let newFolderNumber = parseInt(newFolderNames[0]?.replace("New Folder ", "")) + 1
            win.createFolder(`New Folder ${newFolderNumber}`)
        } else {
            win.createFolder("New Folder")
        }
    }

    $: folderOwner = $page.data.session?.user
        && (win.folder?.ownerId === $page.data.session.user.id || ($page.data.session.user as User).admin)
    $: canEdit = (selectedFiles.length > 0 || selectedFolders.length > 0) && folderOwner
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<WindowBase bind:win>
    <div class="explorer-window">
        <div class="explorer-toolbar">
            <div class="explorer-toolbar-handles">
                <ToolbarDropdown label="File">
                    <button disabled>Open</button>
                    <ToolbarDropdown child label="New...">
                        <button on:click={() => createNotepadWindow()}>Text File</button>
                        <button on:click={createFolder} disabled={!folderOwner}>Folder</button>
                    </ToolbarDropdown>
                    <button
                        disabled={!canEdit || selectedFiles.length + selectedFolders.length !== 1}
                        on:click={renameSelected}
                    >
                        Rename
                    </button>
                    <div class="separator"></div>
                    <button on:click={() => closeWindow(win)}>Close</button>
                </ToolbarDropdown>
                <ToolbarDropdown label="Edit">
                    <button disabled>Undo</button>
                    <div class="separator"></div>
                    <button disabled>Cut</button>
                    <button disabled>Copy</button>
                    <button disabled>Paste</button>
                    <button disabled>Paste Shortcut</button>
                    <div class="separator"></div>
                    <button on:click={selectAll}>Select All</button>
                    <button on:click={invertSelection}>Invert Selection</button>
                </ToolbarDropdown>
                <ToolbarDropdown label="View">
                    <button on:click={() => win.fetchFolder(true)}>Refresh</button>
                </ToolbarDropdown>
                <ToolbarDropdown label="Go">
                    <button disabled={win.pastFolderIds.length === 0} on:click={() => win.navigateBack()}>
                        Back
                    </button>
                    <button disabled={win.futureFolderIds.length === 0} on:click={() => win.navigateForward()}>
                        Forward
                    </button>
                    <button
                        disabled={!win.folder?.parentId}
                        on:click={() => win.folder?.parentId ? win.navigate(win.folder.parentId) : {}}
                    >
                        Up One Level
                    </button>
                    <div class="separator"></div>
                    <button disabled>My Computer</button>
                    <button disabled>My Documents</button>
                </ToolbarDropdown>
                <ToolbarDropdown label="Favourites">
                    <button disabled>No Favourites</button>
                </ToolbarDropdown>
                <ToolbarDropdown label="Help">
                    <button disabled>About Explorer</button>
                </ToolbarDropdown>
            </div>
            <div class="separator"></div>
            <div class="explorer-buttons">
                <div class="btn-group btn-group-ghost">
                    <button
                        class="btn btn-ghost" on:click={() => win.navigateBack()}
                        disabled={win.pastFolderIds.length === 0}
                    >
                        <img src="/custom-icon/explorer/back.png" alt="back" class="btn-icon">
                        <img src="/custom-icon/explorer/back-active.png" alt="delete" class="btn-icon-active">
                        <span>Back</span>
                    </button>
                    <button class="btn btn-ghost btn-dropdown" disabled={win.pastFolderIds.length === 0}>
                        <img src="/custom-icon/dropdown.png" alt="dropdown" class="btn-icon">
                    </button>
                </div>
                <div class="btn-group btn-group-ghost">
                    <button
                        class="btn btn-ghost" on:click={() => win.navigateForward()}
                        disabled={win.futureFolderIds.length === 0}
                    >
                        <img src="/custom-icon/explorer/forward.png" alt="forward" class="btn-icon">
                        <img src="/custom-icon/explorer/forward-active.png" alt="delete" class="btn-icon-active">
                        <span>Forward</span>
                    </button>
                    <button class="btn btn-ghost btn-dropdown" disabled={win.futureFolderIds.length === 0}>
                        <img src="/custom-icon/dropdown.png" alt="dropdown" class="btn-icon">
                    </button>
                </div>
                <div class="btn-group btn-group-ghost">
                    <button
                        class="btn btn-ghost"
                        on:click={() => win.folder?.parentId ? win.navigate(win.folder.parentId) : {}}
                        disabled={!win.folder?.parentId}
                    >
                        <img src="/custom-icon/explorer/up.png" alt="up" class="btn-icon">
                        <img src="/custom-icon/explorer/up-active.png" alt="delete" class="btn-icon-active">
                        <span>Up</span>
                    </button>
                    <button class="btn btn-ghost btn-dropdown" disabled>
                        <img src="/custom-icon/dropdown.png" alt="dropdown" class="btn-icon">
                    </button>
                </div>
                <div class="separator"></div>
                <button class="btn btn-ghost" disabled>
                    <img src="/custom-icon/explorer/cut.png" alt="cut" class="btn-icon">
                    <img src="/custom-icon/explorer/cut-active.png" alt="delete" class="btn-icon-active">
                    <span>Cut</span>
                </button>
                <button class="btn btn-ghost" disabled>
                    <img src="/custom-icon/explorer/copy.png" alt="copy" class="btn-icon">
                    <img src="/custom-icon/explorer/copy-active.png" alt="delete" class="btn-icon-active">
                    <span>Copy</span>
                </button>
                <button class="btn btn-ghost" disabled>
                    <img src="/custom-icon/explorer/paste.png" alt="paste" class="btn-icon">
                    <img src="/custom-icon/explorer/paste-active.png" alt="delete" class="btn-icon-active">
                    <span>Paste</span>
                </button>
                <div class="separator"></div>
                <button class="btn btn-ghost" on:click={deleteSelected} disabled={!canEdit}>
                    <img src="/custom-icon/explorer/delete.png" alt="delete" class="btn-icon">
                    <img src="/custom-icon/explorer/delete-active.png" alt="delete" class="btn-icon-active">
                    <span>Delete</span>
                </button>
            </div>
            <div class="separator"></div>
            <div class="explorer-address">
                <span>Address</span>
                <form on:submit|preventDefault={() => { win.navigateAddress(); clearSelection() }}>
                    <input class="form-control" bind:value={win.newAddress}>
                    <button class="btn" type="submit">Go</button>
                </form>
            </div>
        </div>
        <ExplorerContent bind:win {handleClick} {handleFileOpen} bind:selectedFolders bind:selectedFiles />
        <div class="explorer-footer">
            <div></div>
            <div>
                <img src={win.icon} alt="computer">
                <span>{folder.displayName || folder.name}</span>
            </div>
        </div>
    </div>
</WindowBase>