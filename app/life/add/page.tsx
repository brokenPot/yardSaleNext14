"use client";

import Input from "@/components/input";
import ProductAddBtn from "@/components/productAddBtn";
import { useRouter } from "next/navigation";
import {uploadPost} from "@/app/life/add/actions";
import {ProductType} from "@/app/products/[id]/edit/schema";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {postSchema,PostType} from "@/app/life/add/schema";

export default function AddPost() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PostType>({
        resolver: zodResolver(postSchema),
    });

    const onSubmitData = handleSubmit(async (data: PostType) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        const errors = await uploadPost(formData);
        if (errors) {
            console.log(errors);
        }
    });

    const onValid = async () => {
        await onSubmitData();
    };

    return (
        <div>
            <form action={onValid}  className="p-5 flex flex-col gap-5">
                <Input
                    type="text"
                    required
                    placeholder='제목'
                    {...register("title")}
                    errors={[errors.title?.message ?? ""]}
                />
                <Input
                    type="text"
                    required
                    placeholder='내용'
                    {...register("description")}
                    errors={[errors.description?.message ?? ""]}
                />
                <div className="flex gap-2 mx-auto">
                    <ProductAddBtn type="submit" text={'작성완료'}/>
                    <ProductAddBtn type="button" href="/products" text={'돌아가기'} onClick={() => router.push("/")}/>
                </div>
            </form>
        </div>
    );
}