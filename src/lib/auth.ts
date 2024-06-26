import { SvelteKitAuth } from "@auth/sveltekit"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GitHub from "@auth/sveltekit/providers/github"
import { env } from '$env/dynamic/private'
import prisma from "$lib/prisma.js"

export const { handle } = SvelteKitAuth(async event => {
    return {
        adapter: PrismaAdapter(prisma),
        providers: [
            GitHub({
                clientId: env.GITHUB_ID,
                clientSecret: env.GITHUB_SECRET,
            })
        ],
        // callbacks: {
        //     session({ session }) { return session }
        // },
        // pages: {
        //     signIn: "/auth/login",
        //     signOut: "/auth/logout",
        // },
        secret: env.AUTH_SECRET
        // trustHost: true
    }
})