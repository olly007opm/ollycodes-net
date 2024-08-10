import { page } from "$app/stores"
import { get } from "svelte/store"
import { windows, Window, closeWindow, type WindowState } from "$stores/windows"
import Notepad from "$components/windows/Notepad.svelte"
import { Prisma } from "@prisma/client"
import { createErrorWindow } from "./error"

export type File = Prisma.FileGetPayload<{ include: { folder: true, type: true } }>

export class NotepadWindow extends Window {
    fileId: string
    file?: File
    fileType?: string
    content: string = ""
    original: string = ""
    readOnly: boolean = true
    modified: boolean = false

    constructor(state: WindowState, fileId?: string) {
        super(state)
        if (fileId) {
            this.fileId = fileId
            this.fetchFile(true)
        } else {
            this.fileId = ""
            this.title = "Notepad - New File"
            this.readOnly = false
            this.ready = true
        }
    }

    fetchFile(firstFetch: boolean=false) {
        fetch(`${get(page).url.origin}/api/explorer/file?fileId=${this.fileId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    this.file = data.file as File
                    this.fileId = this.file.id
                    this.fileType = (data.file as File).type.identifier
                    this.content = data.file.data.text
                    this.original = this.content
                    this.readOnly = data.file.folder.ownerId !== get(page).data.session?.user?.id
                    this.title = `Notepad - ${data.file.name}.${data.file.type.extension}${this.readOnly ? " (Read-Only)" : ""}`
                    this.ready = true
                    windows.update(wins => wins)
                } else {
                    if (firstFetch) closeWindow(this)
                    if (data.message === "File not found") createErrorWindow("notepad_file_not_found")
                    else if (get(page).data.session) createErrorWindow("notepad_unauthorized", data.message)
                    else createErrorWindow("notepad_unauthorized_guest", data.message)
                }
            })
    }

    modify() {
        if (this.readOnly || !this.file) return
        this.modified = this.content !== this.original
        this.title = `Notepad - ${this.file.name}.${this.file.type.extension}${this.modified ? "*" : ""}`
        windows.update(wins => wins)
    }

    save() {
        if (this.readOnly) return
        fetch(`${get(page).url.origin}/api/explorer/file`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: this.fileId, data: { text: this.content } })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    this.modified = false
                    this.original = this.content
                    this.title = `Notepad - ${this.file?.name}.${this.file?.type.extension}`
                    windows.update(wins => wins)
                } else createErrorWindow("notepad_save_failed", data.message)
            })
    }

    saveAs(folderId: string, name: string, typeId: string) {
        if (this.readOnly) return
        fetch(`${get(page).url.origin}/api/explorer/file/new`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ folderId, name, typeId, data: { text: this.content } })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    this.fileId = data.file.id
                    this.file = data.file
                    this.fileType = data.file.type.identifier
                    this.original = this.content
                    this.modified = false
                    this.title = `Notepad - ${data.file.name}.${data.file.type.extension}`
                    windows.update(wins => wins)
                } else createErrorWindow("notepad_save_failed", data.message)
            })

    }
}

export function createNotepadWindow(fileId?: string) {
    if (fileId) for (const win of get(windows)) {
        if (win instanceof NotepadWindow && win.fileId === fileId) {
            win.focus()
            return
        }
    }

    const notepadWindow = new NotepadWindow({
        id: "notepad",
        title: "Notepad",
        icon: "/icon/notepad-0.png",
        component: Notepad,
        x: 128,
        y: 128,
        width: 768,
        height: 640,
        minWidth: 512,
        minHeight: 256,
        focused: true
    }, fileId)

    windows.update(wins => [...wins, notepadWindow])
}