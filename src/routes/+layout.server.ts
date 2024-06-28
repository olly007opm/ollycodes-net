import type { LayoutServerLoad } from "./$types"
import prisma from "$lib/prisma"
import type {DesktopItem} from "$stores/desktop";

export const load: LayoutServerLoad = async event => {
    const session = await event.locals.auth()

    let desktopIcons = await prisma.desktopIcon.findMany({
        where: {
            defaultX: { not: null },
            defaultY: { not: null }
        }
    })

    let desktopItems: DesktopItem[] = desktopIcons.map(icon => {
        return {
            id: icon.id,
            icon: icon,
            x: icon.defaultX as number,
            y: icon.defaultY as number
        }
    })

    return { session, desktop: desktopItems }
}