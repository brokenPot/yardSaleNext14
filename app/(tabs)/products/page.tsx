import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";

async function getInitialProducts() {
    const products = await db.product.findMany({
        select: {
            title: true,
            price: true,
            createdAt: true,
            image: true,
            id: true,
        },
        take: 1,
        orderBy: {
            createdAt: "desc",
        },
    });
    return products;
}
export type InitialProducts = Prisma.PromiseReturnType<
    typeof getInitialProducts
>;
export default async function Products() {
    const initialProducts = await getInitialProducts();
    return (
        <div>
            <ProductList initialProducts={initialProducts}/>
        </div>
    );
}