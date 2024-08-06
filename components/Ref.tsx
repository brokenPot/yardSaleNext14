"use client";
import dog from "@/public/dog.jpg"
import { formatToTimeAgo } from "@/lib/utils";
import {ArrowUpCircleIcon} from "@heroicons/react/24/solid";
import {RealtimeChannel, createClient} from "@supabase/supabase-js";
import Image from "next/image";
import {useEffect, useRef, useState} from "react";
import {InitialChatMessages, saveMessage} from "@/app/chats/[id]/actions";

interface ChatMessageListProps {
    initialMessages: InitialChatMessages;
    userId: number;
    username:string;
    avatar:string;
    chatRoomId: string;
}

export default function ChatMessagesList({
                                             initialMessages,
                                             userId,
                                             chatRoomId,
                                             username,
                                             avatar,
                                         }: ChatMessageListProps) {
    const [messages, setMessages] = useState(initialMessages);
    const [message, setMessage] = useState("");
    const channel = useRef<RealtimeChannel>();
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { value },
        } = event;
        setMessage(value);
    };
    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const newMessage = {
            id: Date.now(),
            payload: message,
            created_at: new Date(),
            isRead: false,
            userId,
            user: {
                name: "string",
                avatar: "xxx",
            },
        };
        setMessages((prevMsgs) => [...prevMsgs, newMessage]);
        channel.current?.send({
            type: "broadcast",
            event: "message",
            payload: {
                id: Date.now(),
                payload: message,
                created_at: new Date(),
                userId,
                isRead: false,
                user: {
                    username,
                    avatar,
                },
            },
        });
        await saveMessage(message, chatRoomId);
        setMessage("");

        // 스크롤을 페이지의 맨 아래로 이동
        window.scrollTo(0, document.body.scrollHeight);
    };

    useEffect(() => {
        const client = createClient(process.env.NEXT_PUBLIC_SUPERBASE_URL!,  process.env.NEXT_PUBLIC_SUPERBASE_PUBLIC_API_KEY!);
        channel.current = client.channel(`room-${chatRoomId}`);
        channel.current
            .on("broadcast", { event: "message" }, (payload) => {
                setMessages((prevMsgs) => [...prevMsgs, payload.payload]);

                // 메시지가 업데이트될 때마다 스크롤 위치를 조정
                window.scrollTo(0, document.body.scrollHeight);
            })
            .subscribe();
        return () => {
            channel.current?.unsubscribe();
        };
    }, [chatRoomId]);

    // 화면에 처음 접근했을 때 스크롤 위치를 맨 아래로 설정
    useEffect(() => {
        window.scrollTo(0, document.body.scrollHeight);
    }, []);

    return (
        <div className="p-5 flex flex-col gap-5 min-h-screen justify-end ">
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={`flex gap-2 items-start ${
                        message.userId === userId ? "justify-end" : ""
                    }`}
                >
                    {message.userId === userId ? null : (
                        message.user.avatar !== null ? (
                            <Image
                                src={message.user.avatar ? message.user.avatar : ""}
                                alt={message.user.name}
                                width={50}
                                height={50}
                                className="size-8 rounded-full"
                            />
                        ) : (
                            <Image
                                src={dog}
                                alt={message.user.name}
                                width={50}
                                height={50}
                                className="size-8 rounded-full"
                            />
                        )
                    )}
                    <div
                        className={`flex flex-col gap-1 ${
                            message.userId === userId ? "items-end" : ""
                        }`}
                    >
            <span
                className={`${
                    message.userId === userId ? "bg-neutral-500" : "bg-orange-500"
                } p-2.5 rounded-md`}
            >
              {message.payload}
            </span>
                        <span className="text-xs">
              {formatToTimeAgo(message.created_at.toString())}
            </span>
                    </div>
                </div>
            ))}
            {/*fixed w-full max-w-screen-md justify-center*/}
            <form className="mx-auto fixed inset-x-0 bottom-0 max-w-md" onSubmit={onSubmit}>
                <input
                    required
                    onChange={onChange}
                    value={message}
                    className="bg-transparent bg-white rounded-full w-full h-10 focus:outline-none px-5 ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-neutral-50 border-none placeholder:text-neutral-400"
                    type="text"
                    name="message"
                    placeholder="Write a message..."
                />
                <button className="absolute right-0">
                    <ArrowUpCircleIcon className="size-10 text-blue-500 transition-colors hover:text-blue-300"/>
                </button>
            </form>
        </div>
    );
}
