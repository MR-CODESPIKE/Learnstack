import React, { useState, useRef, useEffect } from 'react';
import { StudyRoom, RoomMessage } from '../../data/roomsData';
import { 
  Send, Mic, Square, Play, Pause, Code, Youtube, Bot, User, Pin, 
  Settings, Copy, Check, Sparkles, Volume2, CornerDownRight, Plus, X 
} from 'lucide-react';
import RoomSettingsModal from './RoomSettingsModal';

interface RoomChatViewProps {
  room: StudyRoom;
  onUpdateRoom: (updatedRoom: StudyRoom) => void;
  onBackToList?: () => void;
}

export default function RoomChatView({ room, onUpdateRoom, onBackToList }: RoomChatViewProps) {
  const [messages, setMessages] = useState<RoomMessage[]>(room.messages);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceTimer, setVoiceTimer] = useState(0);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('python');
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const voiceIntervalRef = useRef<any>(null);

  const currentUserRole = 'admin'; // Current user is room creator / admin

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiThinking]);

  // Handle Recording Voice Timer
  useEffect(() => {
    if (isRecordingVoice) {
      setVoiceTimer(0);
      voiceIntervalRef.current = setInterval(() => {
        setVoiceTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(voiceIntervalRef.current);
    }
    return () => clearInterval(voiceIntervalRef.current);
  }, [isRecordingVoice]);

  // Extract YouTube ID helper
  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : 'aircAruvnKk';
  };

  // Helper to send message & update parent state
  const addMessageAndSync = (newMsg: RoomMessage, updatedList?: RoomMessage[]) => {
    const nextList = updatedList || [...messages, newMsg];
    setMessages(nextList);
    onUpdateRoom({
      ...room,
      messages: nextList,
    });
  };

  // Handle Standard Text or AI Command Sending
  const handleSendText = async (overrideText?: string, isAiPrompt = false) => {
    const textToSend = overrideText || inputPrompt;
    if (!textToSend.trim()) return;

    const userMsg: RoomMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'user-self',
      senderName: 'You (Student)',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      senderRole: 'admin',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
      content: textToSend.trim(),
    };

    const nextMessages = [...messages, userMsg];
    addMessageAndSync(userMsg, nextMessages);
    if (!overrideText) setInputPrompt('');

    // Check if query triggers AI Assistant or if /ask or Ask AI button was used
    const lowerText = textToSend.toLowerCase();
    const isVideoQuestion = lowerText.includes('video') || lowerText.includes('part') || lowerText.includes('around') || lowerText.includes('timestamp') || lowerText.includes('4:20') || lowerText.includes('minute');
    const isAiTriggered = isAiPrompt || lowerText.startsWith('/ask') || lowerText.includes('explain') || lowerText.includes('how') || lowerText.includes('what') || isVideoQuestion;

    if (isAiTriggered) {
      triggerRoomAiAssistant(textToSend, nextMessages);
    }
  };

  // Trigger Room AI Assistant with Video-Aware Contextual Intelligence
  const triggerRoomAiAssistant = async (query: string, currentThread: RoomMessage[]) => {
    setIsAiThinking(true);

    try {
      // Find any shared YouTube videos in recent chat history
      const sharedVideo = [...currentThread].reverse().find((m) => m.type === 'video');

      let promptPayload = query;
      if (sharedVideo && sharedVideo.videoData) {
        promptPayload = `Context: A YouTube video titled "${sharedVideo.videoData.title}" was shared in this study room. \nUser question about this video or topic: "${query}". \nProvide a detailed, contextual explanation referencing the video title and relevant timestamps (like 4:20) in a helpful tone.`;
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', text: promptPayload }],
          topic: `${room.topicTag} Room Study Group`,
        }),
      });

      const data = await res.json();
      let aiText = data.text;

      if (!aiText) {
        if (sharedVideo) {
          aiText = `🤖 **Video Breakdown for "${sharedVideo.videoData?.title}"**:\n\nAround the timestamp referenced in your question, the instructor breaks down the key mechanics of matrix forward passes. The weighted sum $Z = W \\cdot X + B$ measures how strongly feature patterns fire the target layer neurons!`;
        } else {
          aiText = `🤖 Great question about **${room.topicTag}**! In computer science, this concept relies on breaking down complex problems into modular functions. Let me know if you want a Python code snippet example!`;
        }
      }

      const aiMsg: RoomMessage = {
        id: `msg-ai-${Date.now()}`,
        senderId: 'ai-bot',
        senderName: 'LearnBot AI',
        senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
        senderRole: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
        content: aiText,
      };

      addMessageAndSync(aiMsg, [...currentThread, aiMsg]);
    } catch (err) {
      console.error('AI Room response error:', err);
    } finally {
      setIsAiThinking(false);
    }
  };

  // Send Code Snippet
  const handleSendCodeSnippet = () => {
    if (!codeSnippet.trim()) return;

    const codeMsg: RoomMessage = {
      id: `msg-code-${Date.now()}`,
      senderId: 'user-self',
      senderName: 'You (Student)',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      senderRole: 'admin',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'code',
      content: 'Shared code snippet:',
      codeData: {
        language: codeLanguage,
        code: codeSnippet.trim(),
      },
    };

    addMessageAndSync(codeMsg);
    setCodeSnippet('');
    setShowCodeInput(false);
  };

  // Send YouTube Video Card
  const handleSendYoutubeVideo = () => {
    if (!youtubeUrl.trim()) return;

    const embedId = extractYoutubeId(youtubeUrl);
    const videoMsg: RoomMessage = {
      id: `msg-video-${Date.now()}`,
      senderId: 'user-self',
      senderName: 'You (Student)',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      senderRole: 'admin',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'video',
      content: 'Shared a YouTube video tutorial:',
      videoData: {
        title: videoTitle.trim() || 'Neural Networks & AI Deep Dive Tutorial',
        youtubeUrl: youtubeUrl.trim(),
        embedId,
      },
    };

    addMessageAndSync(videoMsg);
    setYoutubeUrl('');
    setVideoTitle('');
    setShowVideoInput(false);
  };

  // Send Voice Note
  const handleStopAndSendVoice = () => {
    setIsRecordingVoice(false);
    const voiceMsg: RoomMessage = {
      id: `msg-voice-${Date.now()}`,
      senderId: 'user-self',
      senderName: 'You (Student)',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      senderRole: 'admin',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'voice',
      content: 'Voice Note message',
      voiceData: {
        durationSeconds: voiceTimer || 12,
        waveform: [25, 50, 75, 40, 90, 60, 30, 80, 70, 45, 85, 30],
      },
    };

    addMessageAndSync(voiceMsg);
  };

  // Admin Toggle Pin Message
  const handleTogglePinMessage = (msgId: string) => {
    const updatedMessages = messages.map((m) => ({
      ...m,
      isPinned: m.id === msgId ? !m.isPinned : m.isPinned,
    }));
    const pinnedMsg = updatedMessages.find((m) => m.isPinned);
    
    setMessages(updatedMessages);
    onUpdateRoom({
      ...room,
      messages: updatedMessages,
      pinnedMessageId: pinnedMsg ? pinnedMsg.id : undefined,
    });
  };

  const pinnedMsgObj = messages.find((m) => m.isPinned || m.id === room.pinnedMessageId);

  return (
    <div className="flex flex-col h-[78vh] bg-[#121729] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
      
      {/* Room Chat Topbar Header */}
      <div className="px-5 py-3.5 bg-[#0A0E1A] border-b border-slate-800 flex items-center justify-between z-10">
        <div className="flex items-center gap-3 overflow-hidden">
          {onBackToList && (
            <button
              onClick={onBackToList}
              className="md:hidden text-slate-400 hover:text-white font-mono text-xs"
            >
              ← Back
            </button>
          )}

          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7C5CFC] to-[#22D3EE] p-0.5 shrink-0">
            <div className="w-full h-full bg-[#0A0E1A] rounded-[10px] flex items-center justify-center font-bold text-xs text-[#22D3EE]">
              {room.topicTag.slice(0, 2).toUpperCase()}
            </div>
          </div>

          <div className="truncate">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-display font-bold text-white truncate">{room.name}</h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#7C5CFC]/20 border border-[#7C5CFC]/40 text-[#22D3EE]">
                {room.topicTag}
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 truncate">
              {room.memberCount} members • LearnBot AI Active
            </p>
          </div>
        </div>

        {/* Settings & Admin Panel Button */}
        <button
          onClick={() => setShowSettingsModal(true)}
          className="px-3 py-1.5 rounded-xl bg-[#121729] hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-all"
        >
          <Settings className="w-4 h-4 text-[#22D3EE]" />
          <span className="hidden sm:inline font-bold">Room Settings</span>
        </button>
      </div>

      {/* Pinned Message Banner */}
      {pinnedMsgObj && (
        <div className="bg-[#7C5CFC]/15 border-b border-[#7C5CFC]/30 px-5 py-2 flex items-center justify-between text-xs font-mono text-slate-200">
          <div className="flex items-center gap-2 truncate">
            <Pin className="w-3.5 h-3.5 text-[#FFB020] shrink-0" />
            <span className="text-[#FFB020] font-bold shrink-0">Pinned:</span>
            <span className="truncate">{pinnedMsgObj.content}</span>
          </div>

          {currentUserRole === 'admin' && (
            <button
              onClick={() => handleTogglePinMessage(pinnedMsgObj.id)}
              className="text-[10px] text-slate-400 hover:text-white underline shrink-0 ml-2"
            >
              Unpin
            </button>
          )}
        </div>
      )}

      {/* Chat Feed */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.senderId === 'user-self';
          const isAi = msg.senderRole === 'ai';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[88%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <img
                  src={msg.senderAvatar}
                  alt={msg.senderName}
                  className={`w-8 h-8 rounded-full object-cover border ${
                    isAi ? 'border-[#22D3EE] ring-2 ring-[#7C5CFC]/40' : 'border-slate-700'
                  }`}
                />
                {isAi && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22D3EE] absolute -bottom-0.5 -right-0.5 ring-2 ring-[#121729]" />
                )}
              </div>

              {/* Message Content Container */}
              <div className={`space-y-1 ${isUser ? 'items-end text-right' : 'items-start'}`}>
                
                {/* Sender Label & Role Badge */}
                <div className={`flex items-center gap-2 text-[10px] font-mono text-slate-400 ${isUser ? 'justify-end' : ''}`}>
                  <span className="font-bold text-slate-300">{msg.senderName}</span>
                  {msg.senderRole === 'admin' && (
                    <span className="bg-amber-500/20 text-[#FFB020] px-1.5 py-0.2 rounded font-bold">Admin</span>
                  )}
                  {msg.senderRole === 'ai' && (
                    <span className="bg-cyan-500/20 text-[#22D3EE] px-1.5 py-0.2 rounded font-bold">AI Bot</span>
                  )}
                  <span>• {msg.timestamp}</span>
                </div>

                {/* Message Bubble Renderers by Type */}
                <div className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isAi
                    ? 'bg-gradient-to-br from-[#121729] to-[#1A2238] border-2 border-[#7C5CFC]/50 text-slate-100 shadow-lg shadow-[#7C5CFC]/10 rounded-tl-none'
                    : isUser
                    ? 'bg-gradient-to-r from-[#7C5CFC] to-[#3B82F6] text-white rounded-tr-none font-medium'
                    : 'bg-[#0A0E1A] border border-slate-800 text-slate-200 rounded-tl-none'
                }`}>
                  
                  {/* Type 1: Plain Text */}
                  {msg.type === 'text' && (
                    <div className="whitespace-pre-wrap font-sans">
                      {msg.content}
                    </div>
                  )}

                  {/* Type 2: Code Snippet */}
                  {msg.type === 'code' && msg.codeData && (
                    <div className="space-y-2">
                      <p className="font-sans mb-1">{msg.content}</p>
                      <div className="rounded-xl bg-[#0A0E1A] border border-slate-800 overflow-hidden text-left">
                        <div className="px-3 py-1.5 bg-slate-900 border-b border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-400">
                          <span className="uppercase font-bold text-[#22D3EE]">{msg.codeData.language} Code</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(msg.codeData?.code || '');
                              setCopiedCodeId(msg.id);
                              setTimeout(() => setCopiedCodeId(null), 2000);
                            }}
                            className="text-[#22D3EE] hover:underline font-bold flex items-center gap-1"
                          >
                            {copiedCodeId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedCodeId === msg.id ? 'Copied!' : 'Copy Code'}</span>
                          </button>
                        </div>
                        <pre className="p-3 font-mono text-xs text-[#22D3EE] overflow-x-auto whitespace-pre">
                          <code>{msg.codeData.code}</code>
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Type 3: YouTube Video Embed */}
                  {msg.type === 'video' && msg.videoData && (
                    <div className="space-y-3">
                      <p className="font-sans font-medium">{msg.content}</p>
                      <div className="rounded-2xl overflow-hidden border border-slate-700 bg-black aspect-video max-w-md">
                        <iframe
                          src={`https://www.youtube.com/embed/${msg.videoData.embedId}`}
                          title={msg.videoData.title}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                      <div className="text-xs font-mono text-[#22D3EE] font-bold">
                        📹 {msg.videoData.title}
                      </div>
                    </div>
                  )}

                  {/* Type 4: Voice Note */}
                  {msg.type === 'voice' && msg.voiceData && (
                    <div className="flex items-center gap-3 py-1">
                      <button
                        onClick={() =>
                          setPlayingVoiceId(playingVoiceId === msg.id ? null : msg.id)
                        }
                        className="w-9 h-9 rounded-full bg-[#22D3EE] text-slate-950 flex items-center justify-center shrink-0 hover:scale-105 transition-transform"
                      >
                        {playingVoiceId === msg.id ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                      </button>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-1 h-6">
                          {msg.voiceData.waveform.map((height, i) => (
                            <div
                              key={i}
                              className={`w-1 rounded-full transition-all ${
                                playingVoiceId === msg.id ? 'bg-[#22D3EE] animate-pulse' : 'bg-slate-600'
                              }`}
                              style={{ height: `${height}%` }}
                            />
                          ))}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          Voice Note • 0:{msg.voiceData.durationSeconds < 10 ? `0${msg.voiceData.durationSeconds}` : msg.voiceData.durationSeconds}
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* Admin Pin Option */}
                {currentUserRole === 'admin' && (
                  <button
                    onClick={() => handleTogglePinMessage(msg.id)}
                    className="text-[10px] font-mono text-slate-500 hover:text-[#FFB020] transition-colors"
                  >
                    {msg.isPinned ? '📌 Unpin' : '📌 Pin Message'}
                  </button>
                )}

              </div>
            </div>
          );
        })}

        {/* AI Assistant Thinking Loader */}
        {isAiThinking && (
          <div className="flex items-center gap-3 mr-auto">
            <div className="w-8 h-8 rounded-full bg-[#121729] border border-[#22D3EE] text-[#22D3EE] flex items-center justify-center">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0A0E1A] border border-[#7C5CFC]/40 text-xs font-mono text-[#22D3EE] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>LearnBot AI is analyzing query...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Code Input Overlay Modal */}
      {showCodeInput && (
        <div className="p-4 bg-[#0A0E1A] border-t border-slate-800 space-y-3 font-mono text-xs">
          <div className="flex justify-between items-center text-slate-300 font-bold">
            <span className="flex items-center gap-1.5 text-[#22D3EE]">
              <Code className="w-4 h-4" /> Share Syntax-Highlighted Code
            </span>
            <button onClick={() => setShowCodeInput(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-2">
            <select
              value={codeLanguage}
              onChange={(e) => setCodeLanguage(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#121729] border border-slate-800 text-slate-200"
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="cpp">C++</option>
              <option value="html">HTML/CSS</option>
            </select>
          </div>

          <textarea
            rows={4}
            value={codeSnippet}
            onChange={(e) => setCodeSnippet(e.target.value)}
            placeholder="Paste or write your code block here..."
            className="w-full p-3 rounded-xl bg-[#121729] border border-slate-800 text-slate-200 focus:outline-none focus:border-[#7C5CFC] font-mono"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowCodeInput(false)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleSendCodeSnippet}
              className="px-4 py-1.5 rounded-xl bg-[#7C5CFC] text-white font-bold"
            >
              Share Code Block
            </button>
          </div>
        </div>
      )}

      {/* YouTube Video Input Overlay */}
      {showVideoInput && (
        <div className="p-4 bg-[#0A0E1A] border-t border-slate-800 space-y-3 font-mono text-xs">
          <div className="flex justify-between items-center text-slate-300 font-bold">
            <span className="flex items-center gap-1.5 text-red-400">
              <Youtube className="w-4 h-4" /> Embed YouTube Video
            </span>
            <button onClick={() => setShowVideoInput(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <input
            type="text"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="Paste YouTube URL (e.g. https://www.youtube.com/watch?v=aircAruvnKk)"
            className="w-full px-3.5 py-2 rounded-xl bg-[#121729] border border-slate-800 text-slate-200 focus:outline-none focus:border-[#7C5CFC]"
          />

          <input
            type="text"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            placeholder="Optional Video Title (e.g. Neural Networks Explained)"
            className="w-full px-3.5 py-2 rounded-xl bg-[#121729] border border-slate-800 text-slate-200 focus:outline-none focus:border-[#7C5CFC]"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowVideoInput(false)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleSendYoutubeVideo}
              className="px-4 py-1.5 rounded-xl bg-red-600 text-white font-bold"
            >
              Embed Video
            </button>
          </div>
        </div>
      )}

      {/* Recording Voice UI Bar */}
      {isRecordingVoice && (
        <div className="px-5 py-3 bg-red-950/40 border-t border-red-500/30 flex items-center justify-between font-mono text-xs text-red-300">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
            <span>Recording Voice Note... 0:{voiceTimer < 10 ? `0${voiceTimer}` : voiceTimer}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRecordingVoice(false)}
              className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleStopAndSendVoice}
              className="px-4 py-1 rounded-lg bg-red-600 text-white font-bold flex items-center gap-1"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>Send Voice Note</span>
            </button>
          </div>
        </div>
      )}

      {/* Composer Bottom Input Toolbar */}
      <div className="p-3 bg-[#0A0E1A] border-t border-slate-800 space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendText();
          }}
          className="flex items-center gap-2"
        >
          {/* Quick Action Attachment Buttons */}
          <button
            type="button"
            onClick={() => setShowCodeInput(!showCodeInput)}
            title="Share Code Block"
            className="p-2.5 rounded-xl bg-[#121729] hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-[#22D3EE] transition-colors"
          >
            <Code className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setShowVideoInput(!showVideoInput)}
            title="Share YouTube Video"
            className="p-2.5 rounded-xl bg-[#121729] hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-red-400 transition-colors"
          >
            <Youtube className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsRecordingVoice(true)}
            title="Record Voice Note"
            className="p-2.5 rounded-xl bg-[#121729] hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-[#FFB020] transition-colors"
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Type message, YouTube link, or '/ask...' to consult LearnBot AI"
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#121729] border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#7C5CFC] font-mono"
          />

          {/* Ask AI Button */}
          <button
            type="button"
            onClick={() => handleSendText(undefined, true)}
            className="px-3 py-2.5 rounded-xl bg-[#7C5CFC]/20 hover:bg-[#7C5CFC]/30 border border-[#7C5CFC]/40 text-[#22D3EE] font-mono text-xs font-bold transition-all flex items-center gap-1 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputPrompt.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#22D3EE] text-slate-950 font-bold disabled:opacity-40 transition-all hover:scale-105"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Room Settings Modal */}
      <RoomSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        room={room}
        isAdmin={currentUserRole === 'admin'}
        onUpdateRoomInfo={(name, topicTag, description) => {
          onUpdateRoom({
            ...room,
            name,
            topicTag,
            description,
          });
        }}
        onRemoveMember={(memberId) => {
          const updatedMembers = room.members.filter((m) => m.id !== memberId);
          onUpdateRoom({
            ...room,
            members: updatedMembers,
            memberCount: updatedMembers.length,
          });
        }}
        onUnpinMessage={() => {
          const updatedMessages = messages.map((m) => ({ ...m, isPinned: false }));
          setMessages(updatedMessages);
          onUpdateRoom({
            ...room,
            messages: updatedMessages,
            pinnedMessageId: undefined,
          });
        }}
      />

    </div>
  );
}
