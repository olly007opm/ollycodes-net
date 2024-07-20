import { error, json } from "@sveltejs/kit"
import prisma, { cacheStrategy } from "$lib/prisma"
import type { FileType } from "@prisma/client"

export async function GET({ url }) {
    let application = url.searchParams.get("application")
    if (!application) return error(400, "Missing application")

    let fileTypes = await prisma.fileType.findMany({
        where: { application },
        cacheStrategy
    })

    if (!fileTypes.length) return error(404, "No file types found")

    let extensions =  fileTypes.map((type: FileType) => "*." + type.extension).join("; ")
    return json({ success: true, extensions })
}