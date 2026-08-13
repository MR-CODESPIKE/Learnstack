import React, { useState } from 'react';
import { X, ShieldCheck, Trash2, Edit3, UserX, Pin, Check } from 'lucide-react';
import { StudyRoom, RoomMember } from '../../data/roomsData';

interface RoomSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: StudyRoom;
  isAdmin: boolean;
  onUpdateRoomInfo: (name: string, topicTag: string, description: string) => void;
  onRemoveMember: (memberId: string) => void;
  onUnpinMessage: () => void;
}

export default function RoomSettingsModal({
  isOpen,
  onClose,
  room,
  isAdmin,
  onUpdateRoomInfo,
  onRemoveMember,
  onUnpinMessage,
}: RoomSettingsModalProps) {
  const [name, setName] = useState(room.name);
  const [topicTag, setTopicTag] = useState(room.topicTag);
  const [description, setDescription] = useState(room.description);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateRoomInfo(name, topicTag, description);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#121729] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-6 max-h-[85vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#22D3EE]" />
            <h3 className="text-lg font-display font-bold text-white">Room Details & Admin Panel</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Admin Warning for non-admins */}
        {!isAdmin && (
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-xs font-mono text-slate-300">
            ℹ️ You are viewing this room as a Member. Admin controls (editing room name, removing members) are available to the Room Creator.
          </div>
        )}

        {/* Admin Section: Edit Room Name & Tag */}
        {isAdmin && (
          <form onSubmit={handleSaveInfo} className="space-y-4 text-xs font-mono border-b border-slate-800 pb-5">
            <div className="font-bold text-[#22D3EE] uppercase tracking-wider text-[11px]">
              Admin Controls: Edit Room Info
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300">Room Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#0A0E1A] border border-slate-800 text-slate-200 focus:outline-none focus:border-[#7C5CFC]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300">Topic Tag</label>
              <input
                type="text"
                value={topicTag}
                onChange={(e) => setTopicTag(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#0A0E1A] border border-slate-800 text-slate-200 focus:outline-none focus:border-[#7C5CFC]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#0A0E1A] border border-slate-800 text-slate-200 focus:outline-none focus:border-[#7C5CFC] resize-none"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#7C5CFC] hover:bg-[#6843EC] text-white font-bold flex items-center gap-2 transition-all"
            >
              {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Edit3 className="w-4 h-4" />}
              <span>{saved ? 'Saved Changes!' : 'Update Room Settings'}</span>
            </button>
          </form>
        )}

        {/* Pinned Message Section */}
        {room.pinnedMessageId && (
          <div className="space-y-2 border-b border-slate-800 pb-5 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-300 font-bold">
              <span className="flex items-center gap-1.5 text-[#FFB020]">
                <Pin className="w-3.5 h-3.5" /> Pinned Room Announcement
              </span>
              {isAdmin && (
                <button
                  onClick={onUnpinMessage}
                  className="text-slate-400 hover:text-red-400 text-[11px] underline"
                >
                  Unpin Announcement
                </button>
              )}
            </div>
            <div className="p-3 rounded-xl bg-[#0A0E1A] border border-slate-800 text-slate-300">
              {room.messages.find((m) => m.id === room.pinnedMessageId)?.content || 'Pinned message active.'}
            </div>
          </div>
        )}

        {/* Members Management List */}
        <div className="space-y-3 text-xs font-mono">
          <div className="flex justify-between items-center text-slate-300 font-bold">
            <span>Room Members ({room.members.length})</span>
            <span className="text-slate-500 text-[11px]">{room.memberCount} enrolled</span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {room.members.map((member) => (
              <div
                key={member.id}
                className="p-2.5 rounded-xl bg-[#0A0E1A] border border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="relative">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    {member.isOnline && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0A0E1A] absolute bottom-0 right-0" />
                    )}
                  </div>

                  <div className="truncate">
                    <div className="font-bold text-white truncate flex items-center gap-1.5">
                      <span>{member.name}</span>
                      {member.role === 'admin' && (
                        <span className="text-[9px] bg-amber-500/20 text-[#FFB020] border border-amber-500/30 px-1.5 py-0.2 rounded font-bold">
                          Admin
                        </span>
                      )}
                      {member.role === 'ai' && (
                        <span className="text-[9px] bg-cyan-500/20 text-[#22D3EE] border border-cyan-500/30 px-1.5 py-0.2 rounded font-bold">
                          AI
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {isAdmin && member.role === 'member' && (
                  <button
                    onClick={() => onRemoveMember(member.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 transition-colors"
                    title="Remove member from room"
                  >
                    <UserX className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
