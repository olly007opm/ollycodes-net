import { windows, type WindowState } from "$stores/windows"
import { AbstractExplorerWindow } from "$windows/abstractExplorer"
import { get } from "svelte/store"
import { page } from "$app/stores"
import Save from "$components/windows/Save.svelte"
import type { FileType } from "@prisma/client"

export class SaveWindow extends AbstractExplorerWindow {
    callback?: Function
    application?: string
    fileTypes?: FileType[]
    fileName: string = ""
    typeId: string = ""

    constructor(state: WindowState, folderId: string, callback: Function, application: string) {
        super(state, folderId)
        this.callback = callback
        this.application = application
        fetch(`${get(page).url.origin}/api/explorer/extensions?application=${this.application}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) this.fileTypes = data.fileTypes
            })
    }
}

export function createSaveWindow(callback: Function, application: string, folderId: string="root") {
    const saveWindow = new SaveWindow({
        id: "save",
        title: "Save As",
        component: Save,
        x: 256,
        y: 256,
        width: 768,
        height: 512,
        resizable: false,
        minimizable: false,
        focused: true,
        forceFocus: true
    }, folderId, callback, application)

    windows.update(wins => [...wins, saveWindow])
}