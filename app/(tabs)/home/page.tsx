import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import {unstable_cache as nextCache,  revalidatePath } from "next/cache";
import Link from "next/link";

// const getCachedProducts = nextCache(getInitialProducts, ["home-products"]); // 60초가 지난후 새로운 요청이 있다면 재 호출
async function getInitialProducts() {
    console.log('!!!')
    const products = await db.product.findMany({
        select: {
            title: true,
            price: true,
            createdAt: true,
            image: true,
            id: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return products;
}
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
    const revalidate = async () => {
        "use server";
        revalidatePath("/home");
    };
    return (
        <div>
            <ProductList initialProducts={initialProducts}/>
            <form action={revalidate}>
                <button>Revalidate</button>
            </form>
            <Link
                href="/products/add"
                className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400"
            >
                <PlusIcon className="size-10"/>
            </Link>
        </div>
    );
}