import prisma, { cacheStrategy } from "$lib/prisma"
import { checkNewUser } from "$lib/newuser"
import type { LayoutServerLoad } from "./$types"
import type { DesktopItem } from "$stores/desktop"

export const load: LayoutServerLoad = async event => {
    const session = await event.locals.auth()

    let desktopItems = await prisma.desktopIcon.findMany({
        where: {
            defaultX: { not: null },
            defaultY: { not: null }
        },
        cacheStrategy
    })

    let desktop: DesktopItem[] = desktopItems.map(icon => {
        return {
            id: icon.id,
            icon: icon,
            x: icon.defaultX as number,
            y: icon.defaultY as number
        }
    })

    if (!session || !session.user || !session.user.id) {
        return { session, desktop }
    }

    await checkNewUser(session)

    let userDesktop = await prisma.desktop.findFirst({
        where: { userId: session.user.id },
        include: { items: { include: { icon: true } } },
        cacheStrategy
    })
    if (userDesktop) desktop = userDesktop.items as DesktopItem[]

    return { session, desktop }
}