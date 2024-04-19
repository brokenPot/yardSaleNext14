import getSession from "@/lib/session";
import {redirect} from "next/navigation";

export default function Products() {
    const logOut = async () => {
        "use server";
        const session = await getSession();
        await session.destroy();
        redirect("/");
    };
    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            fine!
            <form action={logOut}>
                <button>Log out</button>
            </form>
        </div>
    );
}