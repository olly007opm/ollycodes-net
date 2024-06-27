<script lang="ts">
    import { clearWindowFocus } from "$stores/windows"

    let items = [
        {
            name: "My Computer",
            icon: "/icon/computer_explorer-3.png",
            action: () => console.log("Computer"),
            location: [0, 0]
        },
        {
            name: "My Documents",
            icon: "/icon/directory_open_file_mydocs-1.png",
            action: () => console.log("Documents"),
            location: [0, 1]
        },
        {
            name: "Recycle Bin",
            icon: "/icon/recycle_bin_empty-0.png",
            action: () => console.log("Recycle Bin"),
            location: [0, 2]
        }
    ]
    let selectedItem: number = -1

    function handleDragEnd(event: DragEvent, itemIndex: number) {
        let newLocation = [Math.floor(event.x / 112), Math.floor(event.y / 96)]
        if (items.filter(item => item.location.toString() === newLocation.toString()).length) return
        items[itemIndex].location = newLocation
    }

    function clickDesktop() {
        selectedItem = -1
        clearWindowFocus()
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<div id="desktop" on:click={clickDesktop} on:dragover|preventDefault>
    <div class="desktop-icons">
        {#each items as {name, icon, action, location}, i}
            <button
                class="desktop-icon" class:desktop-icon-selected={selectedItem === i}
                style="left: {location[0] * 112}px; top: {location[1] * 96}px;"
                on:click|stopPropagation={() => selectedItem = i} on:dblclick={action}
                on:dragend={event => handleDragEnd(event, i)} draggable="true"
            >
                <img src={icon} alt={name} draggable="false">
                <span>{name}</span>
            </button>
        {/each}
    </div>
</div>
