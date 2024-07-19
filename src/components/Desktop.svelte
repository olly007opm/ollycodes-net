<script lang="ts">
    import { page } from "$app/stores"
    import { desktop, type DesktopItem } from "$stores/desktop"
    import { clearWindowFocus } from "$stores/windows"
    import { createExplorerWindow } from "$windows/explorer"
    import { createNotepadWindow } from "$windows/notepad"

    let selectedItem: number = -1
    $desktop = $page.data.desktop

    function handleDragEnd(event: DragEvent, itemIndex: number) {
        let [newX, newY] = [Math.floor(event.x / 112), Math.floor(event.y / 112)]
        if ($desktop.filter(item => item.x === newX && item.y === newY).length !== 0) return
        $desktop[itemIndex].x = newX
        $desktop[itemIndex].y = newY
        if ($page.data.session?.user) fetch("/api/desktop/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: $desktop[itemIndex].id, x: newX, y: newY })
        }).then(r => r.json()).then(resp => {
            console.log("Desktop Updated", resp)
        })
    }

    function clickDesktop() {
        selectedItem = -1
        clearWindowFocus()
    }

    function openUrl(url: string) {
        window.open(url, "_blank")
    }

    function action(item: DesktopItem) {
        let action = item.icon.action
        console.log("Desktop action:", action)
        if (action === "computer") createExplorerWindow("root")
        else if (action === "docs") createExplorerWindow("documents")
        else if (action === "bin") createExplorerWindow("bin")
        else if (action === "projects") createExplorerWindow("projects")
        else if (action === "github") openUrl("https://github.com/olly007opm/")
        else if (action === "email") openUrl("mailto:olly@ollycodes.net")
        else if (action === "changelog") createNotepadWindow("changelog")
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<div id="desktop" on:click={clickDesktop} on:dragover|preventDefault>
    <div class="desktop-icons">
        {#each $desktop as item, i}
            <button
                class="desktop-icon" class:desktop-icon-selected={selectedItem === i}
                style="left: {item.x * 112}px; top: {item.y * 112}px;"
                on:click|stopPropagation={() => selectedItem = i} on:dblclick={() => action(item)}
                on:dragend={event => handleDragEnd(event, i)} draggable="true"
            >
                <img src={item.icon.image} alt={item.icon.name} draggable="false">
                <span>{item.icon.name}</span>
            </button>
        {/each}
    </div>
    <div class="desktop-info">
        <h1>ollycodes.net</h1>
        <span>version 0.3-beta</span>
    </div>
</div>
