import { windows, Window } from "$stores/windows"
import Explorer from "$components/windows/Explorer.svelte"
import type { SvelteComponent } from "svelte"

class ExplorerWindow extends Window {
    path: string

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
    }, path: string) {
        super(state)
        this.path = path
    }
}

export function createExplorerWindow(path: string="C:\\") {
    const explorerWindow = new ExplorerWindow({
        id: "explorer",
        title: "My Computer",
        icon: "/icon/computer_explorer-0.png",
        component: Explorer,
        x: 256,
        y: 256,
        width: 768,
        height: 512,
        minWidth: 512,
        minHeight: 256,
        focused: true
    }, path)

    windows.update(wins => [...wins, explorerWindow])
}