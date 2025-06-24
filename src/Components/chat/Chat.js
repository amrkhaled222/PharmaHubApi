import { useUser } from "@/context/User";
import api from "@/utilities/api";
import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import Spinner from "../ui/Spinner";
import TextInput from "../input/TextInput";
import ChatInput from "./ChatInput";
import { socket } from "@/app/dashboard/messages/layout";
import { getHeightAboveComponent } from "@/utilities/function";
export default function Chat({ ChatID, ReceiverID }) {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);

  const {
    user: { id: UserID },
  } = useUser();
  const ChatMessageRef = useRef();
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get(`/chat/${ChatID}`);
        setMessages(response.data.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
        if (ChatMessageRef.current) {
          ChatMessageRef.current.scrollTop =
            ChatMessageRef.current.scrollHeight;
        }
      }
    };
    fetchMessages();
  }, [ChatID]);

  const sendMessage = async (message) => {
    socket.emit(
      "sendMessage",
      { senderID: UserID, receiverID: ReceiverID, message, ChatID },
      (response) => {
        if (!ChatID) {
          ChatID = response.ChatID;
        }
        console.log(response.sentMessage);
        setMessages((prevMessages) => [...prevMessages, response.sentMessage]);
      }
    );
  };

  useEffect(() => {
    socket.emit("joinChatRoom", { ChatID }, (response) => {
      console.log("Joined chat:", response);
    });
    socket.on("receiveMessage", (message) => {
      console.log("New message received:", message);
      console.log(messages);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.emit("leaveChatRoom", { ChatID }, (response) => {
        console.log("Left chat:", response);
      });
      socket.off("receiveMessage");
      console.log("Socket listener removed");
    };
  }, [ChatID]);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Spinner size="200" />
        </div>
      ) : (
        <div>
          <div
            className="flex flex-col gap-4 p-4  relative overflow-y-auto "
            style={{
              height:
                window.innerHeight -
                getHeightAboveComponent(ChatMessageRef.current) -
                100,
            }}
            ref={ChatMessageRef}
          >
            {messages.length > 0 ? (
              <>
                {messages.map((message) => {
                  return (
                    <Message
                      key={message.ID}
                      isSender={message.Sender == UserID}
                      {...message}
                    ></Message>
                  );
                })}
              </>
            ) : (
              <p className="text-gray-600">No messages found.</p>
            )}
          </div>
          <ChatInput
            onSubmit={(msg) => {
              sendMessage(msg);
            }}
          ></ChatInput>
        </div>
      )}
    </>
  );
}
