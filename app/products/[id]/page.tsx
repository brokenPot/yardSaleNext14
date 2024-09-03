import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { redirect} from "next/navigation";

import {
    fetchProductDetails,
    FindRoomWithBothUsers,
     revalidateProductTitle
} from "@/app/products/[id]/actions";
import getSession from "@/lib/session";
import DeleteButton from "@/app/products/[id]/edit/comps/delete-button";
import db from "@/lib/db";
import ProductLikeButton from "@/components/product-like-button";
import ShowLikeComp from "@/components/showLikeComp";
import SoldButton from "@/app/products/[id]/edit/comps/sold-button";

export default async function ProductDetail({
                                                params
                                            }: {
    params: { id: string };
}) {
    const id = Number(params.id);
    const { product, likeCount, isLiked, isOwner } = await fetchProductDetails(id);

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
                    className={`object-cover ${product.isSold ? "opacity-20" : ""}`}
                    fill
                    src={product.image}
                    alt={product.title}
                    priority
                />
                {product.isSold ? <div className="absolute  top-72 left-72 font-bold text-xl ">판매 완료</div> : null}
            </div>
            <div className="p-5 flex items-center gap-3 border-b border-neutral-700 ">
                <Link className="cursor-pointer" href={ isOwner ? '/profile' : `/profile/${product.user.id}`}>
                    <div className="size-10 overflow-hidden rounded-full">
                        {product.user.avatar !== null ? (
                            <Image
                                src={product.user.avatar}
                                width={40}
                                height={40}
                                style={{ width: 40, height: 40}}
                                alt={product.user.name}
                            />
                        ) : (
                            <UserIcon/>
                        )}
                    </div>
                </Link>
                <div>
                    <h3>{product.user.name}</h3>
                    <h3>{product.user.roadAddress}</h3>
                </div>
            </div>
            <div className="flex w-full justify-between align-middle">
                <div className="p-5">
                    <h1 className="text-2xl font-semibold">{product.title}</h1>
                    <p>{product.description}</p>
                </div>
                <div className="p-5">
                    {isOwner ? <ShowLikeComp   likeCount={likeCount}  /> : <ProductLikeButton isLiked={isLiked} likeCount={likeCount} targetId={id}/>}
                </div>
            </div>
            <div
                className="fixed w-full bottom-0  p-5 pb-10 bg-neutral-800 flex justify-between items-center max-w-screen-sm">
        <span className="font-semibold text-xl">
          {formatToWon(product.price)}원
        </span>
                <section className="flex gap-2 items-center">
                    {isOwner && (
                        <form action={revalidateProductTitle}>
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
                    <SoldButton  id={id} isOwner={isOwner} isSold={product.isSold}/>
                    <DeleteButton id={id} isOwner={isOwner} />
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

