import { windows, Window, type WindowState } from "$stores/windows"
import Browser from "$components/windows/Browser.svelte"

export class BrowserWindow extends Window {
    url: string = ""
    newUrl: string = ""
    iframe?: HTMLIFrameElement

    constructor(state: WindowState, url?: string) {
        super(state)
        this.url = url ? url : "https://ollycodes.net"
        this.newUrl = this.url
    }

    navigate() {
        this.url = this.newUrl
        if (this.iframe) this.iframe.src = this.url
    }
}

export function createBrowserWindow(url?: string) {
    const browserWindow = new BrowserWindow({
        id: "browser",
        title: "Internet Explorer",
        icon: "/icon/msie1-0.png",
        component: Browser,
        x: 128,
        y: 128,
        width: 1024,
        height: 896,
        minWidth: 896,
        minHeight: 640,
        focused: true
    }, url)

    windows.update(wins => [...wins, browserWindow])
}