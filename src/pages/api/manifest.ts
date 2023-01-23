import type { AppManifest } from "@mattermost/types/apps";
import { Locations, Permission } from "@mattermost/types/apps";
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "src/env/server.mjs";

const manifest = (
    _req: NextApiRequest,
    res: NextApiResponse<
        AppManifest & {
            app_type: "http";
            http: {
                root_url: string;
                use_jwt: boolean;
            };
        }
    >
) =>
    res.json({
        app_id: "t3-mattermost",
        display_name: "T3 Mattermost",
        description:
            "This is a mattermost starter app written using the t3 stack",
        icon: "t3.png",
        requested_permissions: [Permission.ActAsUser],
        homepage_url: env.BASE_URL,
        app_type: "http",
        http: {
            root_url: env.BASE_URL,
            use_jwt: true,
        },
        requested_locations: [Locations.PostMenu, Locations.ChannelHeader],
    });

export default manifest;
