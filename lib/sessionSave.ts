import getSession from "@/lib/session";
import { redirect } from "next/navigation";
export default async function sessionSave(id: number) {
    const session = await getSession();
    session.id = id;
    await session.save();

    redirect("/profile");
}