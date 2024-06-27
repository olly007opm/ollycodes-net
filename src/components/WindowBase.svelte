<script lang="ts">
    import { closeWindow, focusWindow, maximizeWindow, unMaximizeWindow, type Window } from "$stores/windows"

    export let win: Window
    let [offsetX, offsetY, newX, newY] = [0, 0, win.x, win.y]
    let dragging = false

    function onDragStart(event: DragEvent) {
        focusWindow(win)
        const dragImage = new Image()
        dragImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='
        event.dataTransfer?.setDragImage(dragImage, 0, 0)
        offsetX = event.clientX - win.x
        offsetY = event.clientY - win.y
        dragging = true
    }

    function onDrag(event: DragEvent) {
        if (event.clientX === 0 && event.clientY === 0) {
            win.x = newX
            win.y = newY
            dragging = false
            return
        }
        newX = Math.min(Math.max(event.clientX - offsetX, 0), window.innerWidth - win.width)
        newY = Math.min(Math.max(event.clientY - offsetY, 0), window.innerHeight - win.height - 48)
    }

    function minimiseWindow() {
        win.minimized = true
        win.focused = false
    }
</script>

{#if dragging && win.focused}
    <div class="window-drag-area"
        style="left: {newX}px; top: {newY}px; width: {win.width}px; height: {win.height}px"
    ></div>
{/if}

{#if !win.minimized}
    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
    <div class="window" class:hidden={win.minimized} class:window-focus={win.focused} on:click={() => focusWindow(win)}
        style="left: {win.x}px; top: {win.y}px; width: {win.width}px; height: {win.height}px"
    >
        <div class="window-title-bar" draggable="true" role="dialog" on:dragstart={onDragStart} on:drag={onDrag}>
            <div class="window-title">
                <img src={win.icon} alt={win.id}>
                <span>{win.title}</span>
            </div>
            <div class="window-controls">
                <button class="btn window-control window-control-minimise" on:click|stopPropagation={minimiseWindow}>
                    <img src="/custom-icon/window-min.png" alt="minimise">
                </button>
                {#if win.maximized}
                    <button class="btn window-control window-control-maximize" on:click={() => unMaximizeWindow(win)}>
                        <img src="/custom-icon/window-max.png" alt="maximize">
                    </button>
                {:else}
                    <button class="btn window-control window-control-maximize" on:click={() => maximizeWindow(win)}>
                        <img src="/custom-icon/window-max.png" alt="maximize">
                    </button>
                {/if}
                <button class="btn window-control window-control-close" on:click={() => closeWindow(win)}>
                    <img src="/custom-icon/window-close.png" alt="close">
                </button>
            </div>
        </div>
        Test Window Content
    </div>
{/if}

