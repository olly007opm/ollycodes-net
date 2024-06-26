import type { LayoutServerLoad } from "./$types"
import prisma from "$lib/prisma.js"

export const load: LayoutServerLoad = async event => {
    // const session = await event.locals.auth()
    // console.log("session", session)
    // return { session }
    await prisma.user.findMany()
}