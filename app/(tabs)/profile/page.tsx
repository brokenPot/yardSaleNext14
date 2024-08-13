import React, {Suspense} from "react";
import {getUser, logOut} from "@/app/(tabs)/profile/actions";
import Link from "next/link";
import FormButton from "@/components/form-btn";
import Image from "next/image";
import Item from "@/components/item";


async function  MiniProfile({user}:any) {
    return (
            <div className="flex justify-between items-center">
                <div className="flex items-center mt-4 space-x-3">
                    {user?.avatar ?
                        (<Image
                            width={100}
                            height={100}
                            src={user.avatar}
                            alt={user.name}
                            priority
                            unoptimized
                        />)
                        : (
                            <div className="w-16 h-16 bg-slate-500 rounded-full"/>
                        )}
                    <div className="flex flex-col">
                        <span className="font-medium text-white">{user?.name}</span>
                        <Link href="/profile/edit">
                            <span className="text-sm text-white">Edit profile &rarr;</span>
                        </Link>
                    </div>
                </div>
                <form action={logOut}>
                    <FormButton text={'Logout'}/>
                </form>
            </div>
    );
};

export default async function Profile() {
    const user = await getUser();

    return (
        <div className="py-10 px-4">
            <Suspense fallback={"Loading Mini Profile"}>
                <MiniProfile user={user}/>
            </Suspense>
            <div className="mt-10 flex justify-around">
                <Link href="/profile/sold">
                    <span className="flex flex-col items-center">
                        <div className="w-14 h-14 text-white bg-blue-400 rounded-full flex items-center justify-center">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                ></path>
                            </svg>
                        </div>
                        <span className="text-sm mt-2 font-medium text-white">
                판매완료
              </span>
                    </span>
                </Link>
                <Link href="/profile/bought">
                    <span className="flex flex-col items-center">
                        <div className="w-14 h-14 text-white bg-blue-400 rounded-full flex items-center justify-center">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                ></path>
                            </svg>
                        </div>
                        <span className="text-sm mt-2 font-medium text-white">
                구매완료
              </span>
                    </span>
                </Link>
                <Link href="/profile/loved">
                    <span className="flex flex-col items-center">
                        <div className="w-14 h-14 text-white bg-blue-400 rounded-full flex items-center justify-center">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                ></path>
                            </svg>
                        </div>
                        <span className="text-sm mt-2 font-medium text-white">
                관심목록
              </span>
                    </span>
                </Link>
            </div>
            <div className="pt-5">
                <span className="font-bold text-white">판매 중</span>
                <hr className="h-px my-2 bg-gray-700 border-0"/>
            </div>
            {user?.products?.length! > 0 ?
                (user?.products?.map((product: any) => (
                    <Item
                        key={product.id}
                        id={product.id}
                        title={product.title}
                        image={product.image}
                        price={product.price}
                    />
                )))
                : <div>판매하는 상품이 없습니다</div>}
        </div>
    )
        ;
}