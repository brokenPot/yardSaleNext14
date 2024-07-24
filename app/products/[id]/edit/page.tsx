import { unstable_cache as nextCache } from "next/cache";
import { notFound } from "next/navigation";
import EditProductForm from "./edit-product-form";
import {getProduct} from "@/app/(tabs)/home/@modal/(...)products/[id]/actions";

const getCachedProduct = nextCache(getProduct, ["product-detail"], {
    tags: ["product-detail", "product"],
});

export default async function EditProduct({
                                              params,
                                          }: {
    params: { id: string };
}) {
    const id = Number(params.id);
    if (isNaN(id)) {
        return notFound();
    }
    // console.log(id)
    const product = await getCachedProduct(id);
    if (product === null) {
        return notFound();
    }
    return (
        <EditProductForm
            productId={id}
            image={product.image}
            title={product.title}
            price={product.price}
            description={product.description}
        />
    );
}