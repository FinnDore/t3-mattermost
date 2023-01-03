import { OAuthConfig } from "next-auth/providers";

export const mattermostProvider = ({
    mattermostUrl: mmUrl,
    clientId: client_id,
    clientSecret: client_secret,
    callbackUrl: callbackUri,
}: {
    mattermostUrl: string;
    clientId: string;
    clientSecret: string;
    callbackUrl: string;
}) =>
    ({
        id: "mattermost",
        name: "Mattermost",
        type: "oauth",
        version: "2.0",
        token: {
            url: `${mmUrl}/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}`,
        },
        authorization: {
            url: `${mmUrl}/oauth/authorize`,
            params: {
                callbackUri,
            },
        },
        userinfo: {
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
        clientId: client_id,
        clientSecret: client_secret,
    } satisfies OAuthConfig<{
        id: string;
        name: string;
        email: string;
        username: string;
    }>);
