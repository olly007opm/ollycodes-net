import type { Session } from "@auth/sveltekit"
import type { User } from "@prisma/client"
import prisma from "$lib/prisma"

export async function checkNewUser(session: Session) {
    if (!session.user) return

    if (!(session.user as User).username) {
        console.log("User requires username")
    }

    if (await prisma.desktop.count({ where: { userId: session.user.id } }) === 0) {
        let defaultIcons = await prisma.desktopIcon.findMany({
            where: {
                defaultX: { not: null },
                defaultY: { not: null }
            }
        })

        await prisma.desktop.create({
            data: {
                user: { connect: { id: session.user.id } },
                items: {
                    createMany: {
                        data: defaultIcons.map(icon => {
                            return {
                                iconId: icon.id,
                                x: icon.defaultX as number,
                                y: icon.defaultY as number
                            }
                        })
                    }
                }
            }
        })
    }
}