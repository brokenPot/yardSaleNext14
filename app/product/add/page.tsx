"use client";

import _Input from "@/components/input";
import { PhotoIcon,ArrowPathIcon } from "@heroicons/react/24/solid";
import {useState} from "react";
import { uploadProduct } from "./actions";
import {MB, PLZ_ADD_PHOTO} from "@/lib/constants";
import ProductAddBtn from "@/components/productAddBtn";
import { useRouter } from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {productSchema, ProductType} from "@/app/product/add/schema";


export default function AddProduct() {
    const router = useRouter();
    const [preview, setPreview] = useState("");
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ProductType>({
        resolver: zodResolver(productSchema),
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
            "photo",
            file
        );
    };
    const reset = () => setPreview('');

    const onSubmit = handleSubmit(async (data: ProductType) => {
        if (!preview) {
            alert(PLZ_ADD_PHOTO);
            return;
        }
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("price", data.price as any);
        formData.append("description", data.description);
        formData.append("photo", data.photo);
        return uploadProduct(formData);
    });
    const onValid = async () => {
        await onSubmit();
    };
    return (
        <div>
            <form action={onValid}   className="p-5 flex flex-col gap-5">
                {/*리액트에서 작업할때는 인풋 포커스를 해주고 싶다면 for 대신 htmlFor*/}
                <label
                    htmlFor="photo"
                    className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
                    style={{
                        backgroundImage: `url(${preview})`,
                    }}
                >
                    {!preview && (
                        <>
                            <PhotoIcon className="w-20 group-hover:text-orange-400"/>
                            <div className="text-neutral-400 group:hover:text-orange-400 group-hover:text-orange-400">
                                {PLZ_ADD_PHOTO}
                                {/*{errors.photo?.message}*/}
                            </div>
                        </>
                    )}
                </label>
                <input
                    onChange={onImageChange}
                    type="file"
                    id="photo"
                    name="photo"
                    accept="image/*"
                    className="hidden"
                />
                <_Input
                    required
                    placeholder="제목"
                    type="text"
                    {...register("title")}
                    errors={[errors.title?.message ?? ""]}
                />
                <_Input
                    type="number"
                    required
                    placeholder="가격"
                    {...register("price")}
                    errors={[errors.price?.message ?? ""]}
                />
                <_Input
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
                    <ProductAddBtn type="button" href="/products" text={'돌아가기'} onClick={() => router.push("/")}/>
                </div>
            </form>
        </div>
    );
}