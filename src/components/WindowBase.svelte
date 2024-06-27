<script lang="ts">
    import { closeWindow, focusWindow, maximizeWindow, unMaximizeWindow, type Window } from "$stores/windows"

    export let win: Window
    let [offsetX, offsetY, newX, newY, newWidth, newHeight] = [0, 0, win.x, win.y, win.width, win.height]
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

    function onDragEnd() {
        win.x = newX
        win.y = newY
        dragging = false
    }

    function minimiseWindow() {
        win.minimized = true
        win.focused = false
    }

    function resizeStart(event: DragEvent) {
        focusWindow(win)
        offsetX = event.clientX - win.x
        offsetY = event.clientY - win.y
        dragging = true
    }

    function resizeR(event: DragEvent) {
        newWidth = Math.min(Math.max(event.clientX - win.x, win.minWidth), window.innerWidth - win.x)
    }

    function resizeB(event: DragEvent) {
        newHeight = Math.min(Math.max(event.clientY - win.y, win.minHeight), window.innerHeight - win.y - 48)
    }

    function resizeBR(event: DragEvent) {
        newWidth = Math.min(Math.max(event.clientX - win.x, win.minWidth), window.innerWidth - win.x)
        newHeight = Math.min(Math.max(event.clientY - win.y, win.minHeight), window.innerHeight - win.y - 48)
    }

    function resizeEndTL() {
        win.width = newWidth
        win.height = newHeight
        win.x = newX
        win.y = newY
        dragging = false
    }

    function resizeEndT() {
        win.height = newHeight
        win.y = newY
        dragging = false
    }

    function resizeEndTR() {
        win.width = newWidth
        win.height = newHeight
        win.y = newY
        dragging = false
    }

    function resizeEndL() {
        win.width = newWidth
        win.x = newX
        dragging = false
    }

    function resizeEndR() {
        win.width = newWidth
        dragging = false
    }

    function resizeEndBL() {
        win.width = newWidth
        win.height = newHeight
        win.x = newX
        dragging = false
    }

    function resizeEndB() {
        win.height = newHeight
        dragging = false
    }

    function resizeEndBR() {
        win.width = newWidth
        win.height = newHeight
        dragging = false
    }
</script>

{#if dragging && win.focused}
    <div class="window-drag-area"
        style="left: {newX}px; top: {newY}px; width: {newWidth}px; height: {newHeight}px"
    ></div>
{/if}

{#if !win.minimized}
    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
    <div class="window" class:hidden={win.minimized} class:window-focus={win.focused} on:click={() => focusWindow(win)}
        style="left: {win.x}px; top: {win.y}px; width: {win.width}px; height: {win.height}px" on:dragover|preventDefault
    >
        <div
            draggable="true" class="window-resize window-resize-tl"
            on:dragstart={resizeStart} on:dragend={resizeEndTL}
        ></div>
        <div
            draggable="true" class="window-resize window-resize-t"
            on:dragstart={resizeStart} on:dragend={resizeEndT}
        ></div>
        <div
            draggable="true" class="window-resize window-resize-tr"
            on:dragstart={resizeStart} on:dragend={resizeEndTR}
        ></div>
        <div
            draggable="true" class="window-resize window-resize-l"
            on:dragstart={resizeStart} on:dragend={resizeEndL}
        ></div>
        <div
            draggable="true" class="window-resize window-resize-r"
            on:dragstart={resizeStart} on:drag={resizeR} on:dragend={resizeEndR}
        ></div>
        <div
            draggable="true" class="window-resize window-resize-bl"
            on:dragstart={resizeStart} on:dragend={resizeEndBL}
        ></div>
        <div draggable="true" class="window-resize window-resize-b"
            on:dragstart={resizeStart} on:drag={resizeB} on:dragend={resizeEndB}
        ></div>
        <div
            draggable="true" class="window-resize window-resize-br"
            on:dragstart={resizeStart} on:drag={resizeBR} on:dragend={resizeEndBR}
        ></div>

        <div class="window-title-bar" draggable="true" role="dialog"
            on:dragstart={onDragStart} on:drag={onDrag} on:dragend={onDragEnd}
        >
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

