import NextAuth, { type NextAuthOptions } from "next-auth";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { OAuthConfig } from "next-auth/providers/oauth.js";
import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

const mattermostProvider = ({
    mmUrl,
    client_id,
    client_secret,
    callbackUri,
}: {
    mmUrl: string;
    client_id: string;
    client_secret: string;
    callbackUri: string;
}) =>
    ({
        id: "mattermost",
        name: "Mattermost",
        type: "oauth",
        version: "2.0",
        token: {
            // For some reason its necessary to inline these values
            url: `${mmUrl}/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}`,
        },
        accessTokenUrl: `${mmUrl}/oauth/access_token`,
        authorization: {
            url: `${mmUrl}/oauth/authorize`,
            params: {
                redirect_uri: callbackUri,
                client_id,
                client_secret,
            },
        },
        userinfo: {
            url: `${mmUrl}/api/v4/users/me`,
            async request({ tokens }) {
                const profile = await fetch(
                    new URL(`${mmUrl}/api/v4/users/me`),
                    {
                        headers: {
                            Authorization: `Bearer ${tokens.access_token}`,
                        },
                    }
                ).then(async (res) => await res.json());
                return profile;
            },
        },
        profile(profile) {
            return {
                id: profile.id,
                name: profile.username,
                email: profile.email,
            };
        },
    } satisfies OAuthConfig<{
        id: string;
        name: string;
        email: string;
        username: string;
    }>);

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
            mmUrl: env.MM_URL,
            client_id: env.MM_CLIENT_ID,
            client_secret: env.MM_CLIENT_SECRET,
            callbackUri: env.MM_CALLBACK_URI,
        }),
        // ...add more providers here
    ],
};

export default NextAuth(authOptions);
