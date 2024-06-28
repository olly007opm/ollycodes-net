import { SvelteKitAuth } from "@auth/sveltekit"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GitHub from "@auth/sveltekit/providers/github"
import { env } from '$env/dynamic/private'
import prisma from "$lib/prisma.js"

export const { handle } = SvelteKitAuth(async () => {
    return {
        adapter: PrismaAdapter(prisma),
        providers: [
            GitHub({
                clientId: env.GITHUB_ID,
                clientSecret: env.GITHUB_SECRET,
            })
        ],
        callbacks: {
            async session({session}) {
                session.user = await prisma.user.findUnique({
                    where: { id: session.userId },
                    include: { desktop: { include: { items: true } } }
                }) as any
                return session
            }
        },
        secret: env.AUTH_SECRET
    }
})