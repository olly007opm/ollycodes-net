<script lang="ts">
    let x = 256
    let y = 128
    let [offsetX, offsetY, newX, newY] = [0, 0, x, y]
    let width: number, height: number

    function onDragStart(event: DragEvent) {
        const dragImage = new Image()
        dragImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='
        event.dataTransfer?.setDragImage(dragImage, 0, 0)
        offsetX = event.clientX - x
        offsetY = event.clientY - y
    }

    function onDrag(event: DragEvent) {
        if (event.clientX === 0 && event.clientY === 0) {
            x = newX
            y = newY
            return
        }
        newX = Math.min(Math.max(event.clientX - offsetX, 0), window.innerWidth - width)
        newY = Math.min(Math.max(event.clientY - offsetY, 0), window.innerHeight - height - 48)
    }
</script>

<div class="window-drag-area" style="left: {newX}px; top: {newY}px; width: {width}px; height: {height}px"></div>

<div class="window" style="left: {x}px; top: {y}px" bind:clientWidth={width} bind:clientHeight={height}>
    <div class="window-title-bar" draggable="true" role="dialog" on:dragstart={onDragStart} on:drag={onDrag}>
        <div class="window-title">
            <img src="/icon/document-1.png" alt="window icon">
            <span>Test Window</span>
        </div>
        <div class="window-controls">
            <button class="btn window-control window-control-minimise">
                <img src="/custom-icon/window-min.png" alt="minimise">
            </button>
            <button class="btn window-control window-control-maximise">
                <img src="/custom-icon/window-max.png" alt="maximise">
            </button>
            <button class="btn window-control window-control-close">
                <img src="/custom-icon/window-close.png" alt="close">
            </button>
        </div>
    </div>
    Test Window Content
</div>

