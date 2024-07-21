import ProductList from "@/components/product-list";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
// import { revalidatePath } from "next/cache";
import Link from "next/link";
import {getInitialProducts} from "@/app/(tabs)/home/actions";

export type InitialProducts = Prisma.PromiseReturnType<
    typeof getInitialProducts
>;

export const metadata = {
    title: "Home",
};


// export const dynamic = "force-dynamic";
// export const revalidate = 60;

export default async function Products() {
    const initialProducts = await getInitialProducts();
    // const revalidate = async () => {
    //     "use server";
    //     revalidatePath("/home");
    // };
    return (
        <div>
            <ProductList initialProducts={initialProducts}/>
            {/*<form action={revalidate}>*/}
            {/*    <button>Revalidate</button>*/}
            {/*</form>*/}
            <Link
                href="/product/add"
                className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400"
            >
                <PlusIcon className="size-10"/>
            </Link>
        </div>
    );
}