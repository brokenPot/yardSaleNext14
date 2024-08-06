"use client";

import Input from "@/components/input";
import { useFormState } from "react-dom";
import ProductAddBtn from "@/components/productAddBtn";
import { useRouter } from "next/navigation";
import {uploadPost} from "@/app/life/add/actions";

export default function AddProduct() {
    const router = useRouter();
    const [state, action] = useFormState(uploadPost, null);
    return (
        <div>
            <form action={action}  className="p-5 flex flex-col gap-5">
                <Input
                    name="title"
                    required
                    placeholder="제목"
                    type="text"
                    errors={state?.fieldErrors.title}
                />
                <Input
                    name="description"
                    type="text"
                    required
                    placeholder="내용"
                    errors={state?.fieldErrors.description}
                />
                <div className="flex gap-2 mx-auto">
                    <ProductAddBtn type="submit" text={'작성완료'}/>
                    <ProductAddBtn type="button" href="/products" text={'돌아가기'} onClick={() => router.push("/")}/>
                </div>
            </form>
        </div>
    );
}