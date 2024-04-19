import db from "@/lib/db";
import { NextRequest } from "next/server";
import sessionSave from "@/lib/sessionSave";
import {getAccessToken, getUserEmail, getUserProfile} from "@/app/github/utils";

export async function GET(request: NextRequest) {

    const access_token = await getAccessToken(request)
    const { id, avatar_url, login } : GitHubProfile = await getUserProfile(access_token)
    const emails: GitHubEmail[] = await getUserEmail(access_token);
    const email = emails?.find(
        ({ primary, visibility }) => primary && visibility === "private"
    )?.email;
    const user = await db.user.findUnique({
        where: {
            github_id: id + "",
        },
        select: {
            id: true,
        },
    });
    if (user) {
        await sessionSave(user.id);
    }
    const newUser = await db.user.create({
        data: {
            name: `${login}${id && `-${id}`}${email && `-${email.split("@").at(0)}`}`,
            github_id: id + "",
            avatar: avatar_url,
        },
        select: {
            id: true,
        },
    });
    await sessionSave(newUser.id);
}
