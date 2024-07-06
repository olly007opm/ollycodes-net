<script lang="ts">
    import { page } from "$app/stores"
    import WindowBase from "$components/WindowBase.svelte"
    import { ExplorerWindow, type Folder } from "$windows/explorer"

    export let win: ExplorerWindow
    $: folder = win.folder as Folder
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
        <div class="explorer-content">
            {#if folder}
                {#each folder.children as item}
                    <button class="explorer-icon" on:dblclick={() => win.navigate(item.id)}>
                        <img src={item.icon || "/icon/directory_open_cool-4.png"} alt={item.name}>
                        <span>{item.name}</span>
                        {#if !item.public && item.ownerId !== $page.data.session?.user?.id}
                            <img class="folder-lock" src="/custom-icon/lock.png" alt="lock icon">
                        {/if}
                    </button>
                {/each}
                {#each folder.files as item}
                    <button class="explorer-icon">
                        <img src={item.type.icon || "/icon/directory_open_cool-4.png"} alt={item.name}>
                        <span>{item.name}</span>
                    </button>
                {/each}
            {/if}
        </div>
        <div class="explorer-footer">
            <div></div>
            <div>
                <img src={win.icon} alt="computer">
                <span>{folder.displayName || folder.name}</span>
            </div>
        </div>
    </div>
</WindowBase>