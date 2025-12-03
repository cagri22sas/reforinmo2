import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, X, Send, Minimize2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { motion, AnimatePresence } from "motion/react";
import type { Id } from "@/convex/_generated/dataModel.d.ts";

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [conversationId, setConversationId] = useState<Id<"chatConversations"> | null>(null);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [hasStarted, setHasStarted] = useState(false);

  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getOrCreateConversation = useMutation(api.chat.getOrCreateConversation);
  const sendMessageMutation = useMutation(api.chat.sendMessage);
  const myConversation = useQuery(api.chat.getMyConversation);
  const messages = useQuery(
    api.chat.getMessages,
    conversationId ? { conversationId } : "skip"
  );

  // Auto-load conversation for authenticated users
  useEffect(() => {
    if (user && myConversation && !conversationId) {
      setConversationId(myConversation._id);
      setHasStarted(true);
    }
  }, [user, myConversation, conversationId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStartChat = async () => {
    if (!user && (!guestName || !guestEmail)) {
      return;
    }

    const convId = await getOrCreateConversation({
      guestName: user ? undefined : guestName,
      guestEmail: user ? undefined : guestEmail,
    });

    setConversationId(convId);
    setHasStarted(true);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !conversationId) return;

    await sendMessageMutation({
      conversationId,
      message: message.trim(),
      senderName: user?.profile.name || guestName || "Guest",
    });

    setMessage("");
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              size="lg"
              onClick={() => setIsOpen(true)}
              className="h-14 w-14 rounded-full shadow-2xl hover:shadow-primary/40 transition-all duration-300"
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)]"
          >
            <Card className="shadow-2xl border-2">
              {/* Header */}
              <CardHeader className="bg-primary text-primary-foreground rounded-t-lg p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Live Support
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="h-8 w-8 p-0 hover:bg-primary-foreground/10 text-primary-foreground"
                    >
                      <Minimize2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsOpen(false)}
                      className="h-8 w-8 p-0 hover:bg-primary-foreground/10 text-primary-foreground"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Content */}
              {!isMinimized && (
                <CardContent className="p-4">
                  {!hasStarted ? (
                    // Start Chat Form
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {user
                          ? "Start a conversation with our support team"
                          : "Please provide your details to start chatting"}
                      </p>
                      {!user && (
                        <>
                          <Input
                            placeholder="Your name"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                          />
                          <Input
                            type="email"
                            placeholder="Your email"
                            value={guestEmail}
                            onChange={(e) => setGuestEmail(e.target.value)}
                          />
                        </>
                      )}
                      <Button
                        onClick={handleStartChat}
                        className="w-full"
                        disabled={!user && (!guestName || !guestEmail)}
                      >
                        Start Chat
                      </Button>
                    </div>
                  ) : (
                    // Chat Interface
                    <div className="space-y-4">
                      {/* Messages */}
                      <div className="h-[300px] overflow-y-auto space-y-3 pr-2">
                        {!messages || messages.length === 0 ? (
                          <div className="flex items-center justify-center h-full">
                            <p className="text-sm text-muted-foreground">
                              No messages yet. Say hello!
                            </p>
                          </div>
                        ) : (
                          messages.map((msg) => (
                            <div
                              key={msg._id}
                              className={`flex ${
                                msg.isAdmin ? "justify-start" : "justify-end"
                              }`}
                            >
                              <div
                                className={`max-w-[80%] rounded-lg p-3 ${
                                  msg.isAdmin
                                    ? "bg-muted"
                                    : "bg-primary text-primary-foreground"
                                }`}
                              >
                                <p className="text-xs font-semibold mb-1">
                                  {msg.senderName}
                                </p>
                                <p className="text-sm">{msg.message}</p>
                              </div>
                            </div>
                          ))
                        )}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Input */}
                      <form onSubmit={handleSendMessage} className="flex gap-2">
                        <Input
                          placeholder="Type your message..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                        />
                        <Button type="submit" size="icon" disabled={!message.trim()}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
