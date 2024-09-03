"use client";

import ListProduct from "../../../../components/list-product";
import { useState } from "react";
import { getMoreProducts } from "@/app/(tabs)/home/actions";
import { InitialProducts } from "@/app/(tabs)/home/page";

interface ProductListProps {
    initialProducts: InitialProducts | undefined;
}

export default function LikedProductList({ initialProducts }: ProductListProps) {
    const [products, setProducts] = useState(initialProducts);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [isLastPage, setIsLastPage] = useState(false);

    // 버튼형 로드를 위한 코드
    // const trigger = useRef<HTMLSpanElement>(null);
    const onLoadMoreClick = async () => {
        setIsLoading(true);
        const newProducts = await getMoreProducts(page + 1);
        if (newProducts.length !== 0) {
            setPage((prev) => prev + 1);
            setProducts((prev) => [...prev!, ...newProducts]);
        } else {
            setIsLastPage(true);
        }
        setIsLoading(false);
    };
    return (
        <div className="p-5 flex flex-col gap-5">
            {products!.map((product) => (
                <ListProduct key={product.id} {...product} />
            ))}
            {isLastPage ? (
                <div  className="flex justify-center text-sm">No more items</div>
            ) : (
                <button
                    onClick={onLoadMoreClick}
                    disabled={isLoading}
                    className="text-sm font-semibold bg-blue-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
                >
                    {isLoading ? "로딩 중" : "Load more"}
                </button>
            )}

        </div>
    );
}