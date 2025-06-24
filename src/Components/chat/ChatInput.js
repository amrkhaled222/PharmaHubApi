import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react"; // Import emoji picker component
import Image from "next/image";

export default function ChatInput({ onSubmit }) {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && message.trim()) {
      handleSubmit();
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji); // Append emoji to the message
    setShowEmojiPicker(false); // Close emoji picker after selection
  };

  const handleSubmit = () => {
    if (message.trim()) {
      onSubmit(message.trim());
      setMessage(""); // Clear the input field after submission
    }
  };

  return (
    <div className="relative w-full  h-full">
      <div className="  absolute -bottom-16 left-0 w-full p-4 flex items-center  gap-2">
        {/* Input Section */}
        <div className="flex items-center bg-gray-100 rounded-[16px] p-2 shadow-md flex-1">
          <input
            type="text"
            className="flex-1 outline-none px-4 py-1 rounded-sm bg-gray-100"
            placeholder="Type a message..."
            value={message}
            onChange={handleInputChange}
            onKeyUp={handleKeyPress}
          />
          <button
            type="button"
            className="mx-2 text-gray-500 hover:text-blue-600"
            onClick={() => setShowEmojiPicker((prev) => !prev)} // Toggle emoji picker
          >
            <Image
              src={"/icons/smile.svg"}
              alt="smile"
              width={32}
              height={32}
            />
          </button>
        </div>
        <button
          type="button"
          className="bg-mainColor text-white rounded-full p-2 hover:bg-teal-600 w-[40px] h-[40px]  "
          onClick={handleSubmit}
        >
          <Image
            src={"/icons/sendIcon.svg"}
            alt="send"
            width={24}
            height={24}
          />
        </button>
        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="absolute bottom-12 left-2 z-10 bg-white shadow-lg rounded-md">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
    </div>
  );
}
