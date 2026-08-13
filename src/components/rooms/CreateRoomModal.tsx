import React, { useState } from 'react';
import { X, Sparkles, PlusCircle } from 'lucide-react';
import { StudyRoom } from '../../data/roomsData';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: (room: StudyRoom) => void;
  defaultTopicTag?: string;
}

export default function CreateRoomModal({
  isOpen,
  onClose,
  onCreateRoom,
  defaultTopicTag = 'Python',
}: CreateRoomModalProps) {
  const [name, setName] = useState('');
  const [topicTag, setTopicTag] = useState(defaultTopicTag);
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newRoom: StudyRoom = {
      id: `custom-room-${Date.now()}`,
      name: name.trim(),
      topicTag: topicTag || 'General',
      description: description.trim() || 'Custom collaborative study room created by student.',
      memberCount: 1,
      unreadCount: 0,
      createdById: 'user-self',
      isCustom: true,
      members: [
        {
          id: 'user-self',
          name: 'You (Creator)',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          role: 'admin',
          isOnline: true,
        },
        {
          id: 'ai-bot',
          name: 'LearnBot AI',
          avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
          role: 'ai',
          isOnline: true,
        },
      ],
      messages: [
        {
          id: `msg-welcome-${Date.now()}`,
          senderId: 'ai-bot',
          senderName: 'LearnBot AI',
          senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
          senderRole: 'ai',
          timestamp: 'Just now',
          type: 'text',
          content: `🎉 Room "${name.trim()}" has been created! As the creator, you are an Admin with full room controls (pinning messages, managing members). Ask me any topic questions or paste a YouTube video link!`,
        },
      ],
    };

    onCreateRoom(newRoom);
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-[#121729] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#7C5CFC]/20 border border-[#7C5CFC]/40 flex items-center justify-center text-[#22D3EE]">
              <PlusCircle className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-display font-bold text-white">Create New Study Room</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-bold">Room Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. PyTorch CUDA Hackers"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0E1A] border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#7C5CFC]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-bold">Topic / Tag *</label>
            <select
              value={topicTag}
              onChange={(e) => setTopicTag(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0E1A] border border-slate-800 text-slate-200 focus:outline-none focus:border-[#7C5CFC]"
            >
              <option value="Python">Python</option>
              <option value="JavaScript">JavaScript</option>
              <option value="HTML & CSS">HTML & CSS</option>
              <option value="Java">Java</option>
              <option value="C++">C++</option>
              <option value="Machine Learning">Machine Learning</option>
              <option value="Deep Learning">Deep Learning</option>
              <option value="Neural Networks">Neural Networks</option>
              <option value="General">General CS</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-bold">Short Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you plan to study or collaborate on..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0E1A] border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#7C5CFC] resize-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#22D3EE] text-slate-950 font-bold shadow-md hover:scale-105 transition-all"
            >
              Create Room (Admin)
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
