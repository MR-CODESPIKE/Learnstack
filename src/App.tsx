import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CourseSelectionHub from './pages/CourseSelectionHub';
import AppShell from './layouts/AppShell';
import DashboardView from './pages/DashboardView';
import LessonsView from './pages/LessonsView';
import PlaygroundView from './pages/PlaygroundView';
import SimulatorsView from './pages/SimulatorsView';
import ChallengesView from './pages/ChallengesView';
import AiTutorView from './pages/AiTutorView';
import RoomsView from './pages/RoomsView';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* 1. Landing Page (Entry for new/logged-out visitors with 3D Neural Hero) */}
        <Route path="/" element={<LandingPage />} />

        {/* 2. Dedicated Course Selection Hub */}
        <Route path="/courses" element={<CourseSelectionHub />} />

        {/* 3. Persistent App Shell Scoped to Track */}
        <Route path="/app/:trackId" element={<AppShell />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardView />} />
          <Route path="lessons" element={<LessonsView />} />
          <Route path="playground" element={<PlaygroundView />} />
          <Route path="simulators" element={<SimulatorsView />} />
          <Route path="challenges" element={<ChallengesView />} />
          <Route path="tutor" element={<AiTutorView />} />
          <Route path="rooms" element={<RoomsView />} />
          <Route path="rooms/:roomId" element={<RoomsView />} />
        </Route>

        {/* Fallback Catch-All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
