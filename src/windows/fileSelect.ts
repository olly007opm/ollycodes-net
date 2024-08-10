import { windows, type WindowState } from "$stores/windows"
import { AbstractExplorerWindow } from "$windows/abstractExplorer"
import FileSelect from "$components/windows/FileSelect.svelte"
import { get } from "svelte/store"
import { page } from "$app/stores"

export class FileSelectWindow extends AbstractExplorerWindow {
    callback?: Function
    application?: string
    extensions?: string

    constructor(state: WindowState, folderId: string, callback: Function, application: string) {
        super(state, folderId)
        this.callback = callback
        this.application = application
        fetch(`${get(page).url.origin}/api/explorer/extensions?application=${this.application}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) this.extensions = data.extensions
            })
    }
}

export function createFileSelectWindow(callback: Function, application: string, folderId: string="root") {
    const fileSelectWindow = new FileSelectWindow({
        id: "file-select",
        title: "Open File",
        component: FileSelect,
        x: 256,
        y: 256,
        width: 768,
        height: 512,
        resizable: false,
        minimizable: false,
        focused: true,
        forceFocus: true
    }, folderId, callback, application)

    windows.update(wins => [...wins, fileSelectWindow])
}