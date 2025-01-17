import { unstable_cache as nextCache } from "next/cache";
import { notFound } from "next/navigation";
import EditProductForm from "./comps/edit-product-form";
import {getProduct} from "@/app/(tabs)/home/@modal/(...)products/[id]/actions";

const getCachedProduct = nextCache(getProduct, ["product-detail"], {
    tags: ["product-detail", "product"],
});

export default async function EditProduct({
                                              params,
                                          }: {
    params: { id: string };
}) {
    const { id } = await params;
    const numericId = Number(id);

    // const id = Number(params.id);
    if (isNaN(numericId)) {
        return notFound();
    }

    const product = await getCachedProduct(numericId);
    if (product === null) {
        return notFound();
    }
    return (
        <EditProductForm
            productId={numericId}
            image={product.image}
            title={product.title}
            price={product.price}
            description={product.description}
        />
    );
}