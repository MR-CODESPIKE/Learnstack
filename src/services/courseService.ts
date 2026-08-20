import { supabase } from '../lib/supabaseClient';

export interface DbCourse {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: 'Languages' | 'AI & ML';
  icon_name: string;
  estimated_hours: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  is_live: boolean;
  reference_doc_url?: string;
  reference_doc_label?: string;
  upcoming_modules?: string[];
  color_gradient?: string;
}

export interface DbLesson {
  id: string;
  course_id: string;
  title: string;
  short_desc: string;
  content_markdown: string;
  initial_code?: string;
  expected_output?: string;
  duration_minutes: number;
  level: string;
  topics?: string[];
  order_index: number;
  youtube_video_id?: string;
  youtube_video_title?: string;
}

export interface DbLessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  course_id: string;
  is_completed: boolean;
  completed_at?: string;
}

export interface DbQuizQuestion {
  id: string;
  course_id: string;
  lesson_id?: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
}

/**
 * Fetch all live courses from Supabase
 */
export async function fetchLiveCourses(): Promise<DbCourse[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('is_live', true);

  if (error) {
    console.warn('Error fetching courses from Supabase:', error.message);
    throw error;
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.name || row.title || 'Untitled Course',
    tagline: row.tagline || row.short_desc || '',
    description: row.description || '',
    category: row.category || 'AI & ML',
    icon_name: row.icon_name || row.icon || 'Code',
    estimated_hours: row.estimated_hours || row.duration_hours || 10,
    level: row.level || row.difficulty || 'Beginner',
    is_live: row.is_live ?? true,
    reference_doc_url: row.reference_doc_url || null,
    reference_doc_label: row.reference_doc_label || null,
    upcoming_modules: row.upcoming_modules || [],
    color_gradient: row.color_gradient || 'from-amber-500/20 to-orange-500/20',
  }));
}

/**
 * Fetch lessons for a specific course ID from Supabase
 */
export async function fetchLessonsByCourse(courseId: string): Promise<DbLesson[]> {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', courseId)
    .order('order_index', { ascending: true });

  if (error) {
    console.warn(`Error fetching lessons for course ${courseId}:`, error.message);
    throw error;
  }

  return (data || []).map((row: any, idx: number) => ({
    id: row.id,
    course_id: row.course_id || courseId,
    title: row.title || `Lesson ${idx + 1}`,
    short_desc: row.short_desc || row.description || '',
    content_markdown: row.content_markdown || row.content || 'Content coming soon.',
    initial_code: row.initial_code || row.starter_code || '# Practice Code',
    expected_output: row.expected_output || '',
    duration_minutes: row.duration_minutes || 20,
    level: row.level || 'Beginner',
    topics: row.topics || [],
    order_index: row.order_index ?? idx,
    youtube_video_id: row.youtube_video_id || null,
    youtube_video_title: row.youtube_video_title || null,
  }));
}

/**
 * Fetch user progress for all or specific course
 */
export async function fetchUserProgress(userId: string): Promise<DbLessonProgress[]> {
  if (!userId) return [];
  const { data, error } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.warn('Error fetching lesson progress:', error.message);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    user_id: row.user_id,
    lesson_id: row.lesson_id,
    course_id: row.course_id,
    is_completed: row.is_completed ?? true,
    completed_at: row.completed_at,
  }));
}

/**
 * Toggle or mark a lesson as completed in Supabase
 */
export async function toggleLessonProgress(userId: string, lessonId: string, courseId: string, isCompleted: boolean) {
  if (!userId) return;

  const { data, error } = await supabase
    .from('lesson_progress')
    .upsert({
      user_id: userId,
      lesson_id: lessonId,
      course_id: courseId,
      is_completed: isCompleted,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,lesson_id',
    });

  if (error) {
    console.error('Failed to update lesson progress:', error.message);
  }
  return { data, error };
}

export interface QuizFetchResult {
  questions: DbQuizQuestion[];
  source?: string;
  model?: string;
}

/**
 * Fetch or generate dynamic LLM quiz questions for a course track.
 * Uses Mistral primary, Gemini fallback, generating fresh questions every time.
 */
export async function fetchQuizQuestions(courseId: string, courseName?: string): Promise<DbQuizQuestion[]> {
  try {
    const res = await fetch('/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseId,
        courseName,
        count: 5,
        provider: 'auto',
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.questions) && data.questions.length > 0) {
        return data.questions.map((q: any) => ({
          ...q,
          _metaSource: data.source,
          _metaModel: data.model,
        }));
      }
    }
  } catch (apiErr) {
    console.warn(`API quiz generation endpoint failed for ${courseId}, falling back to Supabase:`, apiErr);
  }

  // Fallback: Query quizzes or quiz_questions table in Supabase
  const { data, error } = await supabase
    .from('quiz_questions')
    .select('*')
    .or(`course_id.eq.${courseId},track_id.eq.${courseId}`);

  if (error) {
    console.warn(`Error fetching quiz questions from Supabase for ${courseId}:`, error.message);
  }

  if (data && data.length > 0) {
    return data.map((row: any) => ({
      id: row.id,
      course_id: row.course_id || row.track_id || courseId,
      lesson_id: row.lesson_id,
      question: row.question,
      options: typeof row.options === 'string' ? JSON.parse(row.options) : (row.options || []),
      correct_answer: row.correct_answer ?? row.correctAnswer ?? 0,
      explanation: row.explanation || '',
      difficulty: row.difficulty || 'Beginner',
      category: row.category || 'General',
    }));
  }

  // Final fallback
  return [
    {
      id: `gen_fallback_1_${Date.now()}`,
      course_id: courseId,
      question: `What is a fundamental concept in ${courseName || courseId}?`,
      options: ["Core structural logic and parameters", "Unused network traffic", "Hard drive spindle rotation speed", "Unregistered binary flags"],
      correct_answer: 0,
      explanation: "Understanding foundational mechanics allows you to construct scalable architectures.",
      difficulty: "Beginner",
      category: courseName || courseId,
    }
  ];
}
