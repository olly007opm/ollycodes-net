<script lang="ts">
    import WindowBase from "$components/WindowBase.svelte"
    import type { Window } from "$stores/windows"

    export let win: Window
</script>

<WindowBase bind:win>
    <div class="explorer-toolbar">
        <div class="explorer-toolbar-handles">
            <button class="btn btn-ghost">File</button>
            <button class="btn btn-ghost">Edit</button>
            <button class="btn btn-ghost">View</button>
            <button class="btn btn-ghost">Go</button>
            <button class="btn btn-ghost">Favourites</button>
            <button class="btn btn-ghost">Help</button>
        </div>
        <div class="separator"></div>
        <div class="explorer-buttons">
            <div class="btn-group btn-group-ghost">
                <button class="btn btn-ghost">
                    <img src="/custom-icon/back.png" alt="back">
                    <span>Back</span>
                </button>
                <button class="btn btn-ghost btn-dropdown">
                    <img src="/custom-icon/dropdown.png" alt="dropdown">
                </button>
            </div>
            <div class="btn-group btn-group-ghost">
                <button class="btn btn-ghost">
                    <img src="/custom-icon/forward.png" alt="forward">
                    <span>Forward</span>
                </button>
                <button class="btn btn-ghost btn-dropdown">
                    <img src="/custom-icon/dropdown.png" alt="dropdown">
                </button>
            </div>
            <div class="btn-group btn-group-ghost">
                <button class="btn btn-ghost">
                    <img src="/custom-icon/folder-up.png" alt="up">
                    <span>Up</span>
                </button>
                <button class="btn btn-ghost btn-dropdown">
                    <img src="/custom-icon/dropdown.png" alt="dropdown">
                </button>
            </div>
        </div>
        <div class="separator"></div>
        <div>
            <span>C:</span>
        </div>
    </div>
    Explorer Window Content
</WindowBase>