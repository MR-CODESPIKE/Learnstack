import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchLiveCourses, 
  fetchLessonsByCourse, 
  fetchUserProgress, 
  fetchQuizQuestions, 
  toggleLessonProgress,
  DbCourse, 
  DbLesson, 
  DbLessonProgress, 
  DbQuizQuestion 
} from '../services/courseService';

/**
 * Query hook for all live courses (cached across session)
 */
export function useCoursesQuery() {
  return useQuery<DbCourse[]>({
    queryKey: ['courses'],
    queryFn: fetchLiveCourses,
    staleTime: 1000 * 60 * 15, // 15 minutes in-memory cache
    gcTime: 1000 * 60 * 30,
    retry: 2,
  });
}

/**
 * Query hook for lessons in a specific course
 */
export function useLessonsQuery(courseId: string) {
  return useQuery<DbLesson[]>({
    queryKey: ['lessons', courseId],
    queryFn: () => fetchLessonsByCourse(courseId),
    enabled: Boolean(courseId),
    staleTime: 1000 * 60 * 15, // 15 minutes in-memory cache
    gcTime: 1000 * 60 * 30,
    retry: 2,
  });
}

/**
 * Query hook for user lesson progress
 */
export function useUserProgressQuery(userId: string | undefined) {
  return useQuery<DbLessonProgress[]>({
    queryKey: ['user_progress', userId],
    queryFn: () => fetchUserProgress(userId || ''),
    enabled: Boolean(userId),
    staleTime: 1000 * 10, // 10s stale time for user progress
  });
}

/**
 * Query hook for quiz questions in a course.
 * Uses LLMs (Mistral primary, Gemini fallback) to generate unique questions on each request.
 */
export function useQuizQuestionsQuery(courseId: string, courseName?: string) {
  return useQuery<DbQuizQuestion[]>({
    queryKey: ['quizzes', courseId],
    queryFn: () => fetchQuizQuestions(courseId, courseName),
    enabled: Boolean(courseId),
    staleTime: 0, // Always fetch fresh LLM-generated questions when invalidated or remounted
    retry: 1,
  });
}

/**
 * Mutation hook to toggle lesson completion
 */
export function useToggleLessonMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, lessonId, courseId, isCompleted }: { userId: string; lessonId: string; courseId: string; isCompleted: boolean }) =>
      toggleLessonProgress(userId, lessonId, courseId, isCompleted),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user_progress', variables.userId] });
    },
  });
}
