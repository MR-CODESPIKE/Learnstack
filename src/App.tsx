import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TopicPills from './components/TopicPills';
import LessonsTrack from './components/LessonsTrack';
import AiTutor from './components/AiTutor';
import CodePlayground from './components/CodePlayground';
import CodingChallenges from './components/CodingChallenges';
import SimulatorsSection from './components/SimulatorsSection';
import QuickNavDock from './components/QuickNavDock';
import Footer from './components/Footer';
import { TopicId } from './types';
import { PYTHON_LESSONS } from './data/curriculumData';

export default function App() {
  const [selectedTopic, setSelectedTopic] = useState<TopicId>('python');
  
  // Persistence for completed lessons in localStorage
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('learnstack_completed_lessons');
      return saved ? JSON.parse(saved) : ['py-01'];
    } catch {
      return ['py-01'];
    }
  });

  const [playgroundCode, setPlaygroundCode] = useState<string | undefined>(undefined);
  const [tutorQuestion, setTutorQuestion] = useState<string | undefined>(undefined);

  useEffect(() => {
    try {
      localStorage.setItem('learnstack_completed_lessons', JSON.stringify(completedLessonIds));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [completedLessonIds]);

  const handleToggleComplete = (id: string) => {
    setCompletedLessonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSendToPlayground = (code: string) => {
    setPlaygroundCode(code);
    const element = document.getElementById('playground');
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const handleOpenTutorWithQuestion = (q: string) => {
    setTutorQuestion(q);
    const element = document.getElementById('tutor');
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const scrollToTutor = () => {
    const element = document.getElementById('tutor');
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5EFE6] text-[#2A1E17] font-sans antialiased selection:bg-[#A6632B]/20 selection:text-[#8C4A1B]">
      {/* Top Navbar */}
      <Navbar
        onOpenTutor={scrollToTutor}
        completedCount={completedLessonIds.length}
        totalLessons={PYTHON_LESSONS.length}
      />

      {/* Main Content Sections */}
      <main>
        {/* Hero Section with Signature 3D Neural Net */}
        <Hero onOpenTutor={scrollToTutor} />

        {/* Topic Pills Row */}
        <TopicPills
          selectedTopic={selectedTopic}
          onSelectTopic={(topicId) => setSelectedTopic(topicId)}
        />

        {/* Python Lessons Track Roadmap */}
        <LessonsTrack
          completedLessonIds={completedLessonIds}
          onToggleComplete={handleToggleComplete}
          onSendToPlayground={handleSendToPlayground}
          onOpenTutorWithQuestion={handleOpenTutorWithQuestion}
        />

        {/* AI Tutor Chat Panel */}
        <AiTutor initialQuestion={tutorQuestion} />

        {/* Code Playground with Scroll Focus Zoom Transition */}
        <CodePlayground initialCode={playgroundCode} />

        {/* Coding Challenges with Automated Test Runner */}
        <CodingChallenges
          onSendToPlayground={handleSendToPlayground}
          onOpenTutorWithQuestion={handleOpenTutorWithQuestion}
        />

        {/* Interactive Simulators (Neural Builder, Transformer, Sorting, 2D Net) */}
        <SimulatorsSection onSendToPlayground={handleSendToPlayground} />
      </main>

      {/* Floating Quick Navigation Dock */}
      <QuickNavDock onOpenTutor={scrollToTutor} />

      {/* On-Brand Footer */}
      <Footer />
    </div>
  );
}


