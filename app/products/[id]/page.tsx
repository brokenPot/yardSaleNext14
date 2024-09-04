import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import {redirect} from "next/navigation";

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
import {CiMenuKebab} from "react-icons/ci";

export default async function ProductDetail({
                                                params
                                            }: {
    params: { id: string };
}) {

    const id = Number(params.id);
    const { product, likeCount, isLiked, isOwner } = await fetchProductDetails(id);
    // const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMouseEnter = () => {
        // setIsMenuOpen(true);
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
                {product.isSold ? <div className="absolute top-36 left-36 md:top-72 md:left-72 font-bold text-xl ">판매 완료</div> : null}
            </div>
            <div className="px-1 py-5 flex items-center gap-3 border-b border-neutral-700 justify-between">
                <div className={"flex items-center"}>
                    <Link className="cursor-pointer" href={ isOwner ? '/profile' : `/profile/${product.user.id}`}>
                        <div className="size-10 overflow-hidden rounded-full mr-2">
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
                        <div className="font-semibold text-xs mb-1">{product.user.name}</div>
                        <div className="font-semibold text-xs">{product.user.roadAddress}</div>
                    </div>
                </div>
                <div className={'flex gap-2'}>
                    {/*<CiMenuKebab*/}
                    {/*    onMouseEnter={handleMouseEnter}*/}
                    {/*    size="24" color="#3b82f6" className="flex items-center space-y-10"/>*/}
                    {isOwner && (
                        <form action={revalidateProductTitle}>
                            <button className="bg-red-500 px-2  py-2.5 rounded-md text-white font-semibold text-xs w-18">
                                Revalidate
                            </button>
                        </form>
                    ) }
                    {isOwner && (<Link
                        className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-extrabold text-[10px] w-20 md:w-30"
                        href={`/products/${product.id}/edit`}
                    >
                        수정하기
                    </Link>)}
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

