import React, { useState, useRef, useEffect } from 'react';
import { StudyRoom, RoomMessage } from '../../data/roomsData';
import { useSendMessageMutation } from '../../hooks/useRoomQueries';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Send, Mic, Square, Play, Pause, Code, Youtube, Bot, User, Pin, 
  Settings, Copy, Check, Sparkles, Volume2, CornerDownRight, Plus, X, Paperclip,
  FileText, Image as ImageIcon, Film, Music, Download, AlertCircle, Loader2, ExternalLink
} from 'lucide-react';
import RoomSettingsModal from './RoomSettingsModal';

interface RoomChatViewProps {
  room: StudyRoom;
  onUpdateRoom: (updatedRoom: StudyRoom) => void;
  onBackToList?: () => void;
}

export default function RoomChatView({ room, onUpdateRoom, onBackToList }: RoomChatViewProps) {
  const { user } = useAuth();
  const sendMessageMutation = useSendMessageMutation();

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

  // File Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const voiceIntervalRef = useRef<any>(null);

  const currentUserRole = 'admin';

  // Sync messages when room prop changes
  useEffect(() => {
    setMessages(room.messages);
  }, [room]);

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

  // Helper to send message & sync with Supabase and parent state
  const addMessageAndSync = async (newMsg: RoomMessage) => {
    const nextList = [...messages, newMsg];
    setMessages(nextList);

    // Save message to Supabase database
    try {
      await sendMessageMutation.mutateAsync({
        roomId: room.id,
        senderId: user?.id || 'user-self',
        type: newMsg.type === 'file' ? 'file' : newMsg.type,
        content: newMsg.content,
        codeData: newMsg.codeData,
        videoData: newMsg.videoData,
        voiceData: newMsg.voiceData,
        fileData: (newMsg as any).fileData,
      });
    } catch (err) {
      console.error('Failed to sync message to Supabase:', err);
    }

    onUpdateRoom({
      ...room,
      messages: nextList,
    });
  };

  // File Upload Handler via /api/hf-upload Endpoint
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // Read file as base64 data URL
      const reader = new FileReader();
      const fileDataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch('/api/hf-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileData: fileDataUrl,
          fileName: file.name,
          mimeType: file.type,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setUploadError(data.error || 'Failed to upload media file.');
        return;
      }

      // Determine message attachment type
      let attachmentType: 'file' | 'video' | 'voice' = 'file';
      if (file.type.startsWith('image/')) attachmentType = 'file';
      else if (file.type.startsWith('audio/')) attachmentType = 'voice';
      else if (file.type.startsWith('video/')) attachmentType = 'video';

      const fileMsg: any = {
        id: `msg-file-${Date.now()}`,
        senderId: user?.id || 'user-self',
        senderName: user?.email?.split('@')[0] || 'You (Student)',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        senderRole: 'admin',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'file',
        content: `Uploaded attachment: ${file.name}`,
        fileData: {
          url: data.url,
          filename: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          mimeType: file.type,
        },
      };

      await addMessageAndSync(fileMsg);
    } catch (err: any) {
      console.error('File upload failed:', err);
      setUploadError(err?.message || 'Error uploading file.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Handle Standard Text or AI Command Sending
  const handleSendText = async (overrideText?: string, isAiPrompt = false) => {
    const textToSend = overrideText || inputPrompt;
    if (!textToSend.trim()) return;

    const userMsg: RoomMessage = {
      id: `msg-${Date.now()}`,
      senderId: user?.id || 'user-self',
      senderName: user?.email?.split('@')[0] || 'You (Student)',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      senderRole: 'admin',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
      content: textToSend.trim(),
    };

    const nextMessages = [...messages, userMsg];
    await addMessageAndSync(userMsg);
    if (!overrideText) setInputPrompt('');

    const lowerText = textToSend.toLowerCase();
    const isVideoQuestion = lowerText.includes('video') || lowerText.includes('part') || lowerText.includes('around') || lowerText.includes('timestamp') || lowerText.includes('4:20');
    const isAiTriggered = isAiPrompt || lowerText.startsWith('/ask') || lowerText.includes('explain') || lowerText.includes('how') || lowerText.includes('what') || isVideoQuestion;

    if (isAiTriggered) {
      triggerRoomAiAssistant(textToSend, nextMessages);
    }
  };

  // Trigger Room AI Assistant
  const triggerRoomAiAssistant = async (query: string, currentThread: RoomMessage[]) => {
    setIsAiThinking(true);

    try {
      const sharedVideo = [...currentThread].reverse().find((m) => m.type === 'video');

      let promptPayload = query;
      if (sharedVideo && sharedVideo.videoData) {
        promptPayload = `Context: A video titled "${sharedVideo.videoData.title}" was shared in this room. \nUser question: "${query}". \nProvide a helpful explanation.`;
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
      const aiText = data.text || `🤖 Great question about **${room.topicTag}**! Feel free to ask me for code examples or video breakdowns!`;

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

      await addMessageAndSync(aiMsg);
    } catch (err) {
      console.error('AI Room response error:', err);
    } finally {
      setIsAiThinking(false);
    }
  };

  // Send Code Snippet
  const handleSendCodeSnippet = async () => {
    if (!codeSnippet.trim()) return;

    const codeMsg: RoomMessage = {
      id: `msg-code-${Date.now()}`,
      senderId: user?.id || 'user-self',
      senderName: user?.email?.split('@')[0] || 'You (Student)',
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

    await addMessageAndSync(codeMsg);
    setCodeSnippet('');
    setShowCodeInput(false);
  };

  // Send YouTube Video Card
  const handleSendYoutubeVideo = async () => {
    if (!youtubeUrl.trim()) return;

    const embedId = extractYoutubeId(youtubeUrl);
    const videoMsg: RoomMessage = {
      id: `msg-video-${Date.now()}`,
      senderId: user?.id || 'user-self',
      senderName: user?.email?.split('@')[0] || 'You (Student)',
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

    await addMessageAndSync(videoMsg);
    setYoutubeUrl('');
    setVideoTitle('');
    setShowVideoInput(false);
  };

  // Send Voice Note
  const handleStopAndSendVoice = async () => {
    setIsRecordingVoice(false);
    const voiceMsg: RoomMessage = {
      id: `msg-voice-${Date.now()}`,
      senderId: user?.id || 'user-self',
      senderName: user?.email?.split('@')[0] || 'You (Student)',
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

    await addMessageAndSync(voiceMsg);
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
    <div className="flex flex-col h-[78vh] liquid-glass-dock border border-[#D6C5B3] rounded-3xl overflow-hidden shadow-2xl relative selection:bg-[#A6632B]/20">
      
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt"
      />

      {/* Room Chat Topbar Header */}
      <div className="px-5 py-3.5 bg-[#FAF4ED] border-b border-[#D6C5B3] flex items-center justify-between z-10">
        <div className="flex items-center gap-3 overflow-hidden">
          {onBackToList && (
            <button
              onClick={onBackToList}
              className="md:hidden text-[#6E5D4F] hover:text-[#2A1E17] font-mono text-xs"
            >
              ← Back
            </button>
          )}

          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#A6632B] via-[#C77A38] to-[#8C4A1B] p-0.5 shrink-0">
            <div className="w-full h-full bg-[#FAF4ED] rounded-[10px] flex items-center justify-center font-bold text-xs text-[#A6632B]">
              {room.topicTag.slice(0, 2).toUpperCase()}
            </div>
          </div>

          <div className="truncate">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-display font-bold text-[#2A1E17] truncate">{room.name}</h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full liquid-glass-pill border border-[#D6C5B3] text-[#8C4A1B]">
                {room.topicTag}
              </span>
            </div>
            <p className="text-[11px] font-mono text-[#6E5D4F] truncate">
              {room.memberCount} members • LearnBot AI & Hugging Face Media Active
            </p>
          </div>
        </div>

        {/* Settings & Admin Panel Button */}
        <button
          onClick={() => setShowSettingsModal(true)}
          className="px-3 py-1.5 rounded-xl liquid-glass-card hover:bg-[#EFE5D9] border border-[#D6C5B3] text-xs font-mono text-[#2A1E17] flex items-center gap-1.5 transition-all"
        >
          <Settings className="w-4 h-4 text-[#A6632B]" />
          <span className="hidden sm:inline font-bold">Room Settings</span>
        </button>
      </div>

      {/* Pinned Message Banner */}
      {pinnedMsgObj && (
        <div className="bg-[#A6632B]/10 border-b border-[#D6C5B3] px-5 py-2 flex items-center justify-between text-xs font-mono text-[#2A1E17]">
          <div className="flex items-center gap-2 truncate">
            <Pin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span className="text-amber-800 font-bold shrink-0">Pinned:</span>
            <span className="truncate">{pinnedMsgObj.content}</span>
          </div>

          {currentUserRole === 'admin' && (
            <button
              onClick={() => handleTogglePinMessage(pinnedMsgObj.id)}
              className="text-[10px] text-[#8C4A1B] hover:underline shrink-0 ml-2 font-bold"
            >
              Unpin
            </button>
          )}
        </div>
      )}

      {/* Upload Error Banner */}
      {uploadError && (
        <div className="bg-rose-500/15 border-b border-rose-500/30 px-5 py-2 flex items-center justify-between text-xs font-mono text-rose-900">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{uploadError}</span>
          </div>
          <button
            onClick={() => setUploadError(null)}
            className="text-xs font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Chat Feed */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.senderId === user?.id || msg.senderId === 'user-self';
          const isAi = msg.senderRole === 'ai';
          const fileData = (msg as any).fileData;

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
                    isAi ? 'border-[#A6632B] ring-2 ring-[#A6632B]/30' : 'border-[#D6C5B3]'
                  }`}
                />
              </div>

              {/* Message Content Container */}
              <div className={`space-y-1 ${isUser ? 'items-end text-right' : 'items-start'}`}>
                
                {/* Sender Label & Role Badge */}
                <div className={`flex items-center gap-2 text-[10px] font-mono text-[#6E5D4F] ${isUser ? 'justify-end' : ''}`}>
                  <span className="font-bold text-[#2A1E17]">{msg.senderName}</span>
                  {msg.senderRole === 'admin' && (
                    <span className="bg-amber-500/20 text-amber-900 px-1.5 py-0.2 rounded font-bold">Admin</span>
                  )}
                  {msg.senderRole === 'ai' && (
                    <span className="bg-[#A6632B]/20 text-[#8C4A1B] px-1.5 py-0.2 rounded font-bold">AI Bot</span>
                  )}
                  <span>• {msg.timestamp}</span>
                </div>

                {/* Message Bubble Renderers by Type */}
                <div className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isAi
                    ? 'bg-[#FAF4ED] border-2 border-[#A6632B]/40 text-[#2A1E17] shadow-md rounded-tl-none'
                    : isUser
                    ? 'bg-gradient-to-r from-[#A6632B] via-[#C77A38] to-[#8C4A1B] text-white rounded-tr-none font-medium shadow-md'
                    : 'liquid-glass-card border border-[#D6C5B3] text-[#2A1E17] rounded-tl-none'
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
                      <div className="rounded-xl bg-[#2A1E17] border border-[#D6C5B3] overflow-hidden text-left">
                        <div className="px-3 py-1.5 bg-[#1E1510] border-b border-[#D6C5B3]/30 flex justify-between items-center text-[10px] font-mono text-amber-200">
                          <span className="uppercase font-bold text-amber-400">{msg.codeData.language} Code</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(msg.codeData?.code || '');
                              setCopiedCodeId(msg.id);
                              setTimeout(() => setCopiedCodeId(null), 2000);
                            }}
                            className="text-amber-400 hover:underline font-bold flex items-center gap-1"
                          >
                            {copiedCodeId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedCodeId === msg.id ? 'Copied!' : 'Copy Code'}</span>
                          </button>
                        </div>
                        <pre className="p-3 font-mono text-xs text-amber-100 overflow-x-auto whitespace-pre">
                          <code>{msg.codeData.code}</code>
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Type 3: YouTube Video Embed */}
                  {msg.type === 'video' && msg.videoData && (
                    <div className="space-y-3">
                      <p className="font-sans font-medium">{msg.content}</p>
                      <div className="rounded-2xl overflow-hidden border border-[#D6C5B3] bg-black aspect-video max-w-md">
                        <iframe
                          src={`https://www.youtube.com/embed/${msg.videoData.embedId}`}
                          title={msg.videoData.title}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                      <div className="text-xs font-mono text-[#8C4A1B] font-bold">
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
                        className="w-9 h-9 rounded-full bg-white text-[#2A1E17] flex items-center justify-center shrink-0 hover:scale-105 transition-transform shadow"
                      >
                        {playingVoiceId === msg.id ? <Pause className="w-4 h-4 fill-current text-[#A6632B]" /> : <Play className="w-4 h-4 fill-current text-[#A6632B] ml-0.5" />}
                      </button>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-1 h-6">
                          {msg.voiceData.waveform.map((height, i) => (
                            <div
                              key={i}
                              className={`w-1 rounded-full transition-all ${
                                playingVoiceId === msg.id ? 'bg-[#A6632B] animate-pulse' : 'bg-[#D6C5B3]'
                              }`}
                              style={{ height: `${height}%` }}
                            />
                          ))}
                        </div>
                        <div className="text-[10px] font-mono text-[#6E5D4F]">
                          Voice Note • 0:{msg.voiceData.durationSeconds < 10 ? `0${msg.voiceData.durationSeconds}` : msg.voiceData.durationSeconds}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Type 5: File & Media Attachment (Hugging Face CDN) */}
                  {msg.type === 'file' && fileData && (
                    <div className="space-y-2">
                      <p className="font-sans font-medium">{msg.content}</p>

                      {/* Image Inline Preview */}
                      {fileData.mimeType?.startsWith('image/') ? (
                        <div className="space-y-1.5">
                          <img
                            src={fileData.url}
                            alt={fileData.filename}
                            onClick={() => setExpandedImage(fileData.url)}
                            className="max-w-xs max-h-60 rounded-xl object-cover cursor-pointer border border-[#D6C5B3] hover:opacity-90 transition-opacity shadow-md"
                          />
                          <div className="text-[10px] font-mono opacity-80 flex items-center justify-between">
                            <span>{fileData.filename} ({fileData.size})</span>
                            <span className="text-amber-800 font-bold">HF Media CDN</span>
                          </div>
                        </div>
                      ) : fileData.mimeType?.startsWith('audio/') ? (
                        /* Audio Player */
                        <div className="p-3 rounded-xl bg-[#FAF4ED] border border-[#D6C5B3] space-y-2">
                          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#8C4A1B]">
                            <Music className="w-4 h-4" />
                            <span>{fileData.filename}</span>
                          </div>
                          <audio controls src={fileData.url} className="w-full h-8 rounded" />
                        </div>
                      ) : fileData.mimeType?.startsWith('video/') ? (
                        /* HTML5 Video Player */
                        <div className="space-y-1.5 max-w-md">
                          <video controls src={fileData.url} className="w-full rounded-xl border border-[#D6C5B3] shadow" />
                          <div className="text-[10px] font-mono opacity-80">{fileData.filename}</div>
                        </div>
                      ) : (
                        /* PDF / Document Card */
                        <div className="p-3.5 rounded-xl bg-[#FAF4ED] border border-[#D6C5B3] flex items-center justify-between gap-4 text-xs font-mono text-[#2A1E17]">
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <FileText className="w-5 h-5 text-[#A6632B] shrink-0" />
                            <div className="truncate">
                              <div className="font-bold truncate">{fileData.filename}</div>
                              <div className="text-[10px] font-mono text-[#6E5D4F]">{fileData.size}</div>
                            </div>
                          </div>
                          <a
                            href={fileData.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#A6632B] to-[#8C4A1B] text-white font-bold text-xs shrink-0 flex items-center gap-1 shadow hover:scale-105 transition-all"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Open</span>
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                </div>

                {/* Admin Pin Option */}
                {currentUserRole === 'admin' && (
                  <button
                    onClick={() => handleTogglePinMessage(msg.id)}
                    className="text-[10px] font-mono text-[#6E5D4F] hover:text-[#8C4A1B] transition-colors"
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
            <div className="w-8 h-8 rounded-full bg-[#FAF4ED] border border-[#A6632B] text-[#A6632B] flex items-center justify-center">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl bg-[#FAF4ED] border border-[#A6632B]/40 text-xs font-mono text-[#8C4A1B] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#A6632B]" />
              <span>LearnBot AI is analyzing query...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Code Input Overlay Modal */}
      {showCodeInput && (
        <div className="p-4 bg-[#FAF4ED] border-t border-[#D6C5B3] space-y-3 font-mono text-xs">
          <div className="flex justify-between items-center text-[#2A1E17] font-bold">
            <span className="flex items-center gap-1.5 text-[#A6632B]">
              <Code className="w-4 h-4" /> Share Syntax-Highlighted Code
            </span>
            <button onClick={() => setShowCodeInput(false)} className="text-[#6E5D4F] hover:text-[#2A1E17]">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-2">
            <select
              value={codeLanguage}
              onChange={(e) => setCodeLanguage(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#D6C5B3] text-[#2A1E17]"
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
            className="w-full p-3 rounded-xl bg-white border border-[#D6C5B3] text-[#2A1E17] focus:outline-none focus:border-[#A6632B] font-mono"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowCodeInput(false)}
              className="px-3 py-1.5 rounded-xl bg-[#EFE5D9] text-[#2A1E17] font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleSendCodeSnippet}
              className="px-4 py-1.5 rounded-xl bg-[#A6632B] text-white font-bold"
            >
              Share Code Block
            </button>
          </div>
        </div>
      )}

      {/* YouTube Video Input Overlay */}
      {showVideoInput && (
        <div className="p-4 bg-[#FAF4ED] border-t border-[#D6C5B3] space-y-3 font-mono text-xs">
          <div className="flex justify-between items-center text-[#2A1E17] font-bold">
            <span className="flex items-center gap-1.5 text-red-700">
              <Youtube className="w-4 h-4" /> Embed YouTube Video
            </span>
            <button onClick={() => setShowVideoInput(false)} className="text-[#6E5D4F] hover:text-[#2A1E17]">
              <X className="w-4 h-4" />
            </button>
          </div>

          <input
            type="text"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="Paste YouTube URL (e.g. https://www.youtube.com/watch?v=aircAruvnKk)"
            className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#D6C5B3] text-[#2A1E17] focus:outline-none focus:border-[#A6632B]"
          />

          <input
            type="text"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            placeholder="Optional Video Title (e.g. Neural Networks Explained)"
            className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#D6C5B3] text-[#2A1E17] focus:outline-none focus:border-[#A6632B]"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowVideoInput(false)}
              className="px-3 py-1.5 rounded-xl bg-[#EFE5D9] text-[#2A1E17] font-bold"
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
        <div className="px-5 py-3 bg-amber-500/10 border-t border-amber-500/30 flex items-center justify-between font-mono text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-600 animate-ping" />
            <span>Recording Voice Note... 0:{voiceTimer < 10 ? `0${voiceTimer}` : voiceTimer}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRecordingVoice(false)}
              className="px-3 py-1 rounded-lg bg-[#EFE5D9] text-[#2A1E17] font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleStopAndSendVoice}
              className="px-4 py-1 rounded-lg bg-[#A6632B] text-white font-bold flex items-center gap-1"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>Send Voice Note</span>
            </button>
          </div>
        </div>
      )}

      {/* Composer Bottom Input Toolbar */}
      <div className="p-3 bg-[#FAF4ED] border-t border-[#D6C5B3] space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendText();
          }}
          className="flex items-center gap-2"
        >
          {/* Paperclip / File Attachment Button */}
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            title="Attach Image, Audio, Video, or PDF via Hugging Face"
            className="p-2.5 rounded-xl liquid-glass-card hover:bg-[#EFE5D9] border border-[#D6C5B3] text-[#A6632B] transition-colors relative"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#A6632B]" />
            ) : (
              <Paperclip className="w-4 h-4" />
            )}
          </button>

          {/* Quick Action Attachment Buttons */}
          <button
            type="button"
            onClick={() => setShowCodeInput(!showCodeInput)}
            title="Share Code Block"
            className="p-2.5 rounded-xl liquid-glass-card hover:bg-[#EFE5D9] border border-[#D6C5B3] text-[#6E5D4F] hover:text-[#A6632B] transition-colors"
          >
            <Code className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setShowVideoInput(!showVideoInput)}
            title="Share YouTube Video"
            className="p-2.5 rounded-xl liquid-glass-card hover:bg-[#EFE5D9] border border-[#D6C5B3] text-[#6E5D4F] hover:text-red-600 transition-colors"
          >
            <Youtube className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsRecordingVoice(true)}
            title="Record Voice Note"
            className="p-2.5 rounded-xl liquid-glass-card hover:bg-[#EFE5D9] border border-[#D6C5B3] text-[#6E5D4F] hover:text-amber-700 transition-colors"
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Type message, YouTube link, or '/ask...' to consult LearnBot AI"
            className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-[#D6C5B3] text-xs sm:text-sm text-[#2A1E17] placeholder-[#6E5D4F] focus:outline-none focus:border-[#A6632B] font-mono"
          />

          {/* Ask AI Button */}
          <button
            type="button"
            onClick={() => handleSendText(undefined, true)}
            className="px-3 py-2.5 rounded-xl bg-[#A6632B]/15 hover:bg-[#A6632B]/25 border border-[#A6632B]/30 text-[#8C4A1B] font-mono text-xs font-bold transition-all flex items-center gap-1 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#A6632B]" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputPrompt.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-r from-[#A6632B] via-[#C77A38] to-[#8C4A1B] text-white font-bold disabled:opacity-40 transition-all hover:scale-105 shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Expanded Image Modal */}
      {expandedImage && (
        <div
          onClick={() => setExpandedImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img src={expandedImage} alt="Expanded Attachment" className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl" />
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute -top-10 right-0 p-2 text-white hover:text-amber-300 font-mono text-xs font-bold flex items-center gap-1"
            >
              <X className="w-5 h-5" />
              <span>Close</span>
            </button>
          </div>
        </div>
      )}

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
