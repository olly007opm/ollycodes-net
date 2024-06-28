import { error, json } from "@sveltejs/kit"
import prisma from "$lib/prisma"

export async function POST({ request, locals }) {
    const session = await locals.auth()
    if (!session || !session.user) return error(403, "Unauthorized")

    let data: { id: string, x: number, y: number } = await request.json()
    let desktopItem = await prisma.desktopItem.findFirst({
        where: { id: data.id },
        include: { desktop: { select: { userId: true } } }
    })
    if (!desktopItem) return error(404, "Desktop not found")
    if (desktopItem.desktop.userId !== session.user.id) return error(403, "Unauthorized")

    await prisma.desktopItem.update({
        where: { id: data.id, desktop: { userId: session.user.id } },
        data: { x: data.x, y: data.y }
    })
    return json({ success: true })
}