import { page } from "$app/stores"
import { get } from "svelte/store"
import { windows, Window } from "$stores/windows"
import Explorer from "$components/windows/Explorer.svelte"
import { type SvelteComponent } from "svelte"
import { Prisma } from "@prisma/client"

export type Folder = Prisma.FolderGetPayload<{
    include: { parent: true, children: true, files: true }
}>

export class ExplorerWindow extends Window {
    address: string
    folder?: Folder

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
    }, address: string) {
        super(state)
        this.address = address
        this.fetchFolder()
    }

    fetchFolder() {
        fetch(`${get(page).url.origin}/api/explorer/folder?folderId=root`)
            .then(res => res.json())
            .then(data => {
                if (!data.success) return
                this.folder = data.folder as Folder
                this.title = this.folder.displayName || this.folder.name
                this.icon = this.folder.icon || "/icon/directory_open_cool-4.png"
                this.ready = true
                windows.update(wins => wins)
            })
    }
}

export function createExplorerWindow(address: string="C:\\") {
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
    }, address)

    windows.update(wins => [...wins, explorerWindow])
}