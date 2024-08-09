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
    pastFolderIds: string[] = []
    futureFolderIds: string[] = []
    renaming: string | null = null

    constructor(state: WindowState, folderId: string) {
        super(state)
        this.folderId = folderId
        this.fetchFolder(false, true)
    }

    fetchFolder(noCache: boolean=false, firstFetch: boolean=false) {
        fetch(`${get(page).url.origin}/api/explorer/folder?folderId=${this.folderId}${noCache ? "&noCache=true" : ""}`)
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

    navigate(folderId: string, updateHistory: boolean=true) {
        if (updateHistory) {
            if (this.pastFolderIds.at(-1) !== this.folderId) this.pastFolderIds.push(this.folderId)
            this.futureFolderIds = []
        }
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

    navigateBack() {
        if (this.pastFolderIds.length === 0) return
        this.futureFolderIds.push(this.folderId)
        this.navigate(this.pastFolderIds.pop() as string, false)
    }

    navigateForward() {
        if (this.futureFolderIds.length === 0) return
        this.pastFolderIds.push(this.folderId)
        this.navigate(this.futureFolderIds.pop() as string, false)
    }

    renameItem(folder: boolean, itemId: string, newName: string) {
        let body: { newName: string, folderId?: string, fileId?: string } = { newName }
        folder ? body.folderId = itemId : body.fileId = itemId
        fetch(`${get(page).url.origin}/api/explorer/${folder ? "folder" : "file"}/rename`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    this.fetchFolder(true)
                } else {
                    createErrorWindow("explorer_rename_error")
                }
            })
    }

    createFolder(name: string) {
        fetch(`${get(page).url.origin}/api/explorer/folder/new`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ parentId: this.folderId, name })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    this.fetchFolder(true)
                } else {
                    createErrorWindow("explorer_create_folder_error")
                }
            })
    }
}
