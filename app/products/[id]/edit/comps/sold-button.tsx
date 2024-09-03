"use client";

import { useState } from "react";
import { onSold} from "@/app/products/[id]/edit/actions";


interface SoldButtonProps {
    id: number;
    isOwner: boolean;
    isSold: boolean
}

const SoldButton = ({ id, isOwner,isSold }: SoldButtonProps) => {
    const [isLoading, setLoading] = useState(false);
    const onClick = async () => {
        const ok = window.confirm(`상품을 판매 ${isSold ? "중":"완료"} 처리하시겠습니까?`);
        if (!ok) return;
        setLoading(true);
        const deletedProduct= await onSold(id, isOwner,isSold);
        window.confirm(`${deletedProduct?.title}가 판매 ${isSold ? "중":"완료"} 처리됐습니다.`);
        setLoading(false);
    };

    return (
        <button
            onClick={onClick}
            type="button"
            className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold"
        >
            {isLoading ? "로딩 중.." : isSold ? "판매 완료" : "판매 중"}
        </button>
    );
};

export default SoldButton;