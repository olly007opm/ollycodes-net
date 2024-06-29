<script lang="ts">
    import { onMount } from "svelte"
    import { closeWindow, focusWindow, maximizeWindow, unMaximizeWindow, type Window } from "$stores/windows"

    export let win: Window
    let windowReady = false
    win.offsetX = 0
    win.offsetY = 0
    win.newX = win.x
    win.newY = win.y
    win.newWidth = win.width
    win.newHeight = win.height

    onMount(() => {
        if (win.center) {
            win.x=(window.innerWidth - win.width) / 2
            win.y=(window.innerHeight - win.height) / 2
        }
        windowReady = true
    })

    let dragging = false

    function onDragStart(event: DragEvent) {
        if (!win.movable) {
            event.preventDefault()
            return
        }
        focusWindow(win)
        const dragImage = new Image()
        dragImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='
        event.dataTransfer?.setDragImage(dragImage, 0, 0)
        win.offsetX = event.clientX - win.x
        win.offsetY = event.clientY - win.y
        dragging = true
    }

    function onDrag(event: DragEvent) {
        if (!win.movable) {
            event.preventDefault()
            return
        }
        if (event.clientX === 0 && event.clientY === 0) {
            if (win.newX) win.x = win.newX
            if (win.newY) win.y = win.newY
            dragging = false
            return
        }
        if (win.offsetX) win.newX = Math.min(Math.max(event.clientX - win.offsetX, 0), window.innerWidth - win.width)
        if (win.offsetY) win.newY = Math.min(Math.max(event.clientY - win.offsetY, 0), window.innerHeight - win.height - 48)
    }

    function onDragEnd() {
        if (!win.movable) return
        if (win.newX) win.x = win.newX
        if (win.newY) win.y = win.newY
        dragging = false
    }

    function minimiseWindow() {
        win.minimized = true
        win.focused = false
    }

    function resizeStart(event: DragEvent) {
        focusWindow(win)
        if (win.maximized || win.minimized || !win.resizable) {
            event.preventDefault()
            return
        }
        const dragImage = new Image()
        dragImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='
        event.dataTransfer?.setDragImage(dragImage, 0, 0)
        dragging = true
    }

    function resizeTL(event: DragEvent) {
        win.newHeight = Math.max(win.height + win.y - event.clientY, win.minHeight)
        win.newY = win.newHeight === win.minHeight ? win.y + win.height - win.minHeight : event.clientY
        win.newWidth = Math.max(win.width + win.x - event.clientX, win.minWidth)
        win.newX = win.newWidth === win.minWidth ? win.x + win.width - win.minWidth : event.clientX
    }

    function resizeT(event: DragEvent) {
        win.newHeight = Math.max(win.height + win.y - event.clientY, win.minHeight)
        win.newY = win.newHeight === win.minHeight ? win.y + win.height - win.minHeight : event.clientY
    }

    function resizeTR(event: DragEvent) {
        win.newHeight = Math.max(win.height + win.y - event.clientY, win.minHeight)
        win.newY = win.newHeight === win.minHeight ? win.y + win.height - win.minHeight : event.clientY
        win.newWidth = Math.min(Math.max(event.clientX - win.x, win.minWidth), window.innerWidth - win.x)
    }

    function resizeL(event: DragEvent) {
        win.newWidth = Math.max(win.width + win.x - event.clientX, win.minWidth)
        win.newX = win.newWidth === win.minWidth ? win.x + win.width - win.minWidth : event.clientX
    }

    function resizeR(event: DragEvent) {
        win.newWidth = Math.min(Math.max(event.clientX - win.x, win.minWidth), window.innerWidth - win.x)
    }

    function resizeBL(event: DragEvent) {
        win.newHeight = Math.min(Math.max(event.clientY - win.y, win.minHeight), window.innerHeight - win.y - 48)
        win.newWidth = Math.max(win.width + win.x - event.clientX, win.minWidth)
        win.newX = win.newWidth === win.minWidth ? win.x + win.width - win.minWidth : event.clientX
    }

    function resizeB(event: DragEvent) {
        win.newHeight = Math.min(Math.max(event.clientY - win.y, win.minHeight), window.innerHeight - win.y - 48)
    }

    function resizeBR(event: DragEvent) {
        win.newWidth = Math.min(Math.max(event.clientX - win.x, win.minWidth), window.innerWidth - win.x)
        win.newHeight = Math.min(Math.max(event.clientY - win.y, win.minHeight), window.innerHeight - win.y - 48)
    }

    function resizeEnd() {
        if (win.newWidth) win.width = win.newWidth
        if (win.newHeight) win.height = win.newHeight
        if (win.newX) win.x = win.newX
        if (win.newY) win.y = win.newY
        dragging = false
    }
