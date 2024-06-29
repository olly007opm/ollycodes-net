<script lang="ts">
    import WindowBase from "$components/WindowBase.svelte"
    import { ExplorerWindow } from "$stores/windows/explorer"

    export let win: ExplorerWindow

    let newAddress = win.address
</script>

<WindowBase bind:win>
    <div class="explorer-window">
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
            <div class="explorer-address">
                <span>Address</span>
                <input class="form-control" bind:value={newAddress}>
            </div>
        </div>
        <div class="explorer-content">
            {#if win.folder}
                {#each win.folder.children as item}
                    <button class="explorer-icon">
                        <img src={item.icon || "/icon/directory_open_cool-4.png"} alt={item.name}>
                        <span>{item.name}</span>
                    </button>
                {/each}
                {#each win.folder.files as item}
                    <button class="explorer-icon">
                        <img src={item.icon || "/icon/directory_open_cool-4.png"} alt={item.name}>
                        <span>{item.name}</span>
                    </button>
                {/each}
            {/if}
        </div>
        <div class="explorer-footer">
            <div></div>
            <div>
                <img src={win.icon} alt="computer">
                <span>My Computer</span>
            </div>
        </div>
    </div>
</WindowBase>