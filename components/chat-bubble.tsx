'use client';

import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';

// Các component UI của bạn
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/language-context';

import { FormattedMessage } from '@/components/ui/formatted-message';
import { TypingIndicator } from '@/components/ui/typing-indicator';

// Import API client
import { geminiApiClient } from '@/services/GeminiApiClient';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isBotReplying, setIsBotReplying] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentBotMessageId = useRef<number | null>(null);

  // Khởi tạo tin nhắn chào mừng khi mở chat
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessageText = "Xin chào! Tôi là E-Learning, trợ lý Triết học Hồ Chí Minh. Bạn muốn thảo luận hoặc đặt câu hỏi về tư tưởng đạo đức theo Hồ Chí Minh chứ?";
      geminiApiClient.resetChatHistory();
      setMessages([
        {
          id: 1,
          text: welcomeMessageText,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen]);

  // Tự động cuộn xuống tin nhắn cuối cùng
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isBotReplying]);

const handleSendMessage = async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isBotReplying) return;

    const userMessage: Message = {
      id: Date.now(),
      text: trimmedInput,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsBotReplying(true);

    try {
      const botResponseText = await geminiApiClient.generateContent(trimmedInput);
      
      // 👇 Dòng code được thêm vào để log response từ API
      console.log("API Response from Gemini:", botResponseText); 

      const botMessagePlaceholder: Message = {
        id: Date.now() + 1,
        text: '',
        isUser: false,
        timestamp: new Date(),
      };
      currentBotMessageId.current = botMessagePlaceholder.id;
      setMessages((prev) => [...prev, botMessagePlaceholder]);
      setIsBotReplying(false);

      let index = 0;
      const intervalId = setInterval(() => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === currentBotMessageId.current
              ? { ...msg, text: botResponseText.substring(0, index + 1) }
              : msg
          )
        );
        index++;
        if (index >= botResponseText.length) {
          clearInterval(intervalId);
          currentBotMessageId.current = null;
        }
      }, 2);

    } catch (error: any) {
      // Log lỗi ra console để debug dễ hơn
      console.error("API Error:", error);
      const errorMessage: Message = {
        id: Date.now() + 2,
        text: error.message || 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsBotReplying(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isBotReplying && inputValue.trim()) {
      handleSendMessage();
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
          <Card className="w-full max-w-2xl h-[70vh] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg">
                {t ? t('chat.title') : 'E-Learning'}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0 overflow-y-hidden">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.isUser ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 text-sm whitespace-pre-wrap break-words ${
                          message.isUser
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        {message.isUser ? (
                          message.text
                        ) : (
                          <FormattedMessage text={message.text} />
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isBotReplying && (
                    <div className="flex justify-start">
                       <TypingIndicator />
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              <div className="p-4 border-t flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t ? t('chat.placeholder') : 'Trò chuyện cùng E-Learning...'}
                  className="flex-1"
                  disabled={isBotReplying}
                />
                <Button onClick={handleSendMessage} size="icon" disabled={isBotReplying || !inputValue.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}