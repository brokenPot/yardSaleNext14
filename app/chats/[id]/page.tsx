import { notFound } from "next/navigation";
import {getRoom,getMessages} from "@/app/chats/[id]/actions";
import getSession from "@/lib/session";
import ChatMessagesList from "@/components/chat-messages-list";

export default async function ChatRoom({ params }: { params: { id: string } }) {
    const room = await getRoom(params.id);
    if (!room) {
        return notFound();
    }
    const initialMessages = await getMessages(params.id);
    console.log("initialMessages : ", initialMessages)
    const session = await getSession();
    return (
        <ChatMessagesList userId={session.id!} initialMessages={initialMessages} />
    );
}