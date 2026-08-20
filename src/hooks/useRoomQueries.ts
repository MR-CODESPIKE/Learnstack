import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roomService } from '../services/roomService';
import { StudyRoom } from '../data/roomsData';

/**
 * Query hook for all study rooms fetched from Supabase
 */
export function useRoomsQuery() {
  return useQuery<StudyRoom[]>({
    queryKey: ['rooms'],
    queryFn: () => roomService.getRooms(),
    staleTime: 1000 * 30, // 30s stale time
    retry: 2,
  });
}

/**
 * Mutation hook to create a study room
 */
export function useCreateRoomMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newRoom: { name: string; topicTag: string; description: string; userId?: string }) =>
      roomService.createRoom(newRoom),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
}

/**
 * Mutation hook to send a room message
 */
export function useSendMessageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (msg: {
      roomId: string;
      senderId: string;
      type: 'text' | 'code' | 'video' | 'voice' | 'file';
      content: string;
      codeData?: any;
      videoData?: any;
      voiceData?: any;
      fileData?: any;
    }) => roomService.sendMessage(msg),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
}
