import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import AdminLayout from "@/components/AdminLayout.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import type { Id } from "@/convex/_generated/dataModel.d.ts";

export default function AdminChatPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<Id<"chatConversations"> | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversations = useQuery(api.admin.chat.listConversations);
  const messages = useQuery(
    api.chat.getMessages,
    selectedConversationId ? { conversationId: selectedConversationId } : "skip"
  );

  const sendReply = useMutation(api.admin.chat.sendAdminReply);
  const updateStatus = useMutation(api.admin.chat.updateStatus);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedConversationId) return;

    try {
      await sendReply({
        conversationId: selectedConversationId,
        message: replyMessage.trim(),
      });
      setReplyMessage("");
    } catch (error) {
      if (error instanceof ConvexError) {
        const { message } = error.data as { code: string; message: string };
        toast.error(message);
      } else {
        toast.error("Failed to send reply");
      }
    }
  };

  const handleStatusChange = async (conversationId: Id<"chatConversations">, status: "active" | "resolved" | "closed") => {
    try {
      await updateStatus({ conversationId, status });
      toast.success(`Conversation marked as ${status}`);
    } catch (error) {
      if (error instanceof ConvexError) {
        const { message } = error.data as { code: string; message: string };
        toast.error(message);
      } else {
        toast.error("Failed to update status");
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-600 border-green-600/20";
      case "resolved":
        return "bg-blue-500/10 text-blue-600 border-blue-600/20";
      case "closed":
        return "bg-gray-500/10 text-gray-600 border-gray-600/20";
      default:
        return "";
    }
  };

  const selectedConversation = conversations?.find(
    (c) => c._id === selectedConversationId
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Live Chat Support</h1>
          <p className="text-muted-foreground">Manage customer conversations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Conversations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {!conversations ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))
              ) : conversations.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No conversations yet
                </p>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv._id}
                    onClick={() => setSelectedConversationId(conv._id)}
                    className={`p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedConversationId === conv._id
                        ? "bg-muted border-primary"
                        : "bg-card"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{conv.userName}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {conv.userEmail || "No email"}
                        </p>
                      </div>
                      <Badge className={getStatusColor(conv.status)}>
                        {conv.status}
                      </Badge>
                    </div>
                    {conv.lastMessage && (
                      <p className="text-xs text-muted-foreground truncate">
                        {conv.lastMessage}
                      </p>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Chat Interface */}
          <Card className="lg:col-span-2">
            <CardHeader>
              {selectedConversation ? (
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedConversation.userName}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {selectedConversation.userEmail}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleStatusChange(selectedConversationId!, "resolved")
                      }
                      disabled={selectedConversation.status === "resolved"}
                    >
                      Resolve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleStatusChange(selectedConversationId!, "closed")
                      }
                      disabled={selectedConversation.status === "closed"}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              ) : (
                <CardTitle>Select a conversation</CardTitle>
              )}
            </CardHeader>
            <CardContent>
              {!selectedConversationId ? (
                <div className="flex items-center justify-center h-[500px]">
                  <div className="text-center">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Select a conversation to view messages
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Messages */}
                  <div className="h-[400px] overflow-y-auto space-y-3 pr-2">
                    {!messages || messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-muted-foreground">
                          No messages yet
                        </p>
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg._id}
                          className={`flex ${
                            msg.isAdmin ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              msg.isAdmin
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
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

                  {/* Reply Input */}
                  <form onSubmit={handleSendReply} className="flex gap-2">
                    <Input
                      placeholder="Type your reply..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      disabled={selectedConversation?.status === "closed"}
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={
                        !replyMessage.trim() ||
                        selectedConversation?.status === "closed"
                      }
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
