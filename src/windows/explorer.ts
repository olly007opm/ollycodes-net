import { windows, type WindowState } from "$stores/windows"
import Explorer from "$components/windows/Explorer.svelte"
import { AbstractExplorerWindow } from "$windows/abstractExplorer"

export class ExplorerWindow extends AbstractExplorerWindow {
    constructor(state: WindowState, folderId: string) {
        super(state, folderId)
    }
}

export function createExplorerWindow(folderId: string="root") {
    const explorerWindow = new ExplorerWindow({
        id: "explorer",
        title: "Explorer",
        icon: "/icon/computer_explorer-0.png",
        component: Explorer,
        x: 128,
        y: 128,
        width: 768,
        height: 640,
        minWidth: 512,
        minHeight: 256,
        focused: true
    }, folderId)

    windows.update(wins => [...wins, explorerWindow])
}