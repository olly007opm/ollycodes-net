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
        if (!canDelete) return
        win.deleteItems(selectedFiles, selectedFolders)
        clearSelection()
    }

    $: canDelete = (selectedFiles.length > 0 || selectedFolders.length > 0) && $page.data.session?.user
        && (win.folder?.ownerId === $page.data.session.user.id || ($page.data.session.user as User).admin)
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<WindowBase bind:win>
    <div class="explorer-window">
        <div class="explorer-toolbar">
            <div class="explorer-toolbar-handles">
                <ToolbarDropdown label="File">
                    <button disabled>Open</button>
                    <button disabled>New...</button>
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
                    <button disabled>Refresh</button>
                </ToolbarDropdown>
                <ToolbarDropdown label="Go">
                    <button disabled>Back</button>
                    <button disabled>Forward</button>
                    <button on:click={() => win.folder?.parentId ? win.navigate(win.folder.parentId) : {}}>
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
                    <button class="btn btn-ghost" disabled>
                        <img src="/custom-icon/back.png" alt="back">
                        <span>Back</span>
                    </button>
                    <button class="btn btn-ghost btn-dropdown">
                        <img src="/custom-icon/dropdown.png" alt="dropdown">
                    </button>
                </div>
                <div class="btn-group btn-group-ghost">
                    <button class="btn btn-ghost" disabled>
                        <img src="/custom-icon/forward.png" alt="forward">
                        <span>Forward</span>
                    </button>
                    <button class="btn btn-ghost btn-dropdown">
                        <img src="/custom-icon/dropdown.png" alt="dropdown">
                    </button>
                </div>
                <div class="btn-group btn-group-ghost">
                    <button
                        class="btn btn-ghost"
                        on:click={() => win.folder?.parentId ? win.navigate(win.folder.parentId) : {}}
                    >
                        <img src="/custom-icon/folder-up.png" alt="up">
                        <span>Up</span>
                    </button>
                    <button class="btn btn-ghost btn-dropdown">
                        <img src="/custom-icon/dropdown.png" alt="dropdown">
                    </button>
                </div>
                <div class="separator"></div>
                <button class="btn btn-ghost" disabled>
                    <img src="/custom-icon/explorer-cut.png" alt="cut">
                    <span>Cut</span>
                </button>
                <button class="btn btn-ghost" disabled>
                    <img src="/custom-icon/explorer-copy.png" alt="copy">
                    <span>Copy</span>
                </button>
                <button class="btn btn-ghost" disabled>
                    <img src="/custom-icon/explorer-paste.png" alt="paste">
                    <span>Paste</span>
                </button>
                <div class="separator"></div>
                <button class="btn btn-ghost" on:click={deleteSelected} disabled={!canDelete}>
                    <img src="/custom-icon/explorer-delete.png" alt="delete">
                    <span>Delete</span>
                </button>
            </div>
            <div class="separator"></div>
            <div class="explorer-address">
                <span>Address</span>
                <form on:submit|preventDefault={() => win.navigateAddress()}>
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