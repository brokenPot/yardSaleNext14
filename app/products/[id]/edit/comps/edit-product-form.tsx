"use client";

import Input from "@/components/input";
import {useState} from "react";
import {ArrowPathIcon, PhotoIcon} from "@heroicons/react/24/solid";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProduct } from "../actions";
import {productSchema,ProductType} from "../schema";
import {MB, PLZ_ADD_PHOTO} from "@/lib/constants";
import ProductAddBtn from "@/components/productAddBtn";
import { useRouter } from "next/navigation";



export default function EditProductForm({
                                            productId,
                                            image,
                                            title,
                                            price,
                                            description,
                                        }: ProductType) {
    const router = useRouter();
    const [preview, setPreview] = useState(image);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ProductType>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            image,
            title,
            price,
            description,
        },
    });

    const isOversizeImage = (file: File): boolean => {
        if (file.size > 5 * MB) {
            alert('파일 크기가 5MB를 초과했습니다.');
            return true;
        }
        return false;
    };
    const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { files },
        } = event;
        if (!files) return;
        const file = files[0];
        if (isOversizeImage(file)) return; // 파일 용량 체크
        const url = URL.createObjectURL(file);
        setPreview(url);
        setValue(
            "image",
            file
        );
    };

    const reset = () => setPreview('');

    const onSubmitData = handleSubmit(async (data: ProductType) => {
        if (!preview) {
            alert(PLZ_ADD_PHOTO);
            return;
        }
        const formData = new FormData();
        formData.append("productId",  productId as any);
        formData.append("image", data.image);
        formData.append("title", data.title);
        formData.append("price",   data.price as any);
        formData.append("description", data.description);
        const errors = await editProduct(formData);
        if (errors) {
            console.log(errors);
        }
    });
    const onValid = async () => {
        await onSubmitData();
    };

    return (
        <form action={onValid} className="p-5 flex flex-col gap-5">
            <label
                htmlFor="image"
                className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
                style={{
                    backgroundImage: `url(${preview})`,
                }}
            >
                {preview === "" ? (
                    <>
                        <PhotoIcon className="w-20"/>
                        <div className="text-neutral-400 text-sm">
                            사진을 추가해주세요.
                            {/*{errors.image?.message}*/}
                        </div>
                    </>
                ) : null}
            </label>
            <input
                onChange={onImageChange}
                type="file"
                id="image"
                name="image"
                accept="image/*"
                className="hidden"
            />
            <Input
                required
                placeholder="제목"
                type="text"
                {...register("title")}
                errors={[errors.title?.message ?? ""]}
            />
            <Input
                type="number"
                required
                placeholder="가격"
                {...register("price")}
                errors={[errors.price?.message ?? ""]}
            />
            <Input
                type="text"
                required
                placeholder="자세한 설명"
                {...register("description")}
                errors={[errors.description?.message ?? ""]}
            />
            <div className="flex gap-2 mx-auto">
                <ProductAddBtn type="submit" text={'작성완료'}/>
                <ProductAddBtn
                    type="reset"
                    onClick={reset}
                    icon={<ArrowPathIcon className="size-4 text-white"/>}
                    text={'초기화'}
                />
                <ProductAddBtn type="button" href="/products" text={'돌아가기'} onClick={() => router.push(`/products/${productId}`)}/>
            </div>
        </form>
    );
}