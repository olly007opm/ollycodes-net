import { error, json } from "@sveltejs/kit"
import prisma, { cacheStrategy } from "$lib/prisma"
import { type User } from "@prisma/client"

export async function POST({ request, locals }) {
    const session = await locals.auth()
    if (!session || !session.user) return error(403, "Unauthorized")

    let { fileIds, folderIds }: { fileIds: string[], folderIds: string[] } = await request.json()
    if (!fileIds.length && !folderIds.length) return error(400, "Missing fileId or folderId")

    let recycleBin = await prisma.folder.findFirst({
        where: {
            ownerId: session.user.id,
            name: "Recycle Bin",
            parent: { homeUser: { id: session.user.id } }
        },
        cacheStrategy
    })
    if (!recycleBin) return error(404, "Recycle Bin not found")
    if (folderIds.includes(recycleBin.id)) return error(400, "Cannot delete Recycle Bin")

    let files = []
    let folders = []

    for (const fileId of fileIds) {
        let file = await prisma.file.findFirst({
            where: { id: fileId },
            include: { folder: { include: { owner: true } } },
            cacheStrategy
        })
        if (!file) error(404, "File not found")
        if (file.folder.ownerId !== session?.user?.id && !(session?.user as User).admin) error(403, "Unauthorized")
        files.push(file)
    }

    for (const folderId of folderIds) {
        let folder = await prisma.folder.findFirst({
            where: { id: folderId },
            include: { owner: true },
            cacheStrategy
        })
        if (!folder) error(404, "Folder not found")
        if (folder.ownerId !== session?.user?.id && !(session?.user as User).admin) error(403, "Unauthorized")
        folders.push(folder)
    }

    for (const file of files) {
        await prisma.file.update({
            where: { id: file.id },
            data: { folder: { connect: { id: recycleBin.id } } }
        })
    }

    for (const folder of folders) {
        await prisma.folder.update({
            where: { id: folder.id },
            data: { parent: { connect: { id: recycleBin.id } } }
        })
    }

    return json({ success: true })
}