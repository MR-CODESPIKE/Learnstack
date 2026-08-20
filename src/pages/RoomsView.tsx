import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRoomsQuery, useCreateRoomMutation } from '../hooks/useRoomQueries';
import { StudyRoom } from '../data/roomsData';
import RoomChatView from '../components/rooms/RoomChatView';
import CreateRoomModal from '../components/rooms/CreateRoomModal';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, Plus, Search, MessageSquare, Sparkles, AlertCircle, RefreshCw 
} from 'lucide-react';

export default function RoomsView() {
  const { trackId = 'ai-fundamentals' } = useParams<{ trackId: string }>();
  const { user } = useAuth();

  const { data: rooms = [], isLoading, isError, error, refetch } = useRoomsQuery();
  const createRoomMutation = useCreateRoomMutation();

  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Set active room once rooms load if not set
  const effectiveActiveRoomId = activeRoomId || (rooms.length > 0 ? rooms[0].id : null);
  const activeRoom = rooms.find((r) => r.id === effectiveActiveRoomId) || rooms[0];

  const handleCreateRoom = async (newRoomData: { name: string; topicTag: string; description: string }) => {
    try {
      const created = await createRoomMutation.mutateAsync({
        ...newRoomData,
        userId: user?.id,
      });
      setActiveRoomId(created.id);
      setShowCreateModal(false);
    } catch (err) {
      console.error('Failed to create room:', err);
    }
  };

  const handleUpdateRoom = (updatedRoom: StudyRoom) => {
    // Handled via React Query refetch or optimistic state
  };

  const filteredRooms = rooms.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.topicTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto selection:bg-[#A6632B]/20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl liquid-glass-dock border border-[#D6C5B3]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass-pill text-xs font-mono text-[#8C4A1B] font-bold">
            <Users className="w-3.5 h-3.5 text-[#A6632B]" />
            <span>Collaborative Study Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#2A1E17]">
            Peer Study Rooms & AI Chat
          </h1>
          <p className="text-xs font-mono text-[#6E5D4F]">
            Real-time group chat threads backed by Supabase with code sharing, Hugging Face media attachments, YouTube embeds, and inline LearnBot AI.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#A6632B] via-[#C77A38] to-[#8C4A1B] text-white font-mono text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Room</span>
        </button>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="p-8 rounded-3xl liquid-glass-card border border-[#D6C5B3] animate-pulse space-y-4">
          <div className="h-6 bg-[#D6C5B3]/50 rounded w-1/4" />
          <div className="h-12 bg-[#D6C5B3]/30 rounded-xl" />
          <div className="h-48 bg-[#D6C5B3]/20 rounded-2xl" />
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="p-8 rounded-3xl liquid-glass-dock border border-rose-500/30 text-center space-y-4 max-w-lg mx-auto">
          <AlertCircle className="w-12 h-12 text-rose-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#2A1E17]">Failed to load study rooms</h3>
            <p className="text-xs font-mono text-[#6E5D4F]">
              {(error as Error)?.message || 'Could not connect to Supabase rooms database.'}
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#A6632B] via-[#C77A38] to-[#8C4A1B] text-white text-xs font-mono font-bold flex items-center justify-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Loading</span>
          </button>
        </div>
      )}

      {/* Main Grid: Room List Sidebar + Active Room Chat Workspace */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Room List Sidebar (4 cols) */}
          <div className={`lg:col-span-4 space-y-4 ${effectiveActiveRoomId ? 'hidden md:block' : 'block'}`}>
            
            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#8C4A1B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter rooms by topic or name..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl liquid-glass-card border border-[#D6C5B3] text-xs font-mono text-[#2A1E17] placeholder-[#6E5D4F] focus:outline-none focus:border-[#A6632B]"
              />
            </div>

            {/* Room Cards List */}
            <div className="space-y-2.5 max-h-[70vh] overflow-y-auto pr-1">
              {filteredRooms.map((room) => {
                const isActive = room.id === effectiveActiveRoomId;
                const lastMsg = room.messages[room.messages.length - 1];

                return (
                  <div
                    key={room.id}
                    onClick={() => setActiveRoomId(room.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer group space-y-2.5 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#A6632B]/15 via-[#C77A38]/10 to-[#FAF4ED] border-[#A6632B] shadow-md'
                        : 'liquid-glass-card border-[#D6C5B3] hover:border-[#A6632B]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-7 h-7 rounded-lg bg-[#A6632B]/20 border border-[#A6632B]/30 flex items-center justify-center text-[#8C4A1B] font-mono text-xs font-bold shrink-0">
                          #
                        </div>
                        <span className="font-display font-bold text-sm text-[#2A1E17] group-hover:text-[#A6632B] transition-colors truncate">
                          {room.name}
                        </span>
                      </div>

                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full liquid-glass-pill border border-[#D6C5B3] text-[#8C4A1B] font-bold shrink-0">
                        {room.topicTag}
                      </span>
                    </div>

                    <p className="text-xs font-mono text-[#6E5D4F] line-clamp-1">
                      {room.description}
                    </p>

                    <div className="pt-2 border-t border-[#D6C5B3]/60 flex items-center justify-between text-[11px] font-mono text-[#6E5D4F]">
                      <div className="truncate max-w-[180px] text-[#6E5D4F]">
                        {lastMsg ? `${lastMsg.senderName.split(' ')[0]}: ${lastMsg.content}` : 'No messages yet'}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span>{room.memberCount} members</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Column: Active Room Chat Workspace (8 cols) */}
          <div className={`lg:col-span-8 ${!effectiveActiveRoomId ? 'hidden md:block' : 'block'}`}>
            {activeRoom ? (
              <RoomChatView
                room={activeRoom}
                onUpdateRoom={handleUpdateRoom}
                onBackToList={() => setActiveRoomId(null)}
              />
            ) : (
              <div className="p-12 text-center liquid-glass-card rounded-3xl border border-[#D6C5B3] space-y-3 font-mono text-[#6E5D4F]">
                <MessageSquare className="w-10 h-10 text-[#A6632B] mx-auto" />
                <p>Select a study room on the left or create a new room to start chatting!</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Create Room Modal */}
      <CreateRoomModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateRoom={handleCreateRoom}
        defaultTopicTag={trackId === 'ai-fundamentals' ? 'AI' : 'General'}
      />

    </div>
  );
}
