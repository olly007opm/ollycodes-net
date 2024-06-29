import { error, json } from "@sveltejs/kit"
import prisma from "$lib/prisma"
import { checkUsername } from "$lib/username"

export async function POST({ request, locals }) {
    const session = await locals.auth()
    if (!session || !session.user) return error(403, "Unauthorized")

    const data = await request.json()

    let { valid, message} = checkUsername(data.username)

    if (!valid) {
        return json({ valid: false, message })
    } else if (await prisma.user.findFirst({ where: { username: data.username } })) {
        return json({ valid: false, message: "Username is already taken." })
    } else {
        return json({ valid: true })
    }
}