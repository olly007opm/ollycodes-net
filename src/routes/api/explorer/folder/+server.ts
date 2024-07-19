import { error, json } from "@sveltejs/kit"
import prisma, { cacheStrategy } from "$lib/prisma"
import type { Folder, User } from "@prisma/client"

export async function GET({ url, locals }) {
    const session = await locals.auth()

    let folderId = url.searchParams.get("folderId")
    if (!folderId) return error(400, "Missing folderId")

    let folder, query
    if (folderId === "root") {
        query = { name: "C:", parent: null }
    } else if (folderId === "documents") {
        if (!session?.user) return error(403, "Unauthorized")
        query = { homeUser: { id: session.user.id } }
    } else if (folderId === "bin") {
        if (!session?.user) return error(403, "Unauthorized")
        query = { name: "Recycle Bin", parent: { homeUser: { id: session.user.id } } }
    } else if (folderId === "projects") {
        query = { name: "Projects", parent: { name: "C:", parent: null } }
    } else {
        query = { id: folderId }
    }

    folder = await prisma.folder.findFirst({
        where: query,
        include: {
            parent: true,
            children: true,
            files: {
                include: { type: true }
            }
        },
        cacheStrategy
    })

    if (!folder) return error(404, "Folder not found")
    if (!folder.public && folder.ownerId !== session?.user?.id && !(session?.user as User)?.admin) {
        return error(403, "Unauthorized")
    }

    let address: string[] = [folder.name]
    if (folder.parentId) {
        let parentFolder: Folder | null = await prisma.folder.findFirst({
            where: { id: folder.parentId },
            cacheStrategy
        })
        while (parentFolder) {
            address.unshift(parentFolder.name)
            if (!parentFolder.parentId) break
            parentFolder = await prisma.folder.findFirst({ where: { id: parentFolder.parentId }, cacheStrategy })
        }
    }

    return json({ success: true, folder, address: address.join("\\") + "\\" })
}