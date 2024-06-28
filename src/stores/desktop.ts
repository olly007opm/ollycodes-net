import { writable } from "svelte/store"
import type { DesktopIcon } from "@prisma/client"

export const desktop = writable<DesktopItem[]>([])

export type DesktopItem = {
    id: string
    icon: DesktopIcon
    x: number
    y: number
}