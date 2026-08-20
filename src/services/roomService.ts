import { supabase } from '../lib/supabaseClient';
import { INITIAL_ROOMS, StudyRoom, RoomMember, RoomMessage } from '../data/roomsData';

export interface DbRoom {
  id: string;
  name: string;
  topic_tag: string;
  description: string;
  created_by?: string;
  pinned_message_id?: string;
  created_at?: string;
}

export interface DbRoomMember {
  id: string;
  room_id: string;
  user_id: string;
  role: 'admin' | 'member' | 'ai';
  joined_at?: string;
  profiles?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface DbRoomMessage {
  id: string;
  room_id: string;
  sender_id: string;
  type: 'text' | 'code' | 'video' | 'voice' | 'file';
  content: string;
  code_data?: any;
  video_data?: any;
  voice_data?: any;
  file_data?: any;
  is_pinned?: boolean;
  created_at?: string;
  profiles?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export const roomService = {
  // Fetch all rooms from Supabase with member counts
  async getRooms(): Promise<StudyRoom[]> {
    const { data: dbRooms, error } = await supabase
      .from('rooms')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }

    // If no rooms exist in database, return initial fallback
    if (!dbRooms || dbRooms.length === 0) {
      return INITIAL_ROOMS;
    }

    // For each room, fetch members and messages
    const fullRooms: StudyRoom[] = await Promise.all(
      dbRooms.map(async (r) => {
        const [membersRes, msgsRes] = await Promise.all([
          supabase
            .from('room_members')
            .select(`
              id,
              room_id,
              user_id,
              role,
              profiles (
                full_name,
                avatar_url
              )
            `)
            .eq('room_id', r.id),
          supabase
            .from('room_messages')
            .select(`
              id,
              room_id,
              sender_id,
              type,
              content,
              code_data,
              video_data,
              voice_data,
              file_data,
              is_pinned,
              created_at,
              profiles (
                full_name,
                avatar_url
              )
            `)
            .eq('room_id', r.id)
            .order('created_at', { ascending: true })
        ]);

        const members: RoomMember[] = (membersRes.data || []).map((m: any) => ({
          id: m.user_id || m.id,
          name: m.profiles?.full_name || 'Scholar Member',
          avatar: m.profiles?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          role: m.role || 'member',
          isOnline: true,
        }));

        const messages: RoomMessage[] = (msgsRes.data || []).map((msg: any) => {
          const formattedTime = msg.created_at
            ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'Just now';

          return {
            id: msg.id,
            senderId: msg.sender_id,
            senderName: msg.profiles?.full_name || (msg.sender_id === 'ai-bot' ? 'LearnBot AI' : 'Student Scholar'),
            senderAvatar: msg.profiles?.avatar_url || (msg.sender_id === 'ai-bot' ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'),
            senderRole: msg.sender_id === 'ai-bot' ? 'ai' : 'member',
            timestamp: formattedTime,
            type: msg.type || 'text',
            content: msg.content || '',
            codeData: msg.code_data,
            videoData: msg.video_data,
            voiceData: msg.voice_data,
            fileData: msg.file_data,
            isPinned: msg.is_pinned || false,
          };
        });

        return {
          id: r.id,
          name: r.name,
          topicTag: r.topic_tag || 'General',
          description: r.description || '',
          memberCount: members.length || 1,
          unreadCount: 0,
          createdById: r.created_by || 'system',
          pinnedMessageId: r.pinned_message_id,
          members,
          messages,
        };
      })
    );

    return fullRooms;
  },

  // Create a new room
  async createRoom(room: { name: string; topicTag: string; description: string; userId?: string }): Promise<StudyRoom> {
    const { data, error } = await supabase
      .from('rooms')
      .insert({
        name: room.name,
        topic_tag: room.topicTag,
        description: room.description,
        created_by: room.userId || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating room:', error);
      throw error;
    }

    // Add user as admin member
    if (room.userId) {
      await supabase.from('room_members').insert({
        room_id: data.id,
        user_id: room.userId,
        role: 'admin',
      });
    }

    return {
      id: data.id,
      name: data.name,
      topicTag: data.topic_tag,
      description: data.description,
      memberCount: 1,
      unreadCount: 0,
      createdById: room.userId || 'system',
      members: [],
      messages: [],
    };
  },

  // Send a message to a room
  async sendMessage(msg: {
    roomId: string;
    senderId: string;
    type: 'text' | 'code' | 'video' | 'voice' | 'file';
    content: string;
    codeData?: any;
    videoData?: any;
    voiceData?: any;
    fileData?: any;
  }) {
    const { data, error } = await supabase
      .from('room_messages')
      .insert({
        room_id: msg.roomId,
        sender_id: msg.senderId,
        type: msg.type,
        content: msg.content,
        code_data: msg.codeData || null,
        video_data: msg.videoData || null,
        voice_data: msg.voiceData || null,
        file_data: msg.fileData || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }

    return data;
  }
};
