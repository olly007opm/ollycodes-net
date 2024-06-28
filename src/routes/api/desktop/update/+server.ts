import { error, json } from "@sveltejs/kit"
import prisma from "$lib/prisma"

export async function POST({ request, locals }) {
    const session = await locals.auth()
    if (!session || !session.user) return error(403, "Unauthorized")

    let data: { id: string, x: number, y: number } = await request.json()
    if (prisma.desktop.findFirst({ where: { id: data.id } }).user !== session.user) {
        return error(403, "Unauthorized")
    }
    await prisma.desktopItem.update({
        where: { id: data.id, desktop: { user: session.user } },
        data: { x: data.x, y: data.y }
    })
    return json({ success: true })
}