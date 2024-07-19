import { error, json } from "@sveltejs/kit"
import prisma, { cacheStrategy } from "$lib/prisma"
import type { Folder } from "@prisma/client"

export async function GET({ url, locals }) {
    const session = await locals.auth()
    if (!session || !session.user) return error(403, "Unauthorized")

    let addressString = url.searchParams.get("address")
    if (!addressString) return error(400, "Missing address")

    console.log("find folderId for address:", addressString)
    let address = addressString.split("\\")

    let folder: Folder | null = null
    for (const name of address) {
        if (!name) break
        folder = await prisma.folder.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: "insensitive"
                },
                parentId: folder ? folder.id : undefined
            },
            include: { children: true },
            cacheStrategy
        })
        if (!folder) return error(404, "Folder not found")
        if (!folder.public && folder.ownerId !== session.user.id) return error(403, "Unauthorized")
    }

    if (!folder) return error(404, "Folder not found")

    return json({ success: true, folderId: folder.id })
}