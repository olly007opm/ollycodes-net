<script lang="ts">
    import { onMount } from "svelte"
    import WindowBase from "$components/WindowBase.svelte"
    import type { BrowserWindow } from "$windows/browser"
    import { closeWindow } from "$stores/windows"
    import ToolbarDropdown from "$components/ToolbarDropdown.svelte"

    export let win: BrowserWindow

    onMount(() => win.ready = true)
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<WindowBase bind:win>
    <div class="browser-window">
        <div class="browser-toolbar">
            <div class="browser-toolbar-handles">
                <ToolbarDropdown label="File">
                    <button disabled>New Window</button>
                    <button disabled>Open</button>
                    <div class="separator"></div>
                    <button on:click={() => closeWindow(win)}>Close</button>
                </ToolbarDropdown>
                <ToolbarDropdown label="Edit">
                    <button disabled>Undo</button>
                    <div class="separator"></div>
                    <button disabled>Cut</button>
                    <button disabled>Copy</button>
                    <button disabled>Paste</button>
                </ToolbarDropdown>
                <ToolbarDropdown label="View">
                    <button disabled>Refresh</button>
                </ToolbarDropdown>
                <ToolbarDropdown label="Favorites"></ToolbarDropdown>
                <ToolbarDropdown label="Tools"></ToolbarDropdown>
                <ToolbarDropdown label="Help">
                    <button disabled>About Internet Explorer</button>
                </ToolbarDropdown>
            </div>
            <div class="separator"></div>
            <div class="browser-buttons">
                <div class="btn-group btn-group-ghost">
                    <button class="btn btn-ghost" disabled>
                        <img src="/custom-icon/back.png" alt="back">
                        <span>Back</span>
                    </button>
                    <button class="btn btn-ghost btn-dropdown" disabled>
                        <img src="/custom-icon/dropdown.png" alt="dropdown" class="btn-icon">
                    </button>
                </div>
                <div class="btn-group btn-group-ghost">
                    <button class="btn btn-ghost" disabled>
                        <img src="/custom-icon/browser/forward.png" alt="forward" class="btn-icon">
                        <span>Forward</span>
                    </button>
                    <button class="btn btn-ghost btn-dropdown" disabled>
                        <img src="/custom-icon/browser/dropdown.png" alt="dropdown" class="btn-icon">
                    </button>
                </div>
                <button class="btn btn-ghost" disabled>
                    <img src="/custom-icon/browser/stop.png" alt="stop">
                    <span>Stop</span>
                </button>
                <button class="btn btn-ghost" disabled>
                    <img src="/custom-icon/browser/refresh.png" alt="refresh">
                    <span>Refresh</span>
                </button>
                <button class="btn btn-ghost" disabled>
                    <img src="/custom-icon/browser/home.png" alt="home">
                    <span>Home</span>
                </button>
                <div class="separator"></div>
                <button class="btn btn-ghost" disabled>
                    <img src="/custom-icon/browser/search.png" alt="search">
                    <span>Search</span>
                </button>
                <button class="btn btn-ghost" disabled>
                    <img src="/custom-icon/browser/favorites.png" alt="favorites">
                    <span>Favorites</span>
                </button>
                <button class="btn btn-ghost" disabled>
                    <img src="/custom-icon/browser/history.png" alt="history">
                    <span>History</span>
                </button>
            </div>
            <div class="separator"></div>
            <div class="browser-address">
                <span>Address</span>
                <form on:submit|preventDefault={() => win.navigate()}>
                    <input class="form-control" bind:value={win.newUrl}>
                    <button class="btn" type="submit">Go</button>
                </form>
            </div>
        </div>
        <div class="browser-content">
            <iframe bind:this={win.iframe} src={win.url} title="Browser Content"></iframe>
        </div>
        <div class="browser-footer">
            <div></div>
            <div>
                <img src={win.icon} alt="internet">
                <span>Internet</span>
            </div>
        </div>
    </div>
</WindowBase>