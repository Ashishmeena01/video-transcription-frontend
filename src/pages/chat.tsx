import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { LoaderCircle, Send } from "lucide-react";
import Navbar from "@/components/navbar";
import { ApiError, sendChatMessage } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Ask me anything — powered by Gemini on your backend.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const result = await sendChatMessage(text);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: result.response || "No response.",
        },
      ]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Chat request failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(200,245,66,0.07),transparent_45%)]" />
      <Navbar />

      <main className="relative z-10 mx-auto flex w-11/12 max-w-3xl flex-1 flex-col py-6">
        <div className="mb-[4px] space-y-px">
          <h1 className="font-(family-name:--font-display) text-3xl tracking-tight">
            Chat
          </h1>
          <p className="text-sm text-foreground/50">Talk with Gemini through your API.</p>
        </div>

        <div className="flex-1 space-y-[3px] overflow-y-auto rounded-2xl border border-[white]/10 bg-[white]/3 p-[4px]">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-[10px] py-[3px] text-sm leading-relaxed ${message.role === "user"
                  ? "bg-[#c8f542]/20 text-black"
                  : "bg-[white]/10 text-foreground/90"
                  }`}
              >
                {message.content}
              </div>
            </motion.div>
          ))}

          {loading && (
            <div className="flex items-center gap-[2px] text-foreground/50">
              <LoaderCircle className="size-[px] animate-spin" />
              Thinking…
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {error && (
          <p className="mt-[5px] rounded-lg border border-[red]/30 bg-[red]/10 px-[10px] py-[10px] text-sm text-red-200">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-[4px] flex items-center gap-[2px] mb-[4px]">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message…"
            disabled={loading}
            className="h-[30px] mb-[4px] flex-1 rounded-xl border border-[white]/15 bg-[white]/5 px-[4px] text-sm text-foreground outline-none placeholder:text-foreground/35 focus:border-[#c8f542]/50"
          />
          <Send className="size-[20]" />
        </form>
      </main>
    </div>
  );
}

export default Chat;
