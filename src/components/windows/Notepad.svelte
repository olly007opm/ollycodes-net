<script lang="ts">
    import WindowBase from "$components/WindowBase.svelte"
    import { createNotepadWindow, NotepadWindow } from "$windows/notepad"
    import ToolbarDropdown from "$components/ToolbarDropdown.svelte"
    import { closeWindow } from "$stores/windows"

    export let win: NotepadWindow

    function paste() {
        navigator.clipboard.readText().then(text => {
            document.execCommand("insertText", false, text)
        })
    }
</script>

<WindowBase bind:win>
    <div class="notepad-window">
        <div class="notepad-toolbar">
            <ToolbarDropdown label="File">
                <button on:click|stopPropagation={() => createNotepadWindow()}>New</button>
                <button disabled>Open...</button>
                <button on:click={() => win.save()} disabled={win.readOnly}>Save</button>
                <button disabled>Save As...</button>
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
            <ToolbarDropdown label="Help">
                <button disabled>About Notepad</button>
            </ToolbarDropdown>
        </div>
        <div class="notepad-content">
            <textarea
                class="form-control" readonly={win.readOnly}
                bind:value={win.content} on:input={() => win.modify()}
            />
        </div>
    </div>
</WindowBase>