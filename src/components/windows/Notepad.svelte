<script lang="ts">
    import WindowBase from "$components/WindowBase.svelte"
    import { NotepadWindow } from "$windows/notepad"

    export let win: NotepadWindow
</script>

<WindowBase bind:win>
    <div class="notepad-window">
        <div class="notepad-toolbar">
            <button class="btn btn-ghost">File</button>
            <button class="btn btn-ghost">Edit</button>
            <button class="btn btn-ghost">Search</button>
            <button class="btn btn-ghost">Help</button>
        </div>
        <div class="notepad-content">
            <textarea class="form-control" bind:value={win.content} readonly={win.readOnly} />
        </div>
    </div>
</WindowBase>