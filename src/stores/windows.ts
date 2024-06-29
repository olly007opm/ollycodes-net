import { get, writable } from "svelte/store"
import type { SvelteComponent } from "svelte"

export class Window {
    id: string
    title: string
    icon: string
    component: { new (...args: any[]): SvelteComponent }
    x: number
    y: number
    z: number
    width: number
    height: number
    minWidth: number
    minHeight: number
    resizable: boolean
    closable: boolean
    minimizable: boolean
    movable: boolean
    forceFocus: boolean
    center: boolean
    minimized: boolean
    maximized: boolean
    focused: boolean
    taskbarIndex: number
    newX: number
    newY: number
    newWidth: number
    newHeight: number
    offsetX: number
    offsetY: number
    originalSize?: {
        x: number
        y: number
        width: number
        height: number
    }

    constructor(state: {
        id: string
        title: string
        icon: string
        component: { new (...args: any[]): SvelteComponent }
        x?: number
        y?: number
        z?: number
        width?: number
        height?: number
        minWidth?: number
        minHeight?: number
        resizable?: boolean
        closable?: boolean
        minimizable?: boolean
        movable?: boolean
        forceFocus?: boolean
        center?: boolean
        minimized?: boolean
        maximized?: boolean
        focused?: boolean
        taskbarIndex?: number
    }) {
        this.id = state.id
        this.title = state.title
        this.icon = state.icon
        this.component = state.component
        this.x = state.x || 400
        this.y = state.y || 200
        this.z = state.z || 0
        this.width = state.width || 512
        this.height = state.height || 256
        this.minWidth = state.minWidth || 512
        this.minHeight = state.minHeight || 256
        this.resizable = state.resizable || true
        this.closable = state.closable || true
        this.minimizable = state.minimizable || true
        this.movable = state.movable || true
        this.forceFocus = state.forceFocus || false
        this.center = state.center || false
        this.minimized = state.minimized || false
        this.maximized = state.maximized || false
        this.focused = state.focused || false
        this.taskbarIndex = state.taskbarIndex || 0
        this.newX = this.x
        this.newY = this.y
        this.newWidth = this.width
        this.newHeight = this.height
        this.offsetX = 0
        this.offsetY = 0
        this.originalSize = {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        }
    }
}

export const windows = writable<Window[]>([])

export function clearWindowFocus() {
    windows.update(wins => {
        wins.filter(w => !w.forceFocus).forEach(win => win.focused = false)
        return wins
    })
}

export function focusWindow(win: Window) {
    clearWindowFocus()
    if (get(windows).filter(w => w.forceFocus).length !== 0) return
    win.focused = true
    win.minimized = false
    windows.update(wins => {
        wins.forEach(w => { if (w.z > win.z) w.z-- })
        win.z = wins.length
        return wins
    })
}

export function maximizeWindow(win: Window) {
    if (!win.resizable) return
    focusWindow(win)
    win.maximized = true
    win.originalSize = { x: win.x, y: win.y, width: win.width, height: win.height }
    win.x = 0
    win.y = 0
    win.width = window.innerWidth
    win.height = window.innerHeight - 48
}

export function unMaximizeWindow(win: Window) {
    if (!win.resizable) return
    focusWindow(win)
    win.maximized = false
    win.x = win.originalSize?.x || 100
    win.y = win.originalSize?.y || 100
    win.width = win.originalSize?.width || 512
    win.height = win.originalSize?.height || 256
}

export function closeWindow(win: Window) {
    if (!win.closable) return
    windows.update(wins => wins.filter(w => win !== w))
}
