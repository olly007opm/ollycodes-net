import { error, json } from "@sveltejs/kit"
import prisma, { cacheStrategy } from "$lib/prisma"
import type { User } from "@prisma/client"

export async function GET({ url, locals }) {
    const session = await locals.auth()

    let fileId = url.searchParams.get("fileId")
    if (!fileId) return error(400, "Missing fileId")

    let query
    if (fileId === "changelog") query = { name: "Changelog", folder: { name: "C:", parent: null }}
    else if (fileId === "welcome") query = { name: "Welcome", folder: { name: "C:", parent: null }}
    else query = { id: fileId }

    let file = await prisma.file.findFirst({
        where: query,
        include: { folder: true, type: true },
        cacheStrategy
    })

    if (!file) return error(404, "File not found")
    if (!file.folder.public && file.folder.ownerId !== session?.user?.id && !(session?.user as User).admin) {
        return error(403, "Unauthorized")
    }

    return json({ success: true, file })
}

export async function POST({ request, locals }) {
    const session = await locals.auth()
    if (!session || !session.user) return error(403, "Unauthorized")

    let data: { id: string, data: object } = await request.json()
    let file = await prisma.file.findFirst({
        where: { id: data.id },
        include: { folder: true, type: true },
        cacheStrategy
    })
    if (!file) return error(404, "File not found")
    if (file.folder.ownerId !== session?.user?.id && !(session?.user as User).admin) return error(403, "Unauthorized")

    await prisma.file.update({
        where: { id: data.id },
        data: { data: data.data }
    })
    return json({ success: true })
}