import { error, json } from "@sveltejs/kit"
import prisma, { cacheStrategy } from "$lib/prisma"
import { type FileType, type User } from "@prisma/client"
import { put } from "@vercel/blob"
import { createHash } from "crypto"

export async function POST({ request, locals }) {
    const session = await locals.auth()
    if (!session || !session.user) return error(403, "Unauthorized")

    let data = await request.formData()
    let folderId = data.get("folderId") as string
    if (!folderId) return error(400, "Missing folderId")
    let folder = await prisma.folder.findFirst({
        where: { id: folderId },
        include: { files: true },
        cacheStrategy
    })
    if (!folder) return error(404, "Folder not found")
    if (folder.ownerId !== session?.user?.id && !(session?.user as User).admin) return error(403, "Unauthorized")

    let file = data.get("file") as File
    if (!file) return error(400, "Missing file")
    if (file.size > 1024 * 1024 * 100) return error(400, "File too large, max 1MB")
    if (folder.files.map(file => file.name).includes(file.name)) return error(400, "File already exists")

    let fileType: FileType | null = await prisma.fileType.findFirst({
        where: { mimeType: file.type },
        cacheStrategy
    })
    if (!fileType) return error(400, "File type not allowed")

    let fileData: object
    if (fileType.editable) {
        if (["text", "markdown"].includes(fileType.identifier)) {
            fileData = { text: await file.text() }
        } else return error(400, "Failed to convert file")
    } else {
        fileData = await put(file.name, file, { access: 'public', contentType: file.type })
    }
    let fileRecord = await prisma.file.create({
        data: {
            name: file.name.replace(/\.[^/.]+$/, ""),
            folder: { connect: { id: folder.id } },
            type: { connect: { id: fileType.id } },
            data: fileData
        }
    })
    return json({ success: true, file: fileRecord })
}
