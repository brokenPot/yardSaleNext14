import { notFound } from "next/navigation";
import EditPostForm from "@/app/posts/[id]/comps/EditPostForm";
import {getPost} from "@/app/posts/[id]/actions";

export default async function EditProduct({
                                              params,
                                          }: {
    params: { id: string };
}) {
    const { id } = await params;
    const numericId = Number(id);

    // const id = Number(params.id);

    if (isNaN(numericId)) {
        return notFound();
    }
    const post = await getPost(numericId);
    if (post === null) {
        return notFound();
    }
    return (
        <EditPostForm
            id={numericId}
            title={post.title!}
            description={post.description!}
        />
    );
}