import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { PRESET_CHAT_PROMPTS } from '../data/curriculumData';
import { Sparkles, Send, Bot, User, Trash2, X, ChevronDown, MessageSquare, Terminal } from 'lucide-react';

interface AiTutorProps {
  initialQuestion?: string;
  isOpenInline?: boolean;
  onClose?: () => void;
}

export default function AiTutor({ initialQuestion, isOpenInline = true, onClose }: AiTutorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      role: 'model',
      text: "👋 Welcome to **LearnStack AI Tutor**! I'm your dedicated assistant for software engineering, computer science, machine learning, and deep neural networks. Ask me anything or select a topic chip below!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle passed initial question
  useEffect(() => {
    if (initialQuestion && initialQuestion.trim()) {
      handleSendMessage(initialQuestion);
    }
  }, [initialQuestion]);

  const handleSendMessage = async (customText?: string) => {
    const queryText = customText || inputPrompt;
    if (!queryText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputPrompt('');
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));
      historyPayload.push({ role: 'user', text: queryText });

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyPayload,
          topic: 'Computer Science & Neural Networks',
        }),
      });

      const data = await res.json();
      const botReply = data.text || 'I apologize, I could not process that query.';

      const modelMsg: ChatMessage = {
        id: `m-${Date.now()}`,
        role: 'model',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `e-${Date.now()}`,
        role: 'model',
        text: "I experienced a temporary connection hiccup. Here's a key takeaway on neural networks: Artificial neurons compute weighted sums $Z = W \\cdot X + B$ and apply non-linear activations like ReLU to model complex decision boundaries!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'm-reset',
        role: 'model',
        text: 'Chat history cleared. What would you like to learn next?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <section id="tutor" className="py-16 bg-[#F5EFE6] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Tutor Section Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFE5D9] border border-[#D6C5B3] text-xs font-mono text-[#8C4A1B] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#A6632B] animate-pulse" />
              <span>Gemini 3.6 AI Assistant</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#2A1E17]">
              Interactive AI Tutor
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearChat}
              title="Clear chat history"
              className="p-2 rounded-xl bg-[#EFE5D9] hover:bg-[#E0D3C1] border border-[#D6C5B3] text-[#6E5D4F] hover:text-[#2A1E17] text-xs font-mono flex items-center gap-1.5 transition-colors font-medium"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear Chat</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-[#EFE5D9] hover:bg-[#E0D3C1] border border-[#D6C5B3] text-[#6E5D4F] hover:text-[#2A1E17]"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Main Chat Box Container */}
        <div className="rounded-2xl bg-[#FAF4ED] border border-[#D6C5B3] shadow-xl overflow-hidden flex flex-col h-[560px]">
          
          {/* Chat Messages Log */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center font-mono text-xs ${
                    isUser
                      ? 'bg-gradient-to-tr from-[#A6632B] to-[#C77A38] text-white'
                      : 'bg-[#EFE5D9] border border-[#D6C5B3] text-[#8C4A1B]'
                  }`}>
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  {/* Message Bubble */}
                  <div className={`space-y-1 ${isUser ? 'items-end text-right' : 'items-start'}`}>
                    <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-gradient-to-r from-[#A6632B] via-[#C77A38] to-[#8C4A1B] text-white font-medium rounded-tr-none'
                        : 'bg-[#EFE5D9] border border-[#D6C5B3] text-[#2A1E17] rounded-tl-none'
                    }`}>
                      {/* Simplified Markdown rendering */}
                      {msg.text.split('\n\n').map((paragraph, pIdx) => {
                        if (paragraph.startsWith('```')) {
                          const lines = paragraph.split('\n');
                          const code = lines.slice(1, -1).join('\n');
                          return (
                            <div key={pIdx} className="my-2 rounded-lg bg-[#FAF4ED] border border-[#D6C5B3] overflow-hidden">
                              <div className="px-2.5 py-1 bg-[#EFE5D9] border-b border-[#D6C5B3] flex justify-between items-center text-[10px] font-mono text-[#6E5D4F]">
                                <span>Code Snippet</span>
                                <button
                                  type="button"
                                  onClick={() => navigator.clipboard.writeText(code)}
                                  className="text-[#8C4A1B] hover:underline font-bold"
                                >
                                  Copy
                                </button>
                              </div>
                              <pre className="p-3 font-mono text-xs text-[#8C4A1B] overflow-x-auto whitespace-pre font-semibold">
                                <code>{code}</code>
                              </pre>
                            </div>
                          );
                        }
                        return <p key={pIdx} className="my-1">{paragraph}</p>;
                      })}
                    </div>

                    <div className="text-[10px] font-mono text-[#6E5D4F] px-1 font-medium">
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-3 mr-auto">
                <div className="w-8 h-8 rounded-xl bg-[#EFE5D9] border border-[#D6C5B3] text-[#8C4A1B] flex items-center justify-center">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="p-3.5 rounded-2xl bg-[#EFE5D9] border border-[#D6C5B3] text-xs font-mono text-[#6E5D4F] flex items-center gap-2 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#A6632B] animate-ping" />
                  <span>LearnStack AI is generating explanation...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Preset Question Prompt Chips */}
          <div className="px-4 py-2.5 bg-[#EFE5D9]/80 border-t border-[#D6C5B3] flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] font-mono text-[#6E5D4F] font-semibold shrink-0">Try asking:</span>
            {PRESET_CHAT_PROMPTS.map((promptText, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(promptText)}
                className="px-3 py-1 rounded-lg bg-[#FAF4ED] hover:bg-[#E0D3C1] border border-[#D6C5B3] text-[11px] font-mono text-[#8C4A1B] font-medium whitespace-nowrap transition-colors shrink-0"
              >
                {promptText}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#EFE5D9] border-t border-[#D6C5B3] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ask anything about Python, neural nets, or algorithm complexity..."
              className="flex-1 px-4 py-3 rounded-xl bg-[#FAF4ED] border border-[#D6C5B3] text-xs sm:text-sm text-[#2A1E17] placeholder-[#9E8E80] focus:outline-none focus:border-[#A6632B] font-mono transition-colors"
            />

            <button
              type="submit"
              disabled={!inputPrompt.trim() || isLoading}
              className="p-3 rounded-xl bg-gradient-to-r from-[#A6632B] via-[#C77A38] to-[#8C4A1B] text-white disabled:opacity-50 font-bold transition-all hover:scale-[1.03] active:scale-[0.97]"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>
    </section>
  );
}
