import { get, writable } from "svelte/store"
import TestWindow from "$components/windows/TestWindow.svelte"
import type { SvelteComponent } from "svelte"

export const windows = writable<Window[]>([
    {
        id: "test-window2",
        title: "Test Window2",
        icon: "/icon/document-1.png",
        component: TestWindow,
        x: 600,
        y: 400,
        z: 2,
        width: 512,
        height: 256,
        minWidth: 512,
        minHeight: 256,
        resizable: false,
        closable: true,
        minimizable: true,
        movable: true,
        forceFocus: false,
        minimized: false,
        maximized: false,
        focused: false,
        taskbarIndex: 1
    },
    {
        id: "test-window",
        title: "Test Window",
        icon: "/icon/document-1.png",
        component: TestWindow,
        x: 400,
        y: 200,
        z: 1,
        width: 512,
        height: 256,
        minWidth: 512,
        minHeight: 256,
        resizable: true,
        closable: true,
        minimizable: true,
        movable: true,
        forceFocus: false,
        minimized: false,
        maximized: false,
        focused: false,
        taskbarIndex: 0
    }
])

export type Window = {
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
    center?: boolean
    minimized: boolean
    maximized: boolean
    focused: boolean
    taskbarIndex: number
    newX?: number
    newY?: number
    newWidth?: number
    newHeight?: number
    offsetX?: number
    offsetY?: number
    originalSize?: {
        x: number
        y: number
        width: number
        height: number
    }
}

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
