import { page } from "$app/stores"
import { get } from "svelte/store"
import { windows, Window, closeWindow } from "$stores/windows"
import Explorer from "$components/windows/Explorer.svelte"
import { type SvelteComponent } from "svelte"
import { Prisma } from "@prisma/client"
import { createErrorWindow } from "$stores/windows/error"

export type Folder = Prisma.FolderGetPayload<{
    include: { parent: true, children: true, files: { include: { type: true } } }
}>

export class ExplorerWindow extends Window {
    folderId: string
    folder?: Folder
    address?: string
    newAddress?: string

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
    }, folderId: string) {
        super(state)
        this.folderId = folderId
        this.fetchFolder(true)
    }

    fetchFolder(firstFetch: boolean=false) {
        fetch(`${get(page).url.origin}/api/explorer/folder?folderId=${this.folderId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    this.folder = data.folder as Folder
                    this.folderId = this.folder.id
                    this.address = data.address
                    this.newAddress = this.address
                    this.title = this.folder.displayName || this.folder.name
                    this.icon = this.folder.icon || "/icon/directory_open_cool-4.png"
                    this.ready = true
                    windows.update(wins => wins)
                } else {
                    if (firstFetch) closeWindow(this)
                    if (get(page).data.session) createErrorWindow("explorer_unauthorized")
                    else createErrorWindow("explorer_unauthorized_guest")
                }
            })
    }

    navigate(folderId: string) {
        this.folderId = folderId
        this.fetchFolder()
    }

    navigateAddress() {
        if (this.newAddress === this.address) return
        fetch(`${get(page).url.origin}/api/explorer/address?address=${this.newAddress}`)
            .then(res => {
                if (res.status === 200) {
                    res.json().then(data => {
                        if (data.success) {
                            this.folderId = data.folderId
                            this.fetchFolder()
                        } else {
                            this.newAddress = this.address
                        }
                    })
                } else {
                    this.newAddress = this.address
                    if (res.status === 403) {
                        if (get(page).data.session) createErrorWindow("explorer_unauthorized")
                        else createErrorWindow("explorer_unauthorized_guest")
                    }
                }
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
        minWidth: 512,
        minHeight: 256,
        focused: true,
        forceFocus: true
    }, folderId)

    windows.update(wins => [...wins, explorerWindow])
}