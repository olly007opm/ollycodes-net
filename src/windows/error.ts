import { windows, Window, type WindowState } from "$stores/windows"
import Error from "$components/windows/Error.svelte"

export class ErrorWindow extends Window {
    type: string
    errorTitle: string
    errorMessage: string

    constructor(state: WindowState, title: string, message: string, type: string) {
        super(state)
        this.type = type
        this.errorTitle = title
        this.errorMessage = message
        this.icon = "/icon/" + (
            type === "error" ? "msg_error-2.png"
            : type === "warning" ? "msg_warning-2.png"
            : type === "question" ? "msg_question-2.png"
            : "msg_information-2.png"
        )
    }
}

export const errorCodes: Record<string, { title: string,  message: string, type: string }> = {
    explorer_unauthorized: {
        title: "Access Denied",
        message: "You are not authorized to view this folder.",
        type: "error"
    },
    explorer_unauthorized_guest: {
        title: "Access Denied",
        message: "Please sign in to view this folder.",
        type: "error"
    },
    explorer_delete:{
        title: "Delete Failed",
        message: "An error occurred while deleting the selected items.",
        type: "error"
    },
    notepad_unauthorized: {
        title: "Access Denied",
        message: "You are not authorized to view this file.",
        type: "error"
    },
    notepad_unauthorized_guest: {
        title: "Access Denied",
        message: "Please sign in to view this file.",
        type: "error"
    },
    notepad_file_not_found: {
        title: "File Not Found",
        message: "The file you are trying to open does not exist.",
        type: "error"
    },
    notepad_save_failed: {
        title: "Save Failed",
        message: "An error occurred while saving the file.",
        type: "error"
    }
}

export function createErrorWindow(code: string) {
    const errorDetails = errorCodes[code]
    if (!errorDetails) {
        console.error(`Error code "${code}" not found`)
        return
    }
    const errorWindow = new ErrorWindow({
        id: "error",
        title: errorDetails.title,
        icon: "/icon/msg_error-2.png",
        component: Error,
        center: true,
        width: 512,
        height: 192,
        resizable: false,
        closable: true,
        minimizable: false,
        movable: false,
        forceFocus: true,
        focused: true,
        taskbarIndex: -1
    }, errorDetails.title, errorDetails.message, errorDetails.type)

    windows.update(wins => [...wins, errorWindow])
}