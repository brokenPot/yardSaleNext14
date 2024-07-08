"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon,ArrowPathIcon } from "@heroicons/react/24/solid";
import {FormEvent, useEffect, useState} from "react";
import { uploadProduct } from "./actions";
import {MB, PLZ_ADD_PHOTO} from "@/lib/constants";
import { useFormState } from "react-dom";
import ProductAddBtn from "@/components/productAddBtn";
import { useRouter } from "next/navigation";

export default function AddProduct() {
    const router = useRouter();
    const [preview, setPreview] = useState("");

    const isOversizeImage = (file: File): boolean => {
        if (file.size > 2 * MB) {
            alert('파일 크기가 2MB를 초과했습니다.');
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
    };
    const reset = () => setPreview('');

    const onSubmitData = (event: FormEvent) => {
        if (!preview) {
            event.preventDefault();
            alert(PLZ_ADD_PHOTO);
            return;
        }
    };
    const [state, action] = useFormState(uploadProduct, null);
    return (
        <div>
            <form action={action} onSubmit={(e) => onSubmitData(e)} className="p-5 flex flex-col gap-5">
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
                                {state?.fieldErrors.photo}
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
                <Input
                    name="title"
                    required
                    placeholder="제목"
                    type="text"
                    errors={state?.fieldErrors.title}
                />
                <Input
                    name="price"
                    type="number"
                    required
                    placeholder="가격"
                    errors={state?.fieldErrors.price}
                />
                <Input
                    name="description"
                    type="text"
                    required
                    placeholder="자세한 설명"
                    errors={state?.fieldErrors.description}
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