import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { INITIAL_ROOMS, StudyRoom } from '../data/roomsData';
import RoomChatView from '../components/rooms/RoomChatView';
import CreateRoomModal from '../components/rooms/CreateRoomModal';
import { 
  Users, Plus, Search, MessageSquare, Sparkles, Shield, ChevronRight, Hash, Pin 
} from 'lucide-react';

export default function RoomsView() {
  const { trackId = 'python' } = useParams<{ trackId: string }>();
  const navigate = useNavigate();

  // Load custom rooms from localStorage if present
  const [rooms, setRooms] = useState<StudyRoom[]>(() => {
    const saved = localStorage.getItem('learnstack_rooms_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_ROOMS;
      }
    }
    return INITIAL_ROOMS;
  });

  const [activeRoomId, setActiveRoomId] = useState<string | null>(rooms[0]?.id || 'room-python');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Persist rooms to localStorage on change
  useEffect(() => {
    localStorage.setItem('learnstack_rooms_v2', JSON.stringify(rooms));
  }, [rooms]);

  const activeRoom = rooms.find((r) => r.id === activeRoomId) || rooms[0];

  const handleCreateRoom = (newRoom: StudyRoom) => {
    setRooms((prev) => [newRoom, ...prev]);
    setActiveRoomId(newRoom.id);
  };

  const handleUpdateRoom = (updatedRoom: StudyRoom) => {
    setRooms((prev) => prev.map((r) => (r.id === updatedRoom.id ? updatedRoom : r)));
  };

  const filteredRooms = rooms.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.topicTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#121729] border border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C5CFC]/15 border border-[#7C5CFC]/30 text-xs font-mono text-[#22D3EE]">
            <Users className="w-3.5 h-3.5" />
            <span>WhatsApp-Style Collaborative Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
            Peer Study Rooms & AI Chat
          </h1>
          <p className="text-xs font-mono text-slate-400">
            Real-time group chat threads with syntax-highlighted code sharing, voice notes, YouTube video embeds, and inline LearnBot AI.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#7C5CFC] to-[#22D3EE] text-slate-950 font-mono text-xs font-bold shadow-lg shadow-[#7C5CFC]/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Room</span>
        </button>
      </div>

      {/* Main Grid: Room List Sidebar + Active Room Chat Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Room List Sidebar (4 cols) */}
        <div className={`lg:col-span-4 space-y-4 ${activeRoomId ? 'hidden md:block' : 'block'}`}>
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter rooms by topic or name..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#121729] border border-slate-800 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#7C5CFC]"
            />
          </div>

          {/* Room Cards List */}
          <div className="space-y-2.5 max-h-[70vh] overflow-y-auto pr-1">
            {filteredRooms.map((room) => {
              const isActive = room.id === activeRoomId;
              const lastMsg = room.messages[room.messages.length - 1];

              return (
                <div
                  key={room.id}
                  onClick={() => setActiveRoomId(room.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer group space-y-2.5 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#7C5CFC]/20 to-[#121729] border-[#7C5CFC] shadow-lg shadow-[#7C5CFC]/10'
                      : 'bg-[#121729] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="w-7 h-7 rounded-lg bg-[#7C5CFC]/20 border border-[#7C5CFC]/30 flex items-center justify-center text-[#22D3EE] font-mono text-xs font-bold shrink-0">
                        #
                      </div>
                      <span className="font-display font-bold text-sm text-white group-hover:text-[#22D3EE] transition-colors truncate">
                        {room.name}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0A0E1A] border border-slate-800 text-[#22D3EE] font-bold shrink-0">
                      {room.topicTag}
                    </span>
                  </div>

                  <p className="text-xs font-mono text-slate-400 line-clamp-1">
                    {room.description}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <div className="truncate max-w-[180px] text-slate-400">
                      {lastMsg ? `${lastMsg.senderName.split(' ')[0]}: ${lastMsg.content}` : 'No messages yet'}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span>{room.memberCount} members</span>
                      {room.unreadCount > 0 && (
                        <span className="w-2 h-2 rounded-full bg-[#FFB020] animate-pulse" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Column: Active Room Chat Workspace (8 cols) */}
        <div className={`lg:col-span-8 ${!activeRoomId ? 'hidden md:block' : 'block'}`}>
          {activeRoom ? (
            <RoomChatView
              room={activeRoom}
              onUpdateRoom={handleUpdateRoom}
              onBackToList={() => setActiveRoomId(null)}
            />
          ) : (
            <div className="p-12 text-center bg-[#121729] rounded-3xl border border-slate-800 space-y-3 font-mono text-slate-400">
              <MessageSquare className="w-10 h-10 text-slate-600 mx-auto" />
              <p>Select a study room on the left or create a new room to start chatting!</p>
            </div>
          )}
        </div>

      </div>

      {/* Create Room Modal */}
      <CreateRoomModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateRoom={handleCreateRoom}
        defaultTopicTag={trackId === 'python' ? 'Python' : 'General'}
      />

    </div>
  );
}
