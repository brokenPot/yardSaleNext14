"use client";

import _Input from "@/components/input";
import ProductAddBtn from "@/components/productAddBtn";
import { useRouter } from "next/navigation";
import {postSchema, PostType} from "@/app/life/add/schema";
import { ProductType} from "@/app/products/[id]/edit/schema";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {updatePost} from "@/app/posts/[id]/edit/actions";

export default function EditPostForm({
                                         id,
                                         title,
                                         description,
                                     }: PostType) {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProductType>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            title,
            description,
        },
    });
    const onSubmitData = handleSubmit(async (data: ProductType) => {
        const formData = new FormData();
        formData.append("id",  id as any);
        formData.append("title", data.title);
        formData.append("description", data.description);
        const errors = await updatePost(formData);
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
                <_Input
                    type="text"
                    required
                    placeholder={title}
                    {...register("title")}
                    errors={[errors.title?.message ?? ""]}
                />
                <_Input
                    type="text"
                    required
                    placeholder={description}
                    {...register("description")}
                    errors={[errors.description?.message ?? ""]}
                />
                <div className="flex gap-2 mx-auto">
                    <ProductAddBtn type="submit" text={'수정 완료'}/>
                    <ProductAddBtn type="button" href="/posts" text={'돌아가기'} onClick={() => router.push("/")}/>
                </div>
            </form>
        </div>
    );
}