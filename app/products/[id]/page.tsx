
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import {notFound, redirect} from "next/navigation";
import {
    revalidateTag,
} from "next/cache";
import { FindRoomWithBothUsers, getProduct, getProductTitle} from "@/app/products/[id]/actions";
import getSession from "@/lib/session";
import { unstable_cache as nextCache } from "next/cache";
import DeleteButton from "@/app/products/[id]/edit/delete-button";
import db from "@/lib/db";

const getCachedProductTitle = nextCache(getProductTitle, ["product-title"], {
    tags: ["product-title", "product-detail"],
});

export async function getIsOwner(userId: number) {
    const session = await getSession();
    if (session.id) {
        return session.id === userId;
    }
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
    // const router = useRouter();

    const id = Number(params.id);
    if (isNaN(id)) {
        return notFound();
    }
    const product = await getProduct(id);
    if (!product) {
        return notFound();
    }
    const revalidate = async () => {
        "use server";
        // revalidateTag("product-title");

        // getCachedProduct, getCachedProductTitle의 태그 배열에 "xxxx"가 있다면 캐시 새로고침
        revalidateTag("product-title",);
    };

    const createChatRoom = async () => {
        "use server";
        const session = await getSession();
        const currentRoom = product.ChatRoom;
        const isRoomExist = await FindRoomWithBothUsers(
            currentRoom,
            product.userId,
            +session.id!
        );
        if (isRoomExist.length > 0) {
            redirect(`/chats/${isRoomExist[0].id}`);
        } else {
            const room = await db.chatRoom.create({
                data: {
                    users: {
                        connect: [
                            {
                                id: product.userId,
                            },
                            {
                                id: session.id,
                            },
                        ],
                    },
                    product: {
                        connect: {
                            id: product.id,
                        },
                    },
                },
                select: {
                    id: true,
                },
            });
            redirect(`/chats/${room.id}`);
        }
    };
    const isOwner = await getIsOwner(product.userId);

    return (
        <div className="pt-20 pb-40 relative">
            <div
                className="fixed top-0 p-5  w-full bg-neutral-800  flex justify-items-start align-middle max-w-screen-sm z-50">
                <Link
                    className="bg-blue-500 px-5 py-2.5 rounded-md text-white font-semibold z-1"
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
            <div className="p-5 flex items-center gap-3 border-b border-neutral-700 ">
                <Link className="cursor-pointer" href={ isOwner ? '/profile' : `/profile/${product.user.id}`}>
                    <div className="size-10 overflow-hidden rounded-full">
                        {product.user.avatar !== null ? (
                            <Image
                                src={product.user.avatar}
                                width={40}
                                height={40}
                                style={{ width: 40, height: 40 }}
                                alt={product.user.name}
                            />
                        ) : (
                            <UserIcon/>
                        )}
                    </div>
                </Link>
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
                <section className="flex gap-2 items-center">
                    {isOwner && (
                        <form action={revalidate}>
                            <button className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">
                                Revalidate title cache
                            </button>
                        </form>
                    ) }
                    {isOwner && (<Link
                        className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold"
                        href={`/products/${product.id}/edit`}
                    >
                        Edit
                    </Link>)}
                    <DeleteButton id={id} isOwner={isOwner}/>
                    {!isOwner && (<form action={createChatRoom}>
                        <button className="bg-blue-500 px-5 py-2.5 rounded-md text-white font-semibold">
                            채팅하기
                        </button>
                    </form>)}
                </section>
            </div>
        </div>
    );
}