</script>

{#if dragging && win.focused}
    <div class="window-drag-area"
        style="left: {win.newX}px; top: {win.newY}px; width: {win.newWidth}px; height: {win.newHeight}px"
    ></div>
{/if}

{#if windowReady && !win.minimized}
    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
    <div
        class="window" on:click={() => focusWindow(win)} on:dragover|preventDefault
        class:hidden={win.minimized} class:window-focus={win.focused} class:window-maximized={win.maximized}
        style="left: {win.x}px; top: {win.y}px; width: {win.width}px; height: {win.height}px"
    >
        {#if win.resizable}
            <div
                draggable="true" class="window-resize window-resize-tl"
                on:dragstart={resizeStart} on:drag={resizeTL} on:dragend={resizeEnd}
            ></div>
            <div
                draggable="true" class="window-resize window-resize-t"
                on:dragstart={resizeStart} on:drag={resizeT} on:dragend={resizeEnd}
            ></div>
            <div
                draggable="true" class="window-resize window-resize-tr"
                on:dragstart={resizeStart} on:drag={resizeTR} on:dragend={resizeEnd}
            ></div>
            <div
                draggable="true" class="window-resize window-resize-l"
                on:dragstart={resizeStart} on:drag={resizeL} on:dragend={resizeEnd}
            ></div>
            <div
                draggable="true" class="window-resize window-resize-r"
                on:dragstart={resizeStart} on:drag={resizeR} on:dragend={resizeEnd}
            ></div>
            <div
                draggable="true" class="window-resize window-resize-bl"
                on:dragstart={resizeStart} on:drag={resizeBL} on:dragend={resizeEnd}
            ></div>
            <div draggable="true" class="window-resize window-resize-b"
                on:dragstart={resizeStart} on:drag={resizeB} on:dragend={resizeEnd}
            ></div>
            <div
                draggable="true" class="window-resize window-resize-br"
                on:dragstart={resizeStart} on:drag={resizeBR} on:dragend={resizeEnd}
            ></div>
        {/if}

        <div class="window-title-bar" draggable="true" role="dialog"
            on:dragstart={onDragStart} on:drag={onDrag} on:dragend={onDragEnd}
        >
            <div class="window-title">
                <img src={win.icon} alt={win.id}>
                <span>{win.title}</span>
            </div>
            <div class="window-controls">
                {#if win.minimizable}
                    <button class="btn window-control window-control-minimise" on:click|stopPropagation={minimiseWindow}>
                        <img src="/custom-icon/window-min.png" alt="minimise">
                    </button>
                {/if}
                {#if win.maximized && win.resizable}
                    <button class="btn window-control window-control-maximize" on:click={() => unMaximizeWindow(win)}>
                        <img src="/custom-icon/window-unmax.png" alt="maximize">
                    </button>
                {:else if win.resizable}
                    <button class="btn window-control window-control-maximize" on:click={() => maximizeWindow(win)}>
                        <img src="/custom-icon/window-max.png" alt="maximize">
                    </button>
                {/if}
                {#if win.closable}
                    <button class="btn window-control window-control-close" on:click={() => closeWindow(win)}>
                        <img src="/custom-icon/window-close.png" alt="close">
                    </button>
                {/if}
            </div>
        </div>
        <slot />
    </div>
{/if}

