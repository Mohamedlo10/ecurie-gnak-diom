// components/ChatMessage.js
export default function ChatMessage({ message }: { message: any }) {
  const { text, isUser } = message;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-xs md:max-w-md p-3 rounded-lg ${
          isUser
            ? "bg-red-500 text-white rounded-br-none"
            : "bg-white border rounded-bl-none"
        }`}
      >
        {text}
      </div>
    </div>
  );
}
