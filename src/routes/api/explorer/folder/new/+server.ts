import { error, json } from "@sveltejs/kit"
import prisma, { cacheStrategy } from "$lib/prisma"
import { type User } from "@prisma/client"

export async function POST({ request, locals }) {
    const session = await locals.auth()
    if (!session || !session.user) return error(403, "Unauthorized")

    let data: { parentId: string, name: string } = await request.json()
    let parentFolder = await prisma.folder.findFirst({
        where: { id: data.parentId },
        include: { owner: true },
        cacheStrategy
    })
    if (!parentFolder) return error(404, "Folder not found")
    if (parentFolder.ownerId !== session?.user?.id && !(session?.user as User).admin) return error(403, "Unauthorized")

    let newFolder = await prisma.folder.create({
        data: {
            parent: { connect: { id: data.parentId } },
            owner: { connect: { id: session.user.id } },
            name: data.name
        }
    })
    return json({ success: true, folder: newFolder })
}