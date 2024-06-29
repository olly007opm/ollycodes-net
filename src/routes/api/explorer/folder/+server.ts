import { error, json } from "@sveltejs/kit"
import prisma from "$lib/prisma"

export async function GET({ url, locals }) {
    const session = await locals.auth()
    if (!session || !session.user) return error(403, "Unauthorized")

    let folderId = url.searchParams.get("folderId")
    if (!folderId) return error(400, "Missing folderId")

    let folder
    let rootFolder = await prisma.folder.findFirst({
        where: { name: "C:", parent: null },
        include: {
            parent: true,
            children: true,
            files: true
        }
    })

    if (!rootFolder) return error(404, "Root folder not found")

    if (folderId === "root") {
        folder = rootFolder
    } else if (folderId === "documents") {
        folder = await prisma.folder.findFirst({
            where: {
                ownerId: session.user.id,
                name: "Documents",
                parent: { name: "Users", parentId: rootFolder.id }
            },
            include: {
                parent: true,
                children: true,
                files: true
            }
        })
    } else {
        folder = await prisma.folder.findUnique({
            where: { id: folderId },
            include: {
                parent: true,
                children: true,
                files: true
            }
        })
    }

    if (!folder) return error(404, "Folder not found")
    if (!folder.public && folder.ownerId !== session.user.id) return error(403, "Unauthorized")

    return json({ success: true, folder })
}