<script lang="ts">
    import { page } from "$app/stores"
    import WindowBase from "$components/WindowBase.svelte"
    import { createNotepadWindow, NotepadWindow } from "$windows/notepad"
    import ToolbarDropdown from "$components/ToolbarDropdown.svelte"
    import { closeWindow } from "$stores/windows"
    import SvelteMarkdown from "svelte-markdown"
    import { createFileSelectWindow } from "$windows/fileSelect"
    import type { File } from "$windows/abstractExplorer"
    import { createSaveWindow } from "$windows/save"

    export let win: NotepadWindow

    function paste() {
        navigator.clipboard.readText().then(text => {
            document.execCommand("insertText", false, text)
        })
    }

    const openFile = () => createFileSelectWindow((file: File) => createNotepadWindow(file.id), "notepad")

    function saveAs() {
        const callback = (folderId: string, name: string, typeId: string) => win.saveAs(folderId, name, typeId)
        createSaveWindow(callback, "notepad", "documents")
    }

    let previewMode = false
</script>

<WindowBase bind:win>
    <div class="notepad-window">
        <div class="notepad-toolbar">
            <ToolbarDropdown label="File">
                <button on:click|stopPropagation={() => createNotepadWindow()}>New</button>
                <button on:click={openFile}>Open...</button>
                <button on:click={() => win.save()} disabled={win.readOnly}>Save</button>
                <button on:click={saveAs} disabled={!$page.data.session?.user}>Save As...</button>
                <div class="separator"></div>
                <button on:click={() => closeWindow(win)}>Exit</button>
            </ToolbarDropdown>
            <ToolbarDropdown label="Edit">
                <button on:click={() => document.execCommand("undo", false)}>Undo</button>
                <div class="separator"></div>
                <button on:click={() => document.execCommand("cut", false)} disabled={win.readOnly}>Cut</button>
                <button on:click={() => document.execCommand("copy", false)}>Copy</button>
                <button on:click={paste} disabled={win.readOnly}>Paste</button>
                <button on:click={() => document.execCommand("delete", false)} disabled={win.readOnly}>Delete</button>
                <div class="separator"></div>
                <button on:click={() => document.execCommand("selectAll", false)}>Select All</button>
            </ToolbarDropdown>
            {#if win.fileType === "markdown" && !win.readOnly}
                <button class="btn btn-ghost" on:click={() => previewMode = !previewMode}>
                    {previewMode ? "Edit Mode" : "Preview Mode"}
                </button>
            {/if}
            <ToolbarDropdown label="Help">
                <button disabled>About Notepad</button>
            </ToolbarDropdown>
        </div>
        <div class="notepad-content">
            {#if win.fileType === "markdown"}
                {#if win.readOnly || previewMode}
                    <div class="notepad-markdown">
                        <SvelteMarkdown source={win.content} />
                    </div>
                {:else}
                    <textarea class="form-control" bind:value={win.content} on:input={() => win.modify()} />
                {/if}
            {:else}
                <textarea
                    class="form-control" readonly={win.readOnly}
                    bind:value={win.content} on:input={() => win.modify()}
                />
            {/if}
        </div>
    </div>
</WindowBase>