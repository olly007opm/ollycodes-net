import type { LayoutServerLoad } from "./$types"
import prisma from "$lib/prisma"
import type { DesktopItem } from "$stores/desktop"

export const load: LayoutServerLoad = async event => {
    const session = await event.locals.auth()

    let desktopItems = await prisma.desktopIcon.findMany({
        where: {
            defaultX: { not: null },
            defaultY: { not: null }
        }
    })

    let desktop: DesktopItem[] = desktopItems
        .filter(item => item.defaultX !== null && item.defaultY !== null)
        .map(icon => {
            return {
                id: icon.id,
                icon: icon,
                x: icon.defaultX as number,
                y: icon.defaultY as number
            }
    })

    if (!session || !session.user) {
        return { session, desktop }
    }

    let userDesktop = await prisma.desktop.findFirst({
        where: { user: session.user },
        include: { items: { include: { icon: true } } }
    })
    if (userDesktop) desktop = userDesktop.items as DesktopItem[]

    return { session, desktop }
}