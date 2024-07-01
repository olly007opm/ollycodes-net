import { windows, Window } from "$stores/windows"
import Error from "$components/windows/Error.svelte"
import { type SvelteComponent } from "svelte"

export class ErrorWindow extends Window {
    type: string
    errorTitle: string
    errorMessage: string

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
    }, title: string, message: string, type: string) {
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

export function createErrorWindow(title: string, message: string, type: string) {
    const errorWindow = new ErrorWindow({
        id: "error",
        title: title,
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
    }, title, message, type)

    windows.update(wins => [...wins, errorWindow])
}