import type { Session } from "@auth/sveltekit"
import type { User } from "@prisma/client"
import prisma from "$lib/prisma"

export async function checkNewUser(session: Session) {
    const user = session.user as User
    if (!user) return

    let newUsername = "user_" + Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, "0")
    if (!user.username) {
        while (await prisma.user.findFirst({ where: { username: newUsername } })) {
            newUsername = "user_" + Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, "0")
        }
        await prisma.user.update({
            where: { id: user.id },
            data: { username: newUsername }
        })
    }

    if (await prisma.desktop.count({ where: { userId: user.id } }) === 0) {
        let defaultIcons = await prisma.desktopIcon.findMany({
            where: {
                defaultX: { not: null },
                defaultY: { not: null }
            }
        })

        await prisma.desktop.create({
            data: {
                user: { connect: { id: user.id } },
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

    if (!user.homeFolderId) {
        let usersFolder = await prisma.folder.findFirst({
            where: { name: "Users", parent: { name: "C:", parent: null } }
        })
        if (usersFolder) {
            let userFolder = await prisma.folder.create({
                data: {
                    name: user.username || newUsername,
                    icon: "/icon/user_computer-0.png",
                    parent: { connect: { id: usersFolder.id } },
                    owner: { connect: { id: user.id } },
                    homeUser: { connect: { id: user.id } },
                    public: false
                }
            })
            await prisma.folder.create({
                data: {
                    name: "Recycle Bin",
                    icon: "/icon/recycle_bin_full-3.png",
                    parent: { connect: { id: userFolder.id } },
                    owner: { connect: { id: user.id } },
                    public: false
                }
            })
        }
    }
}
