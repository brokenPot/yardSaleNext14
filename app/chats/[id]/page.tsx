import ChatMessagesList from "@/app/chats/[id]/comps/chat-messages-list";
import getSession from "@/lib/session";
import { notFound } from "next/navigation";
import {getMessages, getRoom, getUserInfo, markMessageAsRead} from "./actions";
import Layout from "@/components/LayoutFrame";

  export default async function ChatRoom({ params }: { params: { id: string } }) {
    const room = await getRoom(params.id);
    if (!room) {
        return notFound();
    }
    const initialMessages = await getMessages(params.id);
    const setReadMessages = initialMessages.map((message) => ({
      ...message,
      isRead: true,
    }));
    const session = await getSession();
    await markMessageAsRead(params.id);
      const user = await getUserInfo();
      if (!user) {
          return notFound();
      }
    return (
        <Layout canGoBack title={user?.id === room?.users[0].id ?  room?.users[0].name : room?.users[1].name} productName={room?.product?.title} >
          <ChatMessagesList chatRoomId={params.id} userId={session.id!} username={user.name}
                            avatar={user.avatar!} initialMessages={setReadMessages} />
        </Layout>
    );
}