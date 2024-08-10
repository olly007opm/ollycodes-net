import { error, json } from "@sveltejs/kit"
import prisma, { cacheStrategy } from "$lib/prisma"
import { type User } from "@prisma/client"

export async function POST({ request, locals }) {
    const session = await locals.auth()
    if (!session || !session.user) return error(403, "Unauthorized")

    let data: { fileId: string, newName: string } = await request.json()
    let file = await prisma.file.findFirst({
        where: { id: data.fileId },
        include: { folder: true },
        cacheStrategy
    })
    if (!file) return error(404, "File not found")
    if (file.folder.ownerId !== session?.user?.id && !(session?.user as User).admin) return error(403, "Unauthorized")

    let fileData = await prisma.file.update({
        where: { id: data.fileId },
        data: { name: data.newName }
    })
    return json({ success: true, file: fileData })
}