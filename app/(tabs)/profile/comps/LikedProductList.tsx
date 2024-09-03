"use client";

import ListProduct from "@/components/list-product";
import { useState } from "react";
import { InitialProducts } from "@/app/(tabs)/home/page";

interface ProductListProps {
    initialProducts: InitialProducts | undefined;
}

export default function LikedProductList({ initialProducts }: ProductListProps) {
    const [products, setProducts] = useState(initialProducts);

    return (
        <div className="p-5 flex flex-col gap-5">
            {products!.map((product) => (
                <ListProduct key={product.id} {...product} />
            ))}
        </div>
    );
}