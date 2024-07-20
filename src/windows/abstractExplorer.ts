import { page } from "$app/stores"
import { get } from "svelte/store"
import { windows, Window, closeWindow, type WindowState } from "$stores/windows"
import { Prisma } from "@prisma/client"
import { createErrorWindow } from "./error"

export type Folder = Prisma.FolderGetPayload<{
    include: { parent: true, children: true, files: { include: { type: true } } }
}>
export type File = Prisma.FileGetPayload<{ include: { type: true } }>

export class AbstractExplorerWindow extends Window {
    folderId: string
    folder?: Folder
    address?: string
    newAddress?: string

    constructor(state: WindowState, folderId: string) {
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
                    if (this.id === "explorer") this.title = this.folder.displayName || this.folder.name
                    if (this.id === "explorer") this.icon = this.folder.icon || "/icon/directory_open_cool-4.png"
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
