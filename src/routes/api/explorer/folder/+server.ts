import { error, json } from "@sveltejs/kit"
import prisma from "$lib/prisma"
import type { Folder } from "@prisma/client"

export async function GET({ url, locals }) {
    const session = await locals.auth()
    if (!session || !session.user) return error(403, "Unauthorized")

    let folderId = url.searchParams.get("folderId")
    if (!folderId) return error(400, "Missing folderId")

    let folder, query
    if (folderId === "root") {
        query = { name: "C:", parent: null }
    } else if (folderId === "documents") {
        query = {
            ownerId: session.user.id,
            name: "Documents",
            parent: { name: "Users", parent: { name: "C:", parent: null } }
        }
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
        }
    })

    if (!folder) return error(404, "Folder not found")
    if (!folder.public && folder.ownerId !== session.user.id) return error(403, "Unauthorized")

    let address: string[] = [folder.name]
    if (folder.parentId) {
        let parentFolder: Folder | null = await prisma.folder.findFirst({ where: { id: folder.parentId } })
        while (parentFolder) {
            address.unshift(parentFolder.name)
            if (!parentFolder.parentId) break
            parentFolder = await prisma.folder.findFirst({ where: { id: parentFolder.parentId } })
        }
    }

    return json({ success: true, folder, address: address.join("\\") + "\\" })
}