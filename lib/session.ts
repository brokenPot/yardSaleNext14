import { getIronSession } from "iron-session";

interface SessionContent {
    id?: number;
}

export default async function getSession() {
    const cookies = await import('next/headers').then(mod => mod.cookies());
    return getIronSession<SessionContent>(cookies, {
        cookieName: "yard-sale",
        password: process.env.COOKIE_PASSWORD!,
    });
}