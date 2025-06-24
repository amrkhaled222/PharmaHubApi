"use client";
import { useEffect, useState, useRef, use } from "react";
import api from "@/utilities/api";
import Spinner from "@/Components/ui/Spinner";
import { getHeightAboveComponent } from "@/utilities/function";
import ChatItem from "@/Components/chat/ChatItem";
import Chat from "@/Components/chat/Chat";
import { socket } from "./layout";
import { useUser } from "@/context/User";
export default function MessagesPage() {
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const chatListRef = useRef();
  const ChatMessageRef = useRef();
  const { user: id } = useUser();
  const getChatList = async () => {
    try {
      const response = await api.get("/chat");
      setChatList(response?.data?.data);
    } catch (error) {
      console.error("Error fetching chat list:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getChatList();
  }, []);

  useEffect(() => {
    socket.emit("joinChatList", { id }, (response) => {
      console.log("Joined chat list:", response);
    });

    socket.on("newMessage", (message) => {
      console.log("New message received:", message);
      getChatList();
    });
    getChatList();
    return () => {
      socket.emit("leaveChatList", { id }, (response) => {
        console.log("Left chat list:", response);
      });
      console.log("Socket listener removed");
    };
  }, []);

  console.log(chatList);
  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Spinner size="200" />
        </div>
      ) : (
        <div className="grid grid-cols-[0.5fr_1fr]  ">
          <div
            ref={chatListRef}
            style={{
              height:
                window.innerHeight -
                getHeightAboveComponent(chatListRef?.current) -
                130,
            }}
            className="col-span-1 p-4 h-screen flex overflow-y-auto flex-col gap-4 "
          >
            {chatList.length > 0 ? (
              chatList.map((chat) => (
                <ChatItem
                  key={chat.ChatID}
                  chat={chat}
                  onClick={() => {
                    setSelectedChat(chat);
                    // Scroll to the top of the chat list when a chat is selected
                    if (chatListRef.current) {
                      chatListRef.current.scrollTop = 0;
                    }
                  }}
                />
              ))
            ) : (
              <p className="text-gray-600">No messages found.</p>
            )}
          </div>
          <div className="col-span-1 p-4  ">
            {selectedChat && (
              <Chat
                ChatMessageRef={ChatMessageRef}
                ChatID={selectedChat?.ChatID}
                ReceiverID={selectedChat?.ReceiverID}
              />
            )}
            {!selectedChat && (
              <div className="flex items-center justify-center h-full">
                <p className=" font-lexend font-lg">
                  Select a chat to view messages.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
