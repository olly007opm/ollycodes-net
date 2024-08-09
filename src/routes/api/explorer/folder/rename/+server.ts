import { error, json } from "@sveltejs/kit"
import prisma, { cacheStrategy } from "$lib/prisma"
import { type User } from "@prisma/client"

export async function POST({ request, locals }) {
    const session = await locals.auth()
    if (!session || !session.user) return error(403, "Unauthorized")

    let data: { folderId: string, newName: string } = await request.json()
    let folder = await prisma.folder.findFirst({
        where: { id: data.folderId },
        cacheStrategy
    })
    if (!folder) return error(404, "File not found")
    if (folder.ownerId !== session?.user?.id && !(session?.user as User).admin) return error(403, "Unauthorized")

    let folderData = await prisma.folder.update({
        where: { id: data.folderId },
        data: { name: data.newName }
    })
    return json({ success: true, folder: folderData })
}