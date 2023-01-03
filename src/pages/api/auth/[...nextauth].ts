import NextAuth, { type NextAuthOptions } from "next-auth";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { mattermostProvider } from "../../../auth/mattermost-provider.js";
import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
    // Include user.id on session
    callbacks: {
        session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;
            }
            return session;
        },
    },
    // Configure one or more authentication providers
    adapter: PrismaAdapter(prisma),
    providers: [
        mattermostProvider({
            mattermostUrl: env.MM_URL,
            clientId: env.MM_CLIENT_ID,
            clientSecret: env.MM_CLIENT_SECRET,
            callbackUrl: env.MM_CALLBACK_URI,
        }),
        // ...add more providers here
    ],
};

export default NextAuth(authOptions);
