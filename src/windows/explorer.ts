import { windows, type WindowState } from "$stores/windows"
import Explorer from "$components/windows/Explorer.svelte"
import { AbstractExplorerWindow } from "$windows/abstractExplorer"
import { get } from "svelte/store"
import { page } from "$app/stores"
import { createErrorWindow } from "$windows/error"

export class ExplorerWindow extends AbstractExplorerWindow {
    constructor(state: WindowState, folderId: string) {
        super(state, folderId)
    }

    deleteItems(fileIds: string[], folderIds: string[]) {
        fetch(`${get(page).url.origin}/api/explorer/delete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileIds, folderIds })
        }).then(res => res.json()).then(data => {
            if (!data.success) createErrorWindow("explorer_delete")
        })
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
        minWidth: 768,
        minHeight: 512,
        focused: true
    }, folderId)

    windows.update(wins => [...wins, explorerWindow])
}