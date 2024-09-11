import { notFound } from "next/navigation";
import EditPostForm from "@/app/posts/[id]/comps/EditPostForm";
import {getPost} from "@/app/posts/[id]/actions";

export default async function EditProduct({
                                              params,
                                          }: {
    params: { id: string };
}) {
    const id = Number(params.id);
    if (isNaN(id)) {
        return notFound();
    }
    const post = await getPost(id);
    if (post === null) {
        return notFound();
    }
    return (
        <EditPostForm
            id={id}
            title={post.title!}
            description={post.description!}
        />
    );
}