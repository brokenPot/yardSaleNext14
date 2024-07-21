import db from "@/lib/db";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    revalidateTag,
} from "next/cache";
import {getCachedProduct, getCachedProductTitle} from "@/app/products/[id]/actions";

async function getIsOwner(userId: number) {
    // const session = await getSession();
    // if (session.id) {
    //     return session.id === userId;
    // }
    return false;
}


export async function generateMetadata({ params }: { params: { id: string } }) {
    const product = await getCachedProductTitle(Number(params.id));
    return {
        title: product?.title,
    };
}

export default async function ProductDetail({
                                                params
                                            }: {
    params: { id: string };
}) {
    const id = Number(params.id);
    if (isNaN(id)) {
        return notFound();
    }
    const product = await getCachedProduct(id);
    if (!product) {
        return notFound();
    }
    const isOwner = await getIsOwner(product.userId);
    const revalidate = async () => {
        "use server";
        revalidateTag("xxxx");
    };
    return (
        <div className="pt-20 pb-40 relative">
            <div
                className="fixed top-0 p-5  w-full bg-neutral-800  flex justify-items-start align-middle max-w-screen-sm z-50">
                <Link
                    className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold z-1"
                    href={`/home`}
                >
                    뒤로가기
                </Link>
            </div>

            <div className="relative aspect-square">
                <Image
                    className="object-cover"
                    fill
                    src={product.image}
                    alt={product.title}
                    sizes="40vw"
                    priority
                />
            </div>
            <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
                <div className="size-10 overflow-hidden rounded-full">
                    {product.user.avatar !== null ? (
                        <Image
                            src={product.user.avatar}
                            width={40}
                            height={40}
                            alt={product.user.name}
                        />
                    ) : (
                        <UserIcon/>
                    )}
                </div>
                <div>
                    <h3>{product.user.name}</h3>
                </div>
            </div>
            <div className="p-5">
                <h1 className="text-2xl font-semibold">{product.title}</h1>
                <p>{product.description}</p>
            </div>
            <div
                className="fixed w-full bottom-0  p-5 pb-10 bg-neutral-800 flex justify-between items-center max-w-screen-sm">
        <span className="font-semibold text-xl">
          {formatToWon(product.price)}원
        </span>
                {isOwner ? (
                    <form action={revalidate}>
                        <button className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">
                            Revalidate title cache
                        </button>
                    </form>
                ) : null}

                <Link
                    className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold"
                    href={``}
                >
                    채팅하기
                </Link>
            </div>
        </div>
    );
}

export async function generateStaticParams() {
    const products = await db.product.findMany({
        select: {
            id: true,
        },
    });
    return products.map((product) => ({ id: product.id + "" }));
}