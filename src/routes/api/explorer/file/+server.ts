import { error, json } from "@sveltejs/kit"
import prisma from "$lib/prisma"
import type { User } from "@prisma/client"

export async function GET({ url, locals }) {
    const session = await locals.auth()

    let fileId = url.searchParams.get("fileId")
    if (!fileId) return error(400, "Missing fileId")

    let query
    if (fileId === "changelog") query = { name: "Changelog", folder: { name: "C:", parent: null }}
    else query = { id: fileId }

    let file = await prisma.file.findFirst({
        where: query,
        include: { folder: true, type: true }
    })

    if (!file) return error(404, "File not found")
    if (!file.folder.public && file.folder.ownerId !== session?.user?.id && !(session?.user as User).admin) {
        return error(403, "Unauthorized")
    }

    return json({ success: true, file })
}
