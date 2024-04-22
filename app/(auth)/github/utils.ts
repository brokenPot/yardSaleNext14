import {NextRequest} from "next/server";

export async function getAccessToken(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code");

    if (!code) return new Response(null, { status: 400 });

    const accessTokenParams = new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID!,
        client_secret: process.env.GITHUB_CLIENT_SECRET!,
        code,
    }).toString();
    const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;
    const accessTokenResponse = await fetch(accessTokenURL, {
        method: "POST",
        headers: {
            Accept: "application/json",
        },
    });

    const { error, access_token } = await accessTokenResponse.json();

    if (error) return new Response(null, { status: 400 });

    return access_token;
}
export async function getUserProfile(token: string) {
    const userProfileResponse = await fetch("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        cache: "no-cache",
    });

    return await userProfileResponse.json();
}

export async function getUserEmail(token: string) {
    const userEmailResponse = await fetch("https://api.github.com/user/emails", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        cache: "no-cache",
    });

    return await userEmailResponse.json();
}