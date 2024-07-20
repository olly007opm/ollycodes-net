import { error, json } from "@sveltejs/kit"
import prisma, { cacheStrategy } from "$lib/prisma"
import { type User } from "@prisma/client"

export async function POST({ request, locals }) {
    const session = await locals.auth()
    if (!session || !session.user) return error(403, "Unauthorized")

    let data: { folderId: string, name: string, typeId: string, data: object } = await request.json()
    let folder = await prisma.folder.findFirst({
        where: { id: data.folderId },
        include: { owner: true },
        cacheStrategy
    })
    if (!folder) return error(404, "Folder not found")
    if (folder.ownerId !== session?.user?.id && !(session?.user as User).admin) return error(403, "Unauthorized")

    let newFile = await prisma.file.create({ data })
    let fileData = await prisma.file.findUnique({
        where: { id: newFile.id },
        include: { folder: true, type: true }
    })
    return json({ success: true, file: fileData })
}