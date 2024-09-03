import React from 'react';
import Image from "next/image";

interface ProductImageTypes {
    imageUrl : string,
    isSoldOut : boolean
}

export default function ProductImage({ imageUrl, isSoldOut }:ProductImageTypes) {

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            {/* 이미지 */}
            <Image
                src={imageUrl}
                width={40}
                height={40}
                alt="Product"
                style={{
                    display: 'block',
                    width: 40,
                    height: 40,
                    filter: isSoldOut ? 'brightness(50%)' : 'none', // isSoldOut이 true이면 이미지를 어둡게 함
                }}
            />
            {/* "판매완료" 텍스트 */}
            {isSoldOut && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'white',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        fontSize: '24px',
                        fontWeight: 'bold',
                    }}
                >
                    판매완료
                </div>
            )}
        </div>
    );
}
