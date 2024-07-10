import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

interface Routes {
    [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
    "/": true,
    "/login": true,
    "/sms": true,
    "/create-account": true,
    "/github/start": true,
    "/github/complete": true,
};
export async function middleware(request: NextRequest) {
    // 미들웨어는 페이지 변경 요청 뿐만이 아닌 웹사이트의 요청 하나 하나 전부 실행된다.
    const session = await getSession();
    const exists = publicOnlyUrls[request.nextUrl.pathname];
    if (!session.id) {
        if (!exists) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    } else {
        if (exists) {
            return NextResponse.redirect(new URL("/home", request.url));
        }
    }
}

export const config = {
    // 미들웨어가 실행되는 페이지 지정
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],};