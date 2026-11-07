"use client";

import { useState } from "react";
import { ArrowUp, MessageCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/components/current-user-provider";
import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
} from "@/components/ui/message-scroller";
import { Message, MessageContent } from "@/components/ui/message";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

export function ChatWindow() {
  const { user } = useCurrentUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  function send() {
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", text },
    ]);
    setInput("");

    // Mock reply. Later this becomes a call to the backend.
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: "This is a placeholder reply. The real assistant comes later.",
        },
      ]);
    }, 600);
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b px-6 py-3">
        <div>
          <h1 className="text-sm font-semibold">AI Assistant</h1>
          <p className="text-xs text-muted-foreground">
            Ask questions about your project documents
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMessages([])}
          aria-label="New thread"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </header>

      <div className="relative min-h-0 flex-1">
        {messages.length === 0 && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <MessageCircle className="h-5 w-5 text-muted-foreground" />
            </div>
            <h2 className="font-semibold">Good morning, {user.name}!</h2>
            <h2 className="font-semibold">How can I help you today?</h2>
            <p className="max-w-xs text-sm text-muted-foreground">
              Ask about your project documents, BOQs, or specifications.
            </p>
          </div>
        )}

        <MessageScrollerProvider autoScroll>
          <MessageScroller>
            <MessageScrollerViewport>
              <MessageScrollerContent className="mx-auto w-full max-w-3xl space-y-4 px-4 py-6">
                {messages.map((m) => (
                  <MessageScrollerItem
                    key={m.id}
                    messageId={m.id}
                    scrollAnchor={m.role === "user"}
                  >
                    {m.role === "user" ? (
                      <Message align="end">
                        <MessageContent>
                          <Bubble align="end" variant="muted">
                            <BubbleContent>{m.text}</BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    ) : (
                      <Message align="start">
                        <MessageContent>
                          <p className="text-sm leading-relaxed">{m.text}</p>
                        </MessageContent>
                      </Message>
                    )}
                  </MessageScrollerItem>
                ))}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </MessageScrollerProvider>
      </div>

      <div className="mx-auto w-full max-w-3xl px-4 pb-6 pt-2">
        <InputGroup className="rounded-3xl border-0 bg-muted">
          <InputGroupTextarea
            placeholder="Ask about your project..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          <InputGroupAddon align="block-end">
            <InputGroupButton
              onClick={send}
              aria-label="Send"
              className="ml-auto rounded-full bg-blue-600 text-white hover:bg-blue-700"
            >
              <ArrowUp className="h-4 w-4" />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  );
}