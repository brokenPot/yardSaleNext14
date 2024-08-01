import ChatMessagesList from "@/components/chat-messages-list";
// import db from "@/lib/db";
import getSession from "@/lib/session";
// import {Prisma} from "@prisma/client";
import { notFound } from "next/navigation";
import { getMessages, getRoom, getUserInfo } from "./actions";

  export default async function ChatRoom({ params }: { params: { id: string } }) {
    const room = await getRoom(params.id);
    if (!room) {
        return notFound();
    }
    const initialMessages = await getMessages(params.id);
    const session = await getSession();
      const user = await getUserInfo();
      if (!user) {
          return notFound();
      }
    return (
        <ChatMessagesList chatRoomId={params.id} userId={session.id!}    username={user.name}
                          avatar={user.avatar!} initialMessages={initialMessages} />
    );
}